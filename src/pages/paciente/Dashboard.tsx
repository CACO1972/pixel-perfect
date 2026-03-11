/**
 * PORTAL PACIENTE — Dashboard principal
 * Acceso: /paciente
 * Auth: RUT + contraseña propia
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, User, AlertCircle, FileText, CreditCard, ClipboardList, ShieldCheck, Pill, ArrowLeft, Phone, Lock, UserPlus } from "lucide-react";
import SiteHeader from "@/components/landing/SiteHeader";

const DENTALINK_PROXY = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/dentalink-proxy`;

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  estado: string;
  tratamiento: string;
  doctor: string;
  consultorio: string;
}

interface PatientData {
  rut: string;
  name: string;
  email: string;
  phone: string;
  citas: Cita[];
  radiografias: Array<{ id: string; fecha: string; tipo: string; url?: string }>;
  tratamientos: Array<{ id: string; nombre: string; estado: string; progreso: number }>;
  pagos: Array<{ id: string; fecha: string; monto: number; estado: string; concepto: string }>;
  recetas: Array<{ id: string; fecha: string; medicamento: string; dosis: string; doctor: string }>;
  consentimientos: Array<{ id: string; fecha: string; tipo: string; firmado: boolean }>;
}

/* ── Formatear RUT mientras escribe ──────────────────────────── */
const formatRut = (value: string) => {
  const clean = value.replace(/[^0-9kK-]/g, "").toUpperCase();
  const digits = clean.replace(/-/g, "");
  if (digits.length <= 1) return digits;
  const body = digits.slice(0, -1);
  const dv = digits.slice(-1);
  return `${body}-${dv}`;
};

/* ── Login / Register Form ───────────────────────────────────── */
const LoginForm = ({
  onLogin,
  onRegister,
  loading,
  error,
  successMsg,
}: {
  onLogin: (rut: string, password: string) => void;
  onRegister: (rut: string, password: string) => void;
  loading: boolean;
  error: string;
  successMsg: string;
}) => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center p-6 pt-24">
        <Card className="w-full max-w-md border-border" style={{ borderRadius: 0 }}>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-accent" /> Portal Paciente
            </CardTitle>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {mode === "login"
                ? "Ingresa tu RUT y contraseña"
                : "Crea tu cuenta con tu RUT registrado en la clínica"}
            </p>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label className="font-display font-bold text-[0.7rem] tracking-widest uppercase">RUT</Label>
              <Input
                value={rut}
                onChange={e => setRut(formatRut(e.target.value))}
                placeholder="12345678-9"
                maxLength={10}
                style={{ borderRadius: 0 }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="font-display font-bold text-[0.7rem] tracking-widest uppercase flex items-center gap-1">
                <Lock className="w-3 h-3" /> Contraseña
              </Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Crea una contraseña" : "Tu contraseña"}
                style={{ borderRadius: 0 }}
              />
            </div>

            {error && (
              <Alert variant="destructive" style={{ borderRadius: 0 }}>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {successMsg && (
              <Alert style={{ borderRadius: 0 }} className="border-accent/30 bg-accent/5">
                <AlertDescription className="text-sm text-accent">{successMsg}</AlertDescription>
              </Alert>
            )}

            {mode === "login" ? (
              <>
                <Button
                  onClick={() => onLogin(rut, password)}
                  disabled={loading || !rut.trim() || !password}
                  className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase"
                  style={{ borderRadius: 0 }}
                >
                  {loading ? "Verificando…" : "Ingresar"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 mt-1"
                >
                  <UserPlus className="w-3 h-3" /> ¿Primera vez? Crea tu cuenta
                </button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => onRegister(rut, password)}
                  disabled={loading || !rut.trim() || password.length < 4}
                  className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase"
                  style={{ borderRadius: 0 }}
                >
                  {loading ? "Creando cuenta…" : "Crear cuenta"}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 mt-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Ya tengo cuenta
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

/* ── Sección reutilizable ────────────────────────────────────── */
const Section = ({ title, icon: Icon, children, empty }: { title: string; icon: typeof Calendar; children?: React.ReactNode; empty?: string }) => (
  <div className="mb-6">
    <h2 className="font-display font-bold text-xs tracking-widest uppercase flex items-center gap-2 mb-3 text-foreground">
      <Icon className="w-4 h-4 text-accent" /> {title}
    </h2>
    {children || (
      <div className="border border-border p-8 text-center">
        <p className="font-body text-sm text-muted-foreground">{empty || "Sin registros"}</p>
      </div>
    )}
  </div>
);

/* ── Dashboard completo ──────────────────────────────────────── */
const PatientDashboardView = ({ data, onClose }: { data: PatientData; onClose: () => void }) => (
  <>
    <SiteHeader />
    <div className="max-w-[860px] mx-auto p-6 pt-24 pb-20">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-1">Portal Paciente</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.5rem)] leading-tight">{data.name}</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">{data.email}</p>
      </div>

      {/* Citas */}
      <Section title="Citas" icon={Calendar}>
        {data.citas.length > 0 ? (
          <div className="flex flex-col gap-px bg-border">
            {data.citas.map(c => (
              <div key={c.id} className="bg-background p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-display font-bold text-sm">{c.tratamiento || "Consulta"}</span>
                    <span className="block font-body text-xs text-muted-foreground mt-0.5">{c.fecha} · {c.hora}</span>
                  </div>
                  <span className="font-mono text-[0.65rem] tracking-widest uppercase px-2 py-1 bg-secondary text-secondary-foreground">{c.estado}</span>
                </div>
                <span className="font-body text-xs text-muted-foreground">Dr. {c.doctor} · {c.consultorio}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border p-8 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-accent opacity-40" />
            <p className="font-body text-sm text-muted-foreground">No hay citas registradas</p>
          </div>
        )}
      </Section>

      {/* Radiografías */}
      <Section title="Radiografías" icon={FileText} empty="No hay radiografías disponibles">
        {data.radiografias.length > 0 && (
          <div className="flex flex-col gap-px bg-border">
            {data.radiografias.map(r => (
              <div key={r.id} className="bg-background p-4 flex justify-between items-center">
                <div>
                  <span className="font-display font-bold text-sm">{r.tipo}</span>
                  <span className="block font-body text-xs text-muted-foreground">{r.fecha}</span>
                </div>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent text-xs font-display font-bold tracking-widest uppercase hover:underline">
                    Ver
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Tratamientos */}
      <Section title="Plan de tratamiento" icon={ClipboardList} empty="Sin tratamientos activos">
        {data.tratamientos.length > 0 && (
          <div className="flex flex-col gap-px bg-border">
            {data.tratamientos.map(t => (
              <div key={t.id} className="bg-background p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-display font-bold text-sm">{t.nombre}</span>
                  <span className="font-mono text-[0.65rem] tracking-widest uppercase px-2 py-1 bg-secondary text-secondary-foreground">{t.estado}</span>
                </div>
                <div className="w-full bg-secondary h-1.5">
                  <div className="bg-accent h-1.5 transition-all" style={{ width: `${t.progreso}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Pagos */}
      <Section title="Historial de pagos" icon={CreditCard} empty="Sin pagos registrados">
        {data.pagos.length > 0 && (
          <div className="flex flex-col gap-px bg-border">
            {data.pagos.map(p => (
              <div key={p.id} className="bg-background p-4 flex justify-between items-center">
                <div>
                  <span className="font-display font-bold text-sm">{p.concepto}</span>
                  <span className="block font-body text-xs text-muted-foreground">{p.fecha}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold">${p.monto.toLocaleString("es-CL")}</span>
                  <span className={`block font-mono text-[0.6rem] tracking-widest uppercase ${p.estado === "pagado" ? "text-[hsl(var(--status-success))]" : "text-[hsl(var(--status-warning))]"}`}>
                    {p.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Recetas */}
      <Section title="Recetas" icon={Pill} empty="Sin recetas">
        {data.recetas.length > 0 && (
          <div className="flex flex-col gap-px bg-border">
            {data.recetas.map(r => (
              <div key={r.id} className="bg-background p-4">
                <span className="font-display font-bold text-sm">{r.medicamento}</span>
                <span className="block font-body text-xs text-muted-foreground">{r.dosis} · Dr. {r.doctor} · {r.fecha}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Consentimientos */}
      <Section title="Consentimientos informados" icon={ShieldCheck} empty="Sin consentimientos">
        {data.consentimientos.length > 0 && (
          <div className="flex flex-col gap-px bg-border">
            {data.consentimientos.map(c => (
              <div key={c.id} className="bg-background p-4 flex justify-between items-center">
                <div>
                  <span className="font-display font-bold text-sm">{c.tipo}</span>
                  <span className="block font-body text-xs text-muted-foreground">{c.fecha}</span>
                </div>
                <span className={`font-mono text-[0.65rem] tracking-widest uppercase px-2 py-1 ${c.firmado ? "bg-[hsl(var(--status-success)/0.1)] text-[hsl(var(--status-success))]" : "bg-secondary text-secondary-foreground"}`}>
                  {c.firmado ? "Firmado" : "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <a href="https://ff.healthatom.io/41knMr" target="_blank" rel="noopener noreferrer">
          <Button className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase" style={{ borderRadius: 0 }}>
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Agendar Cita
          </Button>
        </a>
        <a href="https://wa.me/56974157966" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="font-display font-bold text-xs tracking-widest uppercase" style={{ borderRadius: 0 }}>
            <Phone className="w-3.5 h-3.5 mr-1.5" /> Contactar
          </Button>
        </a>
        <Button variant="outline" onClick={onClose} className="font-display font-bold text-xs tracking-widest uppercase" style={{ borderRadius: 0 }}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Salir
        </Button>
      </div>
    </div>
  </>
);

/* ── Main component ───────────────────────────────────────────── */
const PacienteDashboard = () => {
  const [step, setStep] = useState<"login" | "dashboard">("login");
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (rut: string, password: string) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    const cleanRut = rut.trim();

    if (!/^\d{7,8}-[\dkK]$/i.test(cleanRut)) {
      setError("Formato de RUT inválido");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(DENTALINK_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login_patient_portal", rut: cleanRut, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al iniciar sesión");
      }

      const data = await res.json();
      setPatientData({
        rut: cleanRut,
        name: data.name ?? cleanRut,
        email: data.email ?? "",
        phone: data.phone ?? "",
        citas: data.citas ?? [],
        radiografias: data.radiografias ?? [],
        tratamientos: data.tratamientos ?? [],
        pagos: data.pagos ?? [],
        recetas: data.recetas ?? [],
        consentimientos: data.consentimientos ?? [],
      });
      setStep("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (rut: string, password: string) => {
    setLoading(true);
    setError("");
    setSuccessMsg("");
    const cleanRut = rut.trim();

    if (!/^\d{7,8}-[\dkK]$/i.test(cleanRut)) {
      setError("Formato de RUT inválido");
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(DENTALINK_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register_patient_portal", rut: cleanRut, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al registrarse");
      }

      setSuccessMsg("¡Cuenta creada! Ya puedes ingresar con tu RUT y contraseña.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  if (step === "login") {
    return (
      <LoginForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loading}
        error={error}
        successMsg={successMsg}
      />
    );
  }

  if (step === "dashboard" && patientData) {
    return (
      <PatientDashboardView
        data={patientData}
        onClose={() => { setStep("login"); setPatientData(null); }}
      />
    );
  }

  return null;
};

export default PacienteDashboard;
