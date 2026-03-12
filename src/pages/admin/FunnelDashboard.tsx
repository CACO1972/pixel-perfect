/**
 * FunnelDashboard — /admin/funnel
 * Muestra el embudo de conversión en tiempo real desde Supabase.
 *
 * Acceso: solo con service_role key (no exponer en producción sin auth)
 * Por ahora: página interna accesible desde /admin/funnel
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FunnelCount {
  event: string;
  count: number;
}

interface RecentEvent {
  id: number;
  event: string;
  nombre: string | null;
  email: string | null;
  motivo: string | null;
  zona: string | null;
  created_at: string;
}

const MOTIVO_LABEL: Record<string, string> = {
  faltan_dientes:  "Me faltan dientes",
  mejorar_sonrisa: "Mejorar sonrisa",
  dolor:           "Dolor",
  ortodoncia:      "Ortodoncia",
  segunda_opinion: "Segunda opinión",
  preventivo:      "Preventivo",
};

const EVENT_COLORS: Record<string, string> = {
  wizard_start:    "#c9a87c",
  ai_result:       "#64b5f6",
  payment_success: "#81c784",
};

const EVENT_LABELS: Record<string, string> = {
  wizard_start:    "Iniciaron evaluación",
  ai_result:       "Vieron resultado IA",
  payment_success: "Pagaron ($49.000)",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function FunnelDashboard() {
  const [counts, setCounts]   = useState<FunnelCount[]>([]);
  const [recent, setRecent]   = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange]     = useState<"7d" | "30d" | "all">("30d");

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  async function loadData() {
    setLoading(true);

    // Date filter
    let since: string | null = null;
    const now = new Date();
    if (range === "7d")  { const d = new Date(now); d.setDate(d.getDate() - 7);  since = d.toISOString(); }
    if (range === "30d") { const d = new Date(now); d.setDate(d.getDate() - 30); since = d.toISOString(); }

    // Count per event
    const events: FunnelEvent[] = ["wizard_start", "ai_result", "payment_success"];
    const results: FunnelCount[] = [];

    for (const ev of events) {
      let q = (supabase.from("funnel_events") as any).select("id", { count: "exact", head: true }).eq("event", ev);
      if (since) q = q.gte("created_at", since);
      const { count } = await q;
      results.push({ event: ev, count: count ?? 0 });
    }
    setCounts(results);

    // Recent payment events
    let q2 = (supabase.from("funnel_events") as any)
      .select("id, event, nombre, email, motivo, zona, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (since) q2 = q2.gte("created_at", since);
    const { data } = await q2;
    setRecent((data ?? []) as RecentEvent[]);

    setLoading(false);
  }

  // Conversion rates
  const starts   = counts.find(c => c.event === "wizard_start")?.count   ?? 0;
  const aiViewed = counts.find(c => c.event === "ai_result")?.count      ?? 0;
  const paid     = counts.find(c => c.event === "payment_success")?.count ?? 0;
  const convAI   = starts > 0 ? ((aiViewed / starts) * 100).toFixed(1) : "—";
  const convPay  = starts > 0 ? ((paid     / starts) * 100).toFixed(1) : "—";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ede8", fontFamily: "'DM Sans', sans-serif", padding: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#c9a87c", letterSpacing: "0.05em" }}>
            FUNNEL DASHBOARD
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>
            Clínica Miró — Evaluación Premium
          </p>
        </div>

        {/* Range selector */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(["7d", "30d", "all"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "6px 16px",
                borderRadius: "4px",
                border: `1px solid ${range === r ? "#c9a87c" : "#333"}`,
                background: range === r ? "rgba(201,168,124,0.15)" : "transparent",
                color: range === r ? "#c9a87c" : "#666",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {r === "7d" ? "7 días" : r === "30d" ? "30 días" : "Todo"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#555" }}>Cargando…</div>
      ) : (
        <>
          {/* Funnel cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
            {(["wizard_start", "ai_result", "payment_success"] as const).map((ev, i) => {
              const cnt = counts.find(c => c.event === ev)?.count ?? 0;
              const prev = i === 0 ? null : (counts[i-1]?.count ?? 0);
              const dropPct = prev && prev > 0 ? (((prev - cnt) / prev) * 100).toFixed(0) : null;
              return (
                <div key={ev} style={{
                  background: "#111",
                  border: `1px solid ${EVENT_COLORS[ev]}33`,
                  borderRadius: "8px",
                  padding: "1.5rem 2rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, height: "3px",
                    width: "100%", background: EVENT_COLORS[ev]
                  }} />
                  <div style={{ fontSize: "0.72rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                    {["01", "02", "03"][i]} — {EVENT_LABELS[ev]}
                  </div>
                  <div style={{ fontSize: "3.5rem", fontWeight: 900, color: EVENT_COLORS[ev], lineHeight: 1 }}>
                    {cnt.toLocaleString("es-CL")}
                  </div>
                  {dropPct && (
                    <div style={{ fontSize: "0.8rem", color: "#e57373", marginTop: "0.5rem" }}>
                      ↓ {dropPct}% drop desde paso anterior
                    </div>
                  )}
                  {ev === "payment_success" && (
                    <div style={{ fontSize: "0.9rem", color: "#81c784", marginTop: "0.4rem", fontWeight: 600 }}>
                      ${(cnt * 49000).toLocaleString("es-CL")} CLP generados
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Conversion rates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.2rem 1.5rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Inicio → Resultado IA
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#64b5f6" }}>{convAI}%</div>
            </div>
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "1.2rem 1.5rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Inicio → Pago (conversión total)
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#81c784" }}>{convPay}%</div>
            </div>
          </div>

          {/* Recent events */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #1e1e1e" }}>
              <span style={{ fontSize: "0.72rem", color: "#666", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Actividad reciente
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                  {["Evento", "Nombre", "Email", "Motivo", "Fecha"].map(h => (
                    <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", color: "#555", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((ev) => (
                  <tr key={ev.id} style={{ borderBottom: "1px solid #161616" }}>
                    <td style={{ padding: "0.7rem 1rem" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        background: `${EVENT_COLORS[ev.event]}22`,
                        color: EVENT_COLORS[ev.event],
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}>
                        {ev.event.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.7rem 1rem", color: "#ccc" }}>{ev.nombre ?? "—"}</td>
                    <td style={{ padding: "0.7rem 1rem", color: "#888" }}>{ev.email ?? "—"}</td>
                    <td style={{ padding: "0.7rem 1rem", color: "#888" }}>{MOTIVO_LABEL[ev.motivo ?? ""] ?? ev.motivo ?? "—"}</td>
                    <td style={{ padding: "0.7rem 1rem", color: "#555", fontSize: "0.75rem" }}>
                      {new Date(ev.created_at).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#444" }}>
                      Sin eventos en este período
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

type FunnelEvent = "wizard_start" | "ai_result" | "payment_success";
