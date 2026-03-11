/**
 * MisCitas — Portal Paciente · Clínica Miró
 * Uses clinic_appointments table (exists in schema)
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Phone, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  professional_name: string;
  patient_name: string;
  amount_clp: number;
}

const statusMap: Record<string, { label: string; cls: string }> = {
  pending:    { label: "Pendiente",   cls: "bg-secondary text-secondary-foreground" },
  confirmed:  { label: "Confirmada",  cls: "bg-accent/10 text-accent" },
  completed:  { label: "Completada",  cls: "bg-green-50 text-green-800" },
  cancelled:  { label: "Cancelada",   cls: "bg-destructive/10 text-destructive" },
};

const AppointmentCard = ({ apt }: { apt: Appointment }) => {
  const badge = statusMap[apt.status] ?? { label: apt.status, cls: "bg-secondary text-secondary-foreground" };
  return (
    <div className="bg-background p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <span className="font-display font-bold text-sm">Cita clínica</span>
          <span className="block font-body text-xs text-muted-foreground mt-0.5">
            {format(new Date(apt.appointment_date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>
        <span className={`font-mono text-[0.65rem] tracking-widest uppercase px-2.5 py-1 ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-accent" />{apt.appointment_time}</span>
        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-accent" />{apt.professional_name}</span>
      </div>
      {apt.status === "pending" && (
        <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="font-display font-bold text-[0.7rem] tracking-widest uppercase flex items-center gap-1" style={{ borderRadius: 0 }}>
            <ExternalLink className="w-3 h-3" /> Reprogramar
          </Button>
        </a>
      )}
    </div>
  );
};

const MisCitas = () => {
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];
      const cols = "id,appointment_date,appointment_time,status,professional_name,patient_name,amount_clp";

      const [{ data: up }, { data: p }] = await Promise.all([
        supabase.from("clinic_appointments").select(cols).eq("user_id", user.id).gte("appointment_date", today).order("appointment_date"),
        supabase.from("clinic_appointments").select(cols).eq("user_id", user.id).lt("appointment_date", today).order("appointment_date", { ascending: false }),
      ]);

      setUpcoming((up as unknown as Appointment[]) ?? []);
      setPast((p as unknown as Appointment[]) ?? []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground animate-pulse">Cargando citas…</span>
    </div>
  );

  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-1">Portal Paciente</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.5rem)] leading-tight">Mis Citas</h1>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
          <Button className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase flex items-center gap-1.5" style={{ borderRadius: 0 }}>
            <Calendar className="w-3.5 h-3.5" /> Agendar Nueva Cita
          </Button>
        </a>
        <a href="https://wa.me/56974157966" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="font-display font-bold text-xs tracking-widest uppercase flex items-center gap-1.5" style={{ borderRadius: 0 }}>
            <Phone className="w-3.5 h-3.5" /> WhatsApp Clínica
          </Button>
        </a>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="bg-secondary p-0 gap-px mb-6" style={{ borderRadius: 0 }}>
          <TabsTrigger value="upcoming" className="font-display font-bold text-[0.7rem] tracking-widest uppercase px-6 py-3" style={{ borderRadius: 0 }}>
            Próximas ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="font-display font-bold text-[0.7rem] tracking-widest uppercase px-6 py-3" style={{ borderRadius: 0 }}>
            Historial ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length > 0 ? (
            <div className="flex flex-col gap-px bg-border">{upcoming.map(a => <AppointmentCard key={a.id} apt={a} />)}</div>
          ) : (
            <div className="p-16 text-center border border-border">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-accent opacity-40" />
              <p className="font-body text-muted-foreground mb-4">No tienes citas próximas</p>
              <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
                <Button className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase" style={{ borderRadius: 0 }}>Agendar Cita →</Button>
              </a>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length > 0 ? (
            <div className="flex flex-col gap-px bg-border">{past.map(a => <AppointmentCard key={a.id} apt={a} />)}</div>
          ) : (
            <div className="p-16 text-center border border-border">
              <Clock className="w-10 h-10 mx-auto mb-3 text-accent opacity-40" />
              <p className="font-body text-muted-foreground">Aún no hay historial de citas</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MisCitas;
