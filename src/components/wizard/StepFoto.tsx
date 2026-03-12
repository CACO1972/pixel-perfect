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

const SEVERITY_DOT: Record<string, string> = {
  leve: "#22c55e",
  moderado: "#eab308",
  severo: "#ef4444",
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
const LOCATION_MAP: { keywords: string[]; x: number; y: number }[] = [
  { keywords: ["incisivo superior", "incisivos superiores", "dientes superiores", "superiores anteriores", "centrales superiores"], x: 50, y: 48 },
  { keywords: ["lateral superior derecho", "superior derecho"], x: 38, y: 48 },
  { keywords: ["lateral superior izquierdo", "superior izquierdo"], x: 62, y: 48 },
  { keywords: ["canino superior derecho"], x: 32, y: 50 },
  { keywords: ["canino superior izquierdo"], x: 68, y: 50 },
  { keywords: ["premolar superior", "premolares superiores"], x: 26, y: 52 },
  { keywords: ["molar superior", "molares superiores"], x: 20, y: 54 },
  { keywords: ["incisivo inferior", "incisivos inferiores", "dientes inferiores", "inferiores anteriores", "centrales inferiores", "anteroinferiores", "anteroinferior"], x: 50, y: 60 },
  { keywords: ["lateral inferior derecho", "inferior derecho"], x: 40, y: 61 },
  { keywords: ["lateral inferior izquierdo", "inferior izquierdo"], x: 60, y: 61 },
  { keywords: ["canino inferior derecho"], x: 34, y: 62 },
  { keywords: ["canino inferior izquierdo"], x: 66, y: 62 },
  { keywords: ["premolar inferior", "premolares inferiores"], x: 28, y: 63 },
  { keywords: ["molar inferior", "molares inferiores"], x: 22, y: 65 },
  { keywords: ["encía", "encias", "gingival", "encías"], x: 50, y: 44 },
  { keywords: ["diastema", "espaciamiento", "espacio"], x: 50, y: 53 },
  { keywords: ["zona anterior", "anteriores"], x: 50, y: 55 },
  { keywords: ["zona posterior", "posteriores"], x: 24, y: 58 },
  { keywords: ["arcada superior", "maxilar"], x: 50, y: 46 },
  { keywords: ["arcada inferior", "mandibular", "mandíbula"], x: 50, y: 64 },
];

function getMarkerPosition(ubicacion: string): { x: number; y: number } {
  const lower = ubicacion.toLowerCase();
  for (const loc of LOCATION_MAP) {
    if (loc.keywords.some((kw) => lower.includes(kw))) {
      return { x: loc.x, y: loc.y };
    }
  }
  return { x: 50, y: 55 };
}

// Spread markers that are too close together
function spreadMarkers(hallazgos: DentalHallazgo[]): { x: number; y: number }[] {
  const positions = hallazgos.map((h) => ({ ...getMarkerPosition(h.ubicacion) }));
  const MIN_DIST = 8; // minimum % distance

  for (let iter = 0; iter < 5; iter++) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST && dist > 0) {
          const push = (MIN_DIST - dist) / 2;
          const angle = Math.atan2(dy, dx);
          positions[j].x += Math.cos(angle) * push;
          positions[j].y += Math.sin(angle) * push;
          positions[i].x -= Math.cos(angle) * push;
          positions[i].y -= Math.sin(angle) * push;
        }
      }
    }
  }

  // Clamp to 8-92%
  return positions.map((p) => ({
    x: Math.max(8, Math.min(92, p.x)),
    y: Math.max(8, Math.min(92, p.y)),
  }));
}

const StepFoto = ({ data, update, next, back }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
  const markerPositions = analisis ? spreadMarkers(analisis.hallazgos) : [];

  // Compute zoom transform when a marker is active
  const getZoomTransform = (markerIndex: number | null) => {
    if (markerIndex === null || !markerPositions[markerIndex]) return { transform: "scale(1) translate(0%, 0%)", transformOrigin: "center center" };
    const pos = markerPositions[markerIndex];
    // Zoom 2x and pan so the point is centered
    const tx = 50 - pos.x; // shift so pos.x -> 50%
    const ty = 50 - pos.y;
    return {
      transform: `scale(2.2) translate(${tx * 0.45}%, ${ty * 0.45}%)`,
      transformOrigin: `${pos.x}% ${pos.y}%`,
    };
  };

  const zoomStyle = getZoomTransform(activeMarker);

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
            
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_12px_hsl(var(--accent)),0_0_30px_hsl(var(--accent)/0.4)]"
                style={{ animation: "scanLine 2.2s ease-in-out infinite" }}
              />
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--accent) / 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--accent) / 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />

            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M30 60 L30 30 L60 30" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
              <path d="M340 30 L370 30 L370 60" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
              <path d="M30 340 L30 370 L60 370" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
              <path d="M340 370 L370 370 L370 340" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.8" />
            </svg>

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent drop-shadow-md">
                SCANDENT · ANALYZING
              </span>
            </div>

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
          {/* Photo with focused marker system */}
          {data.fotoBase64 && (
            <div className="relative w-full aspect-square overflow-hidden border border-border">
              {/* Zoomable layer: image + target dots */}
              <div
                className="relative w-full h-full transition-transform duration-500 ease-out"
                style={zoomStyle}
              >
                <img src={data.fotoBase64} alt="Tu foto" className="w-full h-full object-cover" />

                {/* SVG overlay — only target dots */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  {analisis.hallazgos.map((h, i) => {
                    const pos = markerPositions[i];
                    if (!pos) return null;
                    const isActive = activeMarker === i;
                    const color = SEVERITY_DOT[h.severidad] || "#C9A86C";

                    return (
                      <g key={i}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isActive ? 3 : 1.2}
                          fill={isActive ? color : "transparent"}
                          stroke={color}
                          strokeWidth={isActive ? 0.8 : 0.4}
                          opacity={isActive ? 1 : 0.5}
                          style={{ transition: "all 0.3s ease" }}
                        />
                        {isActive && (
                          <circle cx={pos.x} cy={pos.y} r="5" fill="none" stroke={color} strokeWidth="0.4" opacity="0.4">
                            <animate attributeName="r" from="3" to="8" dur="1.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" repeatCount="indefinite" />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Fixed overlay: active marker label (doesn't zoom) */}
              {activeMarker !== null && analisis.hallazgos[activeMarker] && (
                <div className="absolute bottom-3 left-3 right-3 z-30 px-3 py-2 bg-foreground/85 backdrop-blur-sm text-background text-[0.75rem] leading-snug shadow-xl pointer-events-none">
                  <span className="font-display font-bold uppercase text-[0.7rem]">
                    {analisis.hallazgos[activeMarker].tipo.replace(/_/g, " ")}
                  </span>
                  <span className="block opacity-75 text-[0.65rem] mt-0.5">
                    📍 {analisis.hallazgos[activeMarker].ubicacion}
                  </span>
                </div>
              )}

              {/* SCANDENT overlay label (doesn't zoom) */}
              {activeMarker === null && (
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/80 drop-shadow-md">
                    SCANDENT · {analisis.hallazgos.length} HALLAZGO{analisis.hallazgos.length !== 1 ? "S" : ""}
                  </span>
                </div>
              )}

              {/* Tap to unzoom hint */}
              {activeMarker !== null && (
                <button
                  onClick={() => setActiveMarker(null)}
                  className="absolute top-3 right-3 z-30 px-2.5 py-1 bg-foreground/70 backdrop-blur-sm text-background font-mono text-[9px] tracking-wider uppercase cursor-pointer hover:bg-foreground/90 transition-colors"
                >
                  ✕ Vista completa
                </button>
              )}
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
            <div className="space-y-2">
              <h4 className="font-display font-bold text-[0.85rem] uppercase tracking-wide text-mid-gray">
                Hallazgos detectados — toca para ubicar
              </h4>
              {analisis.hallazgos.map((h, i) => {
                const isActive = activeMarker === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveMarker(isActive ? null : i)}
                    className={`w-full text-left p-3.5 border transition-all duration-200 ${SEVERITY_STYLES[h.severidad] || "border-border"}
                      ${isActive ? "ring-2 ring-accent shadow-md scale-[1.01]" : "hover:shadow-sm"}
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${SEVERITY_MARKER_COLORS[h.severidad] || "bg-accent"}`}>
                        {i + 1}
                      </span>
                      <span className="font-display font-bold text-[0.85rem] uppercase">{h.tipo.replace(/_/g, " ")}</span>
                      <span className="text-[0.7rem] opacity-60 ml-auto">{h.severidad}</span>
                    </div>
                    <p className="text-[0.8rem] pl-7 leading-relaxed">{h.descripcion}</p>
                    {h.ubicacion && <p className="text-[0.7rem] mt-1 opacity-70 pl-7">📍 {h.ubicacion}</p>}
                  </button>
                );
              })}
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

          {/* ImplantX Score */}
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
