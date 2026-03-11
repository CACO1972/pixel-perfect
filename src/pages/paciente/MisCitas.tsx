/**
 * MisCitas — Portal Paciente · Clínica Miró
 * Consulta citas desde tabla `appointments` del Supabase oficial
 * Supabase ref: jipldlklzobiytkvxokf
 *
 * Tabla requerida:
 *   appointments (
 *     id, patient_id, appointment_date, appointment_time,
 *     duration_minutes, status, notes,
 *     treatment_id → treatments(name, description, duration_minutes, base_price),
 *     dentist_id   → users(first_name, last_name, phone)
 *   )
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar, Clock, User, Phone,
  AlertCircle, CheckCircle, XCircle, ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: string;
  notes: string;
  treatment: { name: string; description: string; duration_minutes: number; base_price: number } | null;
  dentist: { first_name: string; last_name: string; phone: string } | null;
}

const getStatusBadge = (s: string) => {
  const map: Record<string, { label: string; style: string }> = {
    scheduled:   { label: "Programada",  style: "background:#dbeafe;color:#1e40af" },
    confirmed:   { label: "Confirmada",  style: "background:#d1fae5;color:#065f46" },
    in_progress: { label: "En Progreso", style: "background:#fef3c7;color:#92400e" },
    completed:   { label: "Completada",  style: "background:#f0fdf4;color:#166534" },
    cancelled:   { label: "Cancelada",   style: "background:#fee2e2;color:#991b1b" },
    no_show:     { label: "No Asistió",  style: "background:#fff7ed;color:#9a3412" },
  };
  const { label, style } = map[s] ?? { label: s, style: "background:#f3f4f6;color:#374151" };
  return (
    <span style={{ fontFamily: "monospace", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 10px", ...Object.fromEntries(style.split(";").map(p => p.split(":").map(x => x.trim())).filter(x => x.length === 2)) }}>
      {label}
    </span>
  );
};

const AppointmentCard = ({ apt }: { apt: Appointment }) => (
  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: ".75rem" }}>
      <div>
        <div style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1rem" }}>
          {apt.treatment?.name ?? "Consulta"}
        </div>
        <div style={{ fontFamily: "var(--font-b)", fontSize: ".85rem", color: "var(--mid)", marginTop: 3 }}>
          {format(new Date(apt.appointment_date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </div>
      </div>
      {getStatusBadge(apt.status)}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: ".75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Clock style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
        <span style={{ fontSize: ".85rem" }}>
          {apt.appointment_time} · {apt.duration_minutes ?? apt.treatment?.duration_minutes ?? 60} min
        </span>
      </div>
      {apt.dentist && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <User style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontSize: ".85rem" }}>Dr. {apt.dentist.first_name} {apt.dentist.last_name}</span>
        </div>
      )}
      {apt.dentist?.phone && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Phone style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontSize: ".85rem" }}>{apt.dentist.phone}</span>
        </div>
      )}
    </div>

    {apt.treatment?.description && (
      <p style={{ fontSize: ".85rem", color: "var(--mid)", lineHeight: 1.6 }}>{apt.treatment.description}</p>
    )}

    {apt.notes && (
      <div style={{ paddingTop: ".75rem", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "monospace", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4, display: "block" }}>Notas</span>
        <p style={{ fontSize: ".85rem", color: "var(--mid)" }}>{apt.notes}</p>
      </div>
    )}

    {apt.status === "scheduled" && (
      <div style={{ display: "flex", gap: ".75rem", paddingTop: ".5rem" }}>
        <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" style={{ borderRadius: 0, fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
            <ExternalLink style={{ width: 12, height: 12 }} />Reprogramar
          </Button>
        </a>
      </div>
    )}
  </div>
);

const MisCitas = () => {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const select = `id,appointment_date,appointment_time,duration_minutes,status,notes,treatment:treatments(name,description,duration_minutes,base_price),dentist:users!appointments_dentist_id_fkey(first_name,last_name,phone)`;

      const [{ data: up }, { data: past }] = await Promise.all([
        supabase.from("appointments").select(select).eq("patient_id", user.id).gte("appointment_date", today).order("appointment_date"),
        supabase.from("appointments").select(select).eq("patient_id", user.id).lt("appointment_date", today).order("appointment_date", { ascending: false }),
      ]);

      setUpcoming((up as Appointment[]) ?? []);
      setPast((past as Appointment[]) ?? []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <span style={{ fontFamily: "monospace", fontSize: ".75rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--mid)", animation: "pulse-dot 1.5s ease-in-out infinite" }}>Cargando citas…</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>Portal Paciente</p>
        <h1 style={{ fontFamily: "var(--font-s)", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1 }}>Mis Citas</h1>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
          <Button style={{ borderRadius: 0, fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", background: "var(--accent)", color: "var(--accent-fg)", border: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar style={{ width: 14, height: 14 }} />Agendar Nueva Cita
          </Button>
        </a>
        <a href="https://wa.me/56974157966" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" style={{ borderRadius: 0, fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
            <Phone style={{ width: 14, height: 14 }} />WhatsApp Clínica
          </Button>
        </a>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList style={{ borderRadius: 0, background: "var(--secondary)", padding: 0, gap: "1px", marginBottom: "1.5rem" }}>
          <TabsTrigger value="upcoming" style={{ borderRadius: 0, fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", padding: ".75rem 1.5rem" }}>
            Próximas ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" style={{ borderRadius: 0, fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", padding: ".75rem 1.5rem" }}>
            Historial ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)" }}>
              {upcoming.map(a => <AppointmentCard key={a.id} apt={a} />)}
            </div>
          ) : (
            <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border)" }}>
              <Calendar style={{ width: 40, height: 40, margin: "0 auto 1rem", color: "var(--accent)", opacity: .4 }} />
              <p style={{ fontFamily: "var(--font-b)", color: "var(--mid)", marginBottom: "1.5rem" }}>No tienes citas próximas</p>
              <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
                <Button style={{ borderRadius: 0, background: "var(--accent)", color: "var(--accent-fg)", border: "none", fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase" }}>
                  Agendar Cita →
                </Button>
              </a>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)" }}>
              {past.map(a => <AppointmentCard key={a.id} apt={a} />)}
            </div>
          ) : (
            <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border)" }}>
              <Clock style={{ width: 40, height: 40, margin: "0 auto 1rem", color: "var(--accent)", opacity: .4 }} />
              <p style={{ fontFamily: "var(--font-b)", color: "var(--mid)" }}>Aún no hay historial de citas</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MisCitas;
