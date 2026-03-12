/**
 * FunnelDashboard — /admin/funnel
 * Protegido con PIN local (no exponer service_role en producción).
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_PIN = "miro2024";   // cambia esto desde Lovable si quieres

interface FunnelCount  { event: string; count: number; }
interface RecentEvent  { id: number; event: string; nombre: string | null; email: string | null; motivo: string | null; zona: string | null; created_at: string; }

const MOTIVO_LABEL: Record<string,string> = {
  faltan_dientes: "Me faltan dientes", mejorar_sonrisa: "Mejorar sonrisa",
  dolor: "Dolor", ortodoncia: "Ortodoncia", segunda_opinion: "Segunda opinión", preventivo: "Preventivo",
};
const EVENT_COLORS: Record<string,string> = { wizard_start:"#c9a87c", ai_result:"#64b5f6", payment_success:"#81c784" };
const EVENT_LABELS: Record<string,string> = { wizard_start:"Iniciaron evaluación", ai_result:"Vieron resultado IA", payment_success:"Pagaron ($49.000)" };
type FunnelEvent = "wizard_start" | "ai_result" | "payment_success";

// ── PIN Gate ──────────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const check = () => {
    if (pin === ADMIN_PIN) { sessionStorage.setItem("miro_admin", "1"); onUnlock(); }
    else { setErr(true); setPin(""); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1.5rem", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ fontSize:"0.72rem", letterSpacing:"0.15em", textTransform:"uppercase", color:"#c9a87c" }}>CLÍNICA MIRÓ — ADMIN</div>
      <input
        type="password"
        value={pin}
        onChange={e => setPin(e.target.value)}
        onKeyDown={e => e.key === "Enter" && check()}
        placeholder="PIN de acceso"
        autoFocus
        style={{ background:"#111", border:`1px solid ${err?"#e57373":"#333"}`, borderRadius:"4px", padding:"10px 18px", color:"#f0ede8", fontSize:"1rem", outline:"none", width:"220px", textAlign:"center", letterSpacing:"0.2em" }}
      />
      <button onClick={check} style={{ padding:"8px 24px", background:"#c9a87c", border:"none", borderRadius:"4px", color:"#0a0a0a", fontWeight:700, cursor:"pointer", fontSize:"0.85rem", letterSpacing:"0.08em" }}>
        ENTRAR
      </button>
      {err && <div style={{ color:"#e57373", fontSize:"0.8rem" }}>PIN incorrecto</div>}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function FunnelDashboard() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("miro_admin") === "1");
  const [counts, setCounts]     = useState<FunnelCount[]>([]);
  const [recent, setRecent]     = useState<RecentEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [range, setRange]       = useState<"7d"|"30d"|"all">("30d");

  useEffect(() => { if (unlocked) loadData(); }, [unlocked, range]);

  async function loadData() {
    setLoading(true);
    let since: string | null = null;
    const now = new Date();
    if (range === "7d")  { const d = new Date(now); d.setDate(d.getDate()-7);  since = d.toISOString(); }
    if (range === "30d") { const d = new Date(now); d.setDate(d.getDate()-30); since = d.toISOString(); }

    const events: FunnelEvent[] = ["wizard_start","ai_result","payment_success"];
    const results: FunnelCount[] = [];
    for (const ev of events) {
      let q = (supabase.from("funnel_events") as any).select("id",{count:"exact",head:true}).eq("event",ev);
      if (since) q = q.gte("created_at",since);
      const { count } = await q;
      results.push({ event:ev, count:count??0 });
    }
    setCounts(results);

    let q2 = (supabase.from("funnel_events") as any).select("id,event,nombre,email,motivo,zona,created_at").order("created_at",{ascending:false}).limit(20);
    if (since) q2 = q2.gte("created_at",since);
    const { data } = await q2;
    setRecent((data??[]) as RecentEvent[]);
    setLoading(false);
  }

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  const starts   = counts.find(c=>c.event==="wizard_start")?.count   ?? 0;
  const aiViewed = counts.find(c=>c.event==="ai_result")?.count      ?? 0;
  const paid     = counts.find(c=>c.event==="payment_success")?.count ?? 0;
  const convAI   = starts>0 ? ((aiViewed/starts)*100).toFixed(1) : "—";
  const convPay  = starts>0 ? ((paid/starts)*100).toFixed(1)     : "—";

  const s: Record<string,React.CSSProperties> = {
    page:  { minHeight:"100vh", background:"#0a0a0a", color:"#f0ede8", fontFamily:"'DM Sans',sans-serif", padding:"2rem" },
    card:  { background:"#111", border:"1px solid #222", borderRadius:"8px", padding:"1.2rem 1.5rem" },
    label: { fontSize:"0.72rem", color:"#666", letterSpacing:"0.12em", textTransform:"uppercase" as const, marginBottom:"0.5rem" },
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"2.5rem" }}>
        <div>
          <h1 style={{ fontSize:"1.6rem", fontWeight:800, color:"#c9a87c", letterSpacing:"0.05em" }}>FUNNEL DASHBOARD</h1>
          <p style={{ fontSize:"0.85rem", color:"#666", marginTop:"4px" }}>Clínica Miró — Evaluación Premium</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          {(["7d","30d","all"] as const).map(r => (
            <button key={r} onClick={()=>setRange(r)} style={{ padding:"6px 16px", borderRadius:"4px", border:`1px solid ${range===r?"#c9a87c":"#333"}`, background:range===r?"rgba(201,168,124,0.15)":"transparent", color:range===r?"#c9a87c":"#666", cursor:"pointer", fontSize:"0.8rem", fontWeight:600 }}>
              {r==="7d"?"7 días":r==="30d"?"30 días":"Todo"}
            </button>
          ))}
          <button onClick={()=>{sessionStorage.removeItem("miro_admin");setUnlocked(false);}} style={{ padding:"6px 14px", borderRadius:"4px", border:"1px solid #333", background:"transparent", color:"#555", cursor:"pointer", fontSize:"0.75rem" }}>
            Salir
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"4rem", color:"#555" }}>Cargando…</div>
      ) : (
        <>
          {/* Funnel cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem", marginBottom:"2rem" }}>
            {(["wizard_start","ai_result","payment_success"] as const).map((ev,i) => {
              const cnt  = counts.find(c=>c.event===ev)?.count ?? 0;
              const prev = i===0 ? null : (counts[i-1]?.count ?? 0);
              const dropPct = prev&&prev>0 ? (((prev-cnt)/prev)*100).toFixed(0) : null;
              return (
                <div key={ev} style={{ background:"#111", border:`1px solid ${EVENT_COLORS[ev]}33`, borderRadius:"8px", padding:"1.5rem 2rem", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, height:"3px", width:"100%", background:EVENT_COLORS[ev] }} />
                  <div style={{ ...s.label, marginBottom:"0.75rem" }}>{["01","02","03"][i]} — {EVENT_LABELS[ev]}</div>
                  <div style={{ fontSize:"3.5rem", fontWeight:900, color:EVENT_COLORS[ev], lineHeight:1 }}>{cnt.toLocaleString("es-CL")}</div>
                  {dropPct && <div style={{ fontSize:"0.8rem", color:"#e57373", marginTop:"0.5rem" }}>↓ {dropPct}% drop desde paso anterior</div>}
                  {ev==="payment_success" && <div style={{ fontSize:"0.9rem", color:"#81c784", marginTop:"0.4rem", fontWeight:600 }}>${(cnt*49000).toLocaleString("es-CL")} CLP generados</div>}
                </div>
              );
            })}
          </div>

          {/* Conversion rates */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2rem" }}>
            <div style={s.card}><div style={s.label}>Inicio → Resultado IA</div><div style={{ fontSize:"2.2rem", fontWeight:800, color:"#64b5f6" }}>{convAI}%</div></div>
            <div style={s.card}><div style={s.label}>Inicio → Pago (conversión total)</div><div style={{ fontSize:"2.2rem", fontWeight:800, color:"#81c784" }}>{convPay}%</div></div>
          </div>

          {/* Recent events */}
          <div style={{ background:"#111", border:"1px solid #222", borderRadius:"8px", overflow:"hidden" }}>
            <div style={{ padding:"1rem 1.5rem", borderBottom:"1px solid #1e1e1e" }}>
              <span style={s.label}>Actividad reciente</span>
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.85rem" }}>
              <thead>
                <tr style={{ borderBottom:"1px solid #1e1e1e" }}>
                  {["Evento","Nombre","Email","Motivo","Fecha"].map(h=>(
                    <th key={h} style={{ padding:"0.6rem 1rem", textAlign:"left", color:"#555", fontWeight:500, fontSize:"0.72rem", letterSpacing:"0.08em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(ev=>(
                  <tr key={ev.id} style={{ borderBottom:"1px solid #161616" }}>
                    <td style={{ padding:"0.7rem 1rem" }}>
                      <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"3px", background:`${EVENT_COLORS[ev.event]}22`, color:EVENT_COLORS[ev.event], fontSize:"0.72rem", fontWeight:600 }}>
                        {ev.event.replace("_"," ")}
                      </span>
                    </td>
                    <td style={{ padding:"0.7rem 1rem", color:"#ccc" }}>{ev.nombre??"—"}</td>
                    <td style={{ padding:"0.7rem 1rem", color:"#888" }}>{ev.email??"—"}</td>
                    <td style={{ padding:"0.7rem 1rem", color:"#888" }}>{MOTIVO_LABEL[ev.motivo??""]??ev.motivo??"—"}</td>
                    <td style={{ padding:"0.7rem 1rem", color:"#555", fontSize:"0.75rem" }}>{new Date(ev.created_at).toLocaleString("es-CL",{dateStyle:"short",timeStyle:"short"})}</td>
                  </tr>
                ))}
                {recent.length===0 && <tr><td colSpan={5} style={{ padding:"2rem", textAlign:"center", color:"#444" }}>Sin eventos en este período</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
