/**
 * PORTAL PACIENTE — Dashboard principal
 * Acceso: /paciente
 * Auth: Supabase oficial
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Phone, User, ExternalLink, AlertCircle } from "lucide-react";

const DENTALINK_PROXY = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/dentalink-proxy`;

interface PatientData {
  rut: string;
  name: string;
  email: string;
  phone: string;
  citas: Array<{
    id: string;
    fecha: string;
    hora: string;
    estado: string;
    tratamiento: string;
    doctor: string;
    consultorio: string;
  }>;
}

/* ── RUT Input inline ─────────────────────────────────────────── */
const RutInput = ({ onSubmit, loading, error }: { onSubmit: (rut: string) => void; loading: boolean; error: string }) => {
  const [rut, setRut] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-border" style={{ borderRadius: 0 }}>
        <CardHeader className="border-b border-border">
          <CardTitle className="font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <User className="w-4 h-4 text-accent" /> Ingresa tu RUT
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label className="font-display font-bold text-[0.7rem] tracking-widest uppercase">RUT (sin puntos, con guión)</Label>
            <Input value={rut} onChange={e => setRut(e.target.value)} placeholder="12345678-9" style={{ borderRadius: 0 }} />
          </div>
          {error && (
            <Alert variant="destructive" style={{ borderRadius: 0 }}>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={() => onSubmit(rut)} disabled={loading || !rut.trim()}
            className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase"
            style={{ borderRadius: 0 }}>
            {loading ? "Buscando…" : "Buscar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/* ── Simple Dashboard inline ─────────────────────────────────── */
const PatientDashboardView = ({ data, onClose }: { data: PatientData; onClose: () => void; }) => (
  <div className="max-w-[860px] mx-auto p-6">
    <div className="mb-8">
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-1">Portal Paciente</p>
      <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.5rem)] leading-tight">{data.name}</h1>
      <p className="font-body text-sm text-muted-foreground mt-1">{data.email} · {data.phone}</p>
    </div>

    <div className="flex flex-col gap-px bg-border mb-6">
      {data.citas.length > 0 ? data.citas.map(c => (
        <div key={c.id} className="bg-background p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="font-display font-bold text-sm">{c.tratamiento || "Consulta"}</span>
              <span className="block font-body text-xs text-muted-foreground mt-0.5">{c.fecha} · {c.hora}</span>
            </div>
            <span className="font-mono text-[0.65rem] tracking-widest uppercase px-2 py-1 bg-secondary text-secondary-foreground">{c.estado}</span>
          </div>
          <span className="font-body text-xs text-muted-foreground">Dr. {c.doctor} · {c.consultorio}</span>
        </div>
      )) : (
        <div className="bg-background p-12 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-accent opacity-40" />
          <p className="font-body text-muted-foreground">No hay citas registradas</p>
        </div>
      )}
    </div>

    <div className="flex gap-3">
      <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
        <Button className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase" style={{ borderRadius: 0 }}>
          <Calendar className="w-3.5 h-3.5 mr-1.5" /> Agendar Cita
        </Button>
      </a>
      <Button variant="outline" onClick={onClose} className="font-display font-bold text-xs tracking-widest uppercase" style={{ borderRadius: 0 }}>
        Volver
      </Button>
    </div>
  </div>
);

/* ── Main component ───────────────────────────────────────────── */
const PacienteDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<unknown>(null);
  const [step, setStep] = useState<"rut" | "dashboard">("rut");
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (!session) navigate("/evaluacion");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/evaluacion");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleRutSubmit = async (rut: string) => {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(DENTALINK_PROXY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ action: "get_patient", rut }),
      });
      if (!res.ok) throw new Error("No se encontró el paciente");
      const data = await res.json();
      setPatientData({ rut, name: data.name ?? rut, email: data.email ?? "", phone: data.phone ?? "", citas: data.citas ?? [] });
      setStep("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener datos");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground animate-pulse">Verificando acceso...</span>
    </div>
  );
  if (!session) return null;
  if (step === "rut") return <RutInput onSubmit={handleRutSubmit} loading={loading} error={error} />;
  if (step === "dashboard" && patientData) return <PatientDashboardView data={patientData} onClose={() => { setStep("rut"); setPatientData(null); }} />;
  return null;
};

export default PacienteDashboard;
