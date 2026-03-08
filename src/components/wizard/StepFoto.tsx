import { useState, useRef } from "react";
import { analyzeDental, type DentalAnalysis } from "@/lib/api";
import type { WizardData } from "@/pages/Evaluacion";

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

const STATE_ICON: Record<string, string> = {
  saludable: "✅",
  requiere_atencion: "⚠️",
  urgente: "🔴",
};

const StepFoto = ({ data, update, next, back }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen es demasiado grande (máx 10MB).");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      update({ fotoBase64: base64 });
      const result = await analyzeDental(base64);
      update({ analisis: result });
    } catch (err) {
      setError("Error al analizar la imagen. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analisis = data.analisis;

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Sube una <span className="text-accent">foto</span> de tu sonrisa
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-2">
        Nuestra IA analizará la imagen para darte una orientación preliminar.
      </p>
      {/* HUMANA badge */}
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-8">
        Análisis SCANDENT · HUMANA.AI
      </p>

      {!data.fotoBase64 && !loading && (
        <>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border py-16 flex flex-col items-center gap-3 hover:border-accent/50 transition-colors cursor-pointer"
          >
            <span className="text-4xl">📸</span>
            <span className="font-display font-semibold text-[0.95rem]">Toca para subir tu foto</span>
            <span className="text-[0.8rem] text-mid-gray">JPG o PNG · máximo 10 MB</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </>
      )}

      {loading && (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-semibold text-[0.95rem]">Analizando con SCANDENT...</p>
          <p className="text-mid-gray text-[0.85rem] mt-1">Esto puede tomar unos segundos</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive font-medium mb-4">{error}</p>
          <button onClick={() => { update({ fotoBase64: null, analisis: null }); fileRef.current?.click(); }} className="text-accent underline text-[0.9rem]">
            Intentar de nuevo
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </div>
      )}

      {analisis && (
        <div className="space-y-6">
          {/* Thumbnail */}
          {data.fotoBase64 && (
            <div className="w-full overflow-hidden border border-border">
              <img src={data.fotoBase64} alt="Tu foto" className="w-full h-48 object-cover" />
            </div>
          )}

          {/* General result */}
          <div className="p-6 border border-border bg-secondary/50">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{STATE_ICON[analisis.estadoGeneral] || "🤖"}</span>
              <span className="font-display font-bold text-[0.95rem] uppercase tracking-wide">Análisis SCANDENT · HUMANA.AI</span>
            </div>
            <p className="text-[0.95rem] leading-relaxed">{analisis.mensajeGeneral}</p>
          </div>

          {/* Hallazgos */}
          {analisis.hallazgos.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-display font-bold text-[0.85rem] uppercase tracking-wide text-mid-gray">Hallazgos detectados</h4>
              {analisis.hallazgos.map((h, i) => (
                <div key={i} className={`p-4 border ${SEVERITY_STYLES[h.severidad] || "border-border"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-[0.85rem] uppercase">{h.tipo.replace(/_/g, " ")}</span>
                    <span className="text-[0.7rem] opacity-60">· {h.confianza}</span>
                  </div>
                  <p className="text-[0.85rem]">{h.descripcion}</p>
                  {h.ubicacion && <p className="text-[0.75rem] mt-1 opacity-70">📍 {h.ubicacion}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[0.75rem] text-mid-gray italic leading-relaxed border-l-2 border-accent/30 pl-4">
            Este análisis es orientativo. La evaluación clínica presencial confirmará los hallazgos.
          </p>
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
