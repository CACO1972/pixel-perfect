/**
 * PORTAL PACIENTE — Dashboard principal
 * Acceso: /paciente
 * Auth: Supabase oficial jipldlklzobiytkvxokf
 * Datos clínicos: Dentalink via dentalink-proxy edge function
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RutInput from "@/components/dentalink/RutInput";
import PatientDashboard from "@/components/dentalink/PatientDashboard";
import { dentalinkAPI } from "@/lib/dentalink";

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
  pagos: Array<{
    id: string;
    fecha: string;
    monto: number;
    concepto: string;
    estado: string;
    metodo: string;
  }>;
  tratamientos: Array<unknown>;
  documentos: Array<unknown>;
  radiografias: Array<unknown>;
}

const PacienteDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<unknown>(null);
  const [step, setStep] = useState<"rut" | "dashboard">("rut");
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  // Auth con Supabase oficial
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (!session) navigate("/evaluacion"); // redirige al wizard si no autenticado
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
      const data = await dentalinkAPI.getPatientByRut(rut);
      setPatientData(data);
      setStep("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener datos del paciente");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("rut");
    setPatientData(null);
    setError("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-[0.75rem] tracking-[0.2em] uppercase text-mid-gray animate-pulse">
          Verificando acceso...
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (step === "rut") {
    return <RutInput onRutSubmit={handleRutSubmit} loading={loading} error={error} />;
  }

  if (step === "dashboard" && patientData) {
    return <PatientDashboard patientData={patientData} onClose={handleClose} loading={loading} />;
  }

  return null;
};

export default PacienteDashboard;
