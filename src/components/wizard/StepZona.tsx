import type { WizardData } from "@/pages/Evaluacion";

const ZONAS = [
  { id: "arriba_derecha", label: "Arriba derecha" },
  { id: "arriba_izquierda", label: "Arriba izquierda" },
  { id: "abajo_derecha", label: "Abajo derecha" },
  { id: "abajo_izquierda", label: "Abajo izquierda" },
  { id: "general", label: "Toda la boca / general" },
];

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const StepZona = ({ data, update, next, back }: Props) => (
  <div>
    <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
      ¿Qué <span className="text-accent">zona</span> te preocupa?
    </h2>
    <p className="text-mid-gray text-[0.95rem] mb-8">Indica dónde sientes la molestia o preocupación.</p>

    {/* Simple mouth diagram */}
    <div className="grid grid-cols-2 gap-3 mb-3">
      {ZONAS.slice(0, 4).map((z) => (
        <button
          key={z.id}
          onClick={() => { update({ zona: z.id }); next(); }}
          className={`px-5 py-5 border rounded-xl font-display font-semibold text-[0.9rem] transition-all hover:border-accent hover:bg-accent/5 ${
            data.zona === z.id ? "border-accent bg-accent/5" : "border-border"
          }`}
        >
          {z.label}
        </button>
      ))}
    </div>
    <button
      onClick={() => { update({ zona: "general" }); next(); }}
      className={`w-full px-5 py-5 border rounded-xl font-display font-semibold text-[0.9rem] transition-all hover:border-accent hover:bg-accent/5 ${
        data.zona === "general" ? "border-accent bg-accent/5" : "border-border"
      }`}
    >
      Toda la boca / general
    </button>

    <button onClick={back} className="mt-6 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
      ← Volver
    </button>
  </div>
);

export default StepZona;
