import { useState, useRef, useEffect } from "react";
import { analyzeDental, type DentalAnalysis, type DentalHallazgo, type ImplantXScore } from "@/lib/api";
import type { WizardData } from "@/pages/Evaluacion";
import CameraCapture from "./CameraCapture";

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  leve: "text-status-success bg-status-success/10 border-status-success/30",
  moderado: "text-status-warning bg-status-warning/10 border-status-warning/30",
  severo: "text-status-urgent bg-status-urgent/10 border-status-urgent/30",
};

const SEVERITY_MARKER_COLORS: Record<string, string> = {
  leve: "bg-status-success border-status-success",
  moderado: "bg-status-warning border-status-warning",
  severo: "bg-status-urgent border-status-urgent",
};

const STATE_ICON: Record<string, string> = {
  saludable: "✅",
  requiere_atencion: "⚠️",
  urgente: "🔴",
};

// Map dental location keywords to approximate % coordinates on a frontal smile photo
// The photo is a square selfie centered on the face/smile
const LOCATION_MAP: { keywords: string[]; x: number; y: number }[] = [
  // Upper teeth
  { keywords: ["incisivo superior", "incisivos superiores", "dientes superiores", "superiores anteriores", "centrales superiores"], x: 50, y: 52 },
  { keywords: ["lateral superior derecho", "superior derecho"], x: 40, y: 52 },
  { keywords: ["lateral superior izquierdo", "superior izquierdo"], x: 60, y: 52 },
  { keywords: ["canino superior derecho"], x: 35, y: 54 },
  { keywords: ["canino superior izquierdo"], x: 65, y: 54 },
  { keywords: ["premolar superior", "premolares superiores"], x: 30, y: 55 },
  { keywords: ["molar superior", "molares superiores"], x: 25, y: 57 },
  // Lower teeth
  { keywords: ["incisivo inferior", "incisivos inferiores", "dientes inferiores", "inferiores anteriores", "centrales inferiores", "anteroinferiores", "anteroinferior"], x: 50, y: 62 },
  { keywords: ["lateral inferior derecho", "inferior derecho"], x: 43, y: 62 },
  { keywords: ["lateral inferior izquierdo", "inferior izquierdo"], x: 57, y: 62 },
  { keywords: ["canino inferior derecho"], x: 37, y: 63 },
  { keywords: ["canino inferior izquierdo"], x: 63, y: 63 },
  { keywords: ["premolar inferior", "premolares inferiores"], x: 32, y: 64 },
  { keywords: ["molar inferior", "molares inferiores"], x: 27, y: 65 },
  // General zones
  { keywords: ["encía", "encias", "gingival", "encías"], x: 50, y: 48 },
  { keywords: ["diastema", "espaciamiento", "espacio"], x: 50, y: 53 },
  { keywords: ["zona anterior", "anteriores"], x: 50, y: 57 },
  { keywords: ["zona posterior", "posteriores"], x: 28, y: 60 },
  { keywords: ["arcada superior", "maxilar"], x: 50, y: 50 },
  { keywords: ["arcada inferior", "mandibular", "mandíbula"], x: 50, y: 65 },
];

function getMarkerPosition(ubicacion: string): { x: number; y: number } {
  const lower = ubicacion.toLowerCase();
  for (const loc of LOCATION_MAP) {
    if (loc.keywords.some((kw) => lower.includes(kw))) {
      return { x: loc.x, y: loc.y };
    }
  }
  // Default: center of mouth area
  return { x: 50, y: 58 };
}

const StepFoto = ({ data, update, next, back }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Elapsed seconds timer during analysis
  useEffect(() => {
    if (!loading) {
      setElapsedSeconds(0);
      return;
    }
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const processImage = async (base64: string) => {
    setError("");
    setLoading(true);
    setShowCamera(false);
    update({ fotoBase64: base64 });

    try {
      const result = await analyzeDental(base64, {
        motivo: data.motivo,
        sintomas: data.sintomas,
        zona: data.zona,
      });
      update({ analisis: result });
    } catch (err) {
      setError("Error al analizar la imagen. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen es demasiado grande (máx 10MB).");
      return;
    }

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    processImage(base64);
  };

  const analisis = data.analisis;

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Captura tu <span className="text-accent">sonrisa</span>
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-2">
        Nuestra IA analizará la imagen para darte una orientación preliminar.
      </p>
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-8">
        Análisis SCANDENT · HUMANA.AI
      </p>

      {/* Camera mode */}
      {showCamera && !loading && (
        <CameraCapture
          onCapture={processImage}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Initial state — choose camera or upload */}
      {!data.fotoBase64 && !loading && !showCamera && (
        <div className="space-y-3">
          <button
            onClick={() => setShowCamera(true)}
            className="w-full border-2 border-accent/40 bg-accent/5 py-12 flex flex-col items-center gap-3 hover:border-accent hover:bg-accent/10 transition-all cursor-pointer group"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">📸</span>
            <span className="font-display font-bold text-[0.95rem]">Abrir cámara profesional</span>
            <span className="text-[0.75rem] text-mid-gray">Selfie con guías de alineación · Recomendado</span>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border border-border py-4 flex items-center justify-center gap-2 hover:border-accent/30 transition-colors cursor-pointer text-mid-gray hover:text-foreground"
          >
            <span className="text-lg">🖼️</span>
            <span className="font-display text-[0.8rem]">O sube una foto existente</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}

      {/* Show image + scanner during loading */}
      {loading && data.fotoBase64 && (
        <div className="space-y-4">
          <div className="relative w-full aspect-square overflow-hidden border border-border bg-foreground/5">
            <img src={data.fotoBase64} alt="Foto capturada" className="w-full h-full object-cover" />
            
            {/* Scanner line effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_12px_hsl(var(--accent)),0_0_30px_hsl(var(--accent)/0.4)]"
                style={{
                  animation: "scanLine 2.2s ease-in-out infinite",
                }}
              />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--accent) / 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--accent) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />

            {/* Corner brackets */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M30 60 L30 30 L60 30" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
              <path d="M340 30 L370 30 L370 60" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
              <path d="M30 340 L30 370 L60 370" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
              <path d="M340 370 L370 370 L370 340" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
            </svg>

            {/* SCANDENT label */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent drop-shadow-md">
                SCANDENT · ANALYZING
              </span>
            </div>

            {/* Elapsed time counter */}
            <div className="absolute bottom-3 right-3 bg-foreground/70 backdrop-blur-sm px-3 py-1.5 rounded">
              <span className="font-mono text-[0.85rem] text-accent font-bold tabular-nums">
                {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:{String(elapsedSeconds % 60).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="font-display font-semibold text-[0.95rem]">Analizando con SCANDENT...</p>
            <p className="text-mid-gray text-[0.85rem] mt-1">Procesando imagen · {elapsedSeconds}s</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive font-medium mb-4">{error}</p>
          <div className="flex flex-col items-center gap-3">
            <button onClick={() => { update({ fotoBase64: null, analisis: null }); setError(""); setShowCamera(true); }} className="px-6 py-2.5 bg-accent text-white font-display font-bold text-[0.8rem] tracking-[0.05em] uppercase hover:bg-accent/90 transition-colors">
              Tomar otra foto
            </button>
            <button onClick={() => { update({ fotoBase64: null, analisis: null }); setError(""); fileRef.current?.click(); }} className="text-accent underline text-[0.85rem]">
              Subir otra imagen
            </button>
          </div>
        </div>
      )}

      {analisis && (
        <div className="space-y-6">
          {/* Photo with markers */}
          {data.fotoBase64 && (
            <div className="relative w-full aspect-square overflow-hidden border border-border">
              <img src={data.fotoBase64} alt="Tu foto" className="w-full h-full object-cover" />
              
              {/* Numbered markers on detected findings */}
              {analisis.hallazgos.map((h, i) => {
                if (!h.ubicacion) return null;
                const pos = getMarkerPosition(h.ubicacion);
                const isActive = activeMarker === i;
                const colorClass = SEVERITY_MARKER_COLORS[h.severidad] || "bg-accent border-accent";
                // Offset overlapping markers slightly
                const offsetX = pos.x + (i % 3 - 1) * 3;
                const offsetY = pos.y + Math.floor(i / 3) * 3;
                
                return (
                  <button
                    key={i}
                    onClick={() => setActiveMarker(isActive ? null : i)}
                    className={`absolute z-20 flex items-center justify-center transition-all duration-300 cursor-pointer
                      ${isActive ? "w-8 h-8 -ml-4 -mt-4 scale-125" : "w-6 h-6 -ml-3 -mt-3 hover:scale-110"}
                    `}
                    style={{ left: `${offsetX}%`, top: `${offsetY}%` }}
                    title={h.tipo.replace(/_/g, " ")}
                  >
                    {/* Pulse ring */}
                    <span className={`absolute inset-0 rounded-full ${colorClass} opacity-30 animate-ping`} />
                    {/* Marker dot */}
                    <span className={`relative rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-mono font-bold text-[10px] ${colorClass}
                      ${isActive ? "w-8 h-8" : "w-6 h-6"}
                    `}>
                      {i + 1}
                    </span>
                  </button>
                );
              })}

              {/* Active marker tooltip */}
              {activeMarker !== null && analisis.hallazgos[activeMarker] && (() => {
                const h = analisis.hallazgos[activeMarker];
                const pos = getMarkerPosition(h.ubicacion);
                const showAbove = pos.y > 50;
                return (
                  <div
                    className={`absolute z-30 left-3 right-3 p-3 bg-foreground/90 backdrop-blur-sm text-background text-[0.8rem] leading-snug shadow-xl transition-all duration-300
                      ${showAbove ? "bottom-[45%]" : "top-[45%]"}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${SEVERITY_MARKER_COLORS[h.severidad] || "bg-accent"}`}>
                        {activeMarker + 1}
                      </span>
                      <span className="font-display font-bold text-[0.8rem] uppercase">{h.tipo.replace(/_/g, " ")}</span>
                    </div>
                    <p className="opacity-90">{h.descripcion}</p>
                    {h.ubicacion && <p className="text-[0.7rem] mt-1 opacity-60">📍 {h.ubicacion}</p>}
                  </div>
                );
              })()}

              {/* SCANDENT overlay label */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/80 drop-shadow-md">
                  SCANDENT · {analisis.hallazgos.length} HALLAZGO{analisis.hallazgos.length !== 1 ? "S" : ""}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 border border-border bg-secondary/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{STATE_ICON[analisis.estadoGeneral] || "🤖"}</span>
              <span className="font-display font-bold text-[0.95rem] uppercase tracking-wide">Análisis SCANDENT · HUMANA.AI</span>
            </div>
            <p className="text-[0.95rem] leading-relaxed">{analisis.mensajeGeneral}</p>
          </div>

          {analisis.hallazgos.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-display font-bold text-[0.85rem] uppercase tracking-wide text-mid-gray">Hallazgos detectados</h4>
              {analisis.hallazgos.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMarker(activeMarker === i ? null : i)}
                  className={`w-full text-left p-4 border transition-all duration-200 ${SEVERITY_STYLES[h.severidad] || "border-border"}
                    ${activeMarker === i ? "ring-2 ring-accent shadow-md" : "hover:shadow-sm"}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${SEVERITY_MARKER_COLORS[h.severidad] || "bg-accent"}`}>
                      {i + 1}
                    </span>
                    <span className="font-display font-bold text-[0.85rem] uppercase">{h.tipo.replace(/_/g, " ")}</span>
                    <span className="text-[0.7rem] opacity-60">· {h.confianza}</span>
                  </div>
                  <p className="text-[0.85rem] pl-7">{h.descripcion}</p>
                  {h.ubicacion && <p className="text-[0.75rem] mt-1 opacity-70 pl-7">📍 {h.ubicacion}</p>}
                </button>
              ))}
            </div>
          )}

          <p className="text-[0.75rem] text-mid-gray italic leading-relaxed border-l-2 border-accent/30 pl-4">
            Este análisis es orientativo. La evaluación clínica presencial confirmará los hallazgos.
          </p>

          {/* Retake / re-upload */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { update({ fotoBase64: null, analisis: null }); setShowCamera(true); }}
              className="flex-1 py-2.5 border border-accent/40 text-accent font-display font-bold text-[0.8rem] tracking-[0.05em] uppercase hover:bg-accent/10 transition-colors"
            >
              Tomar otra foto
            </button>
            <button
              onClick={() => { update({ fotoBase64: null, analisis: null }); fileRef.current?.click(); }}
              className="flex-1 py-2.5 border border-border text-mid-gray font-display text-[0.8rem] tracking-[0.05em] uppercase hover:border-accent/30 hover:text-foreground transition-colors"
            >
              Subir otra imagen
            </button>
          </div>

          {/* ImplantX Score — shown when ausencia dental detected */}
          {analisis.implantxScore && (
            <div className="border border-accent/30 bg-accent/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent">ImplantX · HUMANA.AI</span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-[1rem]">{analisis.implantxScore.etiqueta}</p>
                  <p className="text-[0.8rem] text-mid-gray mt-0.5">{analisis.implantxScore.recomendacion}</p>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-[800] text-[1.5rem] border-2 ${
                  analisis.implantxScore.nivel <= 2 ? "border-status-success text-status-success bg-status-success/10" :
                  analisis.implantxScore.nivel === 3 ? "border-status-warning text-status-warning bg-status-warning/10" :
                  "border-status-urgent text-status-urgent bg-status-urgent/10"
                }`}>
                  {analisis.implantxScore.nivel}/5
                </div>
              </div>
              {analisis.implantxScore.factores.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {analisis.implantxScore.factores.map((f, i) => (
                    <span key={i} className="text-[0.7rem] font-mono px-2 py-0.5 bg-foreground/5 border border-border">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[0.7rem] text-mid-gray italic">
                Score calculado con {analisis.implantxScore.factores.length > 0 ? `${analisis.implantxScore.factores.length} factores de riesgo detectados` : "datos disponibles"}. La evaluación presencial ajusta el score.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button onClick={back} className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
          ← Volver
        </button>
        <button
          onClick={next}
          className="px-8 py-3 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors"
        >
          {analisis ? "Continuar →" : "Saltar este paso →"}
        </button>
      </div>
    </div>
  );
};

export default StepFoto;
