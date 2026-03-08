import type { WizardData } from "@/pages/Evaluacion";

const SINTOMAS = [
  { id: "dolor_morder", label: "Dolor al morder" },
  { id: "encias_sangrantes", label: "Encías sangrantes" },
  { id: "sensibilidad", label: "Sensibilidad al frío/calor" },
  { id: "dientes_flojos", label: "Dientes flojos" },
  { id: "mal_aliento", label: "Mal aliento" },
  { id: "sin_sintomas", label: "Sin síntomas" },
];

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const StepSintomas = ({ data, update, next, back }: Props) => {
  const toggle = (id: string) => {
    if (id === "sin_sintomas") {
      update({ sintomas: ["sin_sintomas"] });
      return;
    }
    const current = data.sintomas.filter((s) => s !== "sin_sintomas");
    update({
      sintomas: current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    });
  };

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        ¿Qué <span className="text-accent">síntomas</span> presentas?
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-8">Puedes seleccionar varios.</p>

      <div className="grid gap-3">
        {SINTOMAS.map((s) => {
          const active = data.sintomas.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex items-center gap-4 px-6 py-4 border rounded-xl text-left transition-all hover:border-accent ${
                active ? "border-accent bg-accent/5" : "border-border"
              }`}
            >
              <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[0.7rem] transition-colors ${
                active ? "border-accent bg-accent text-accent-foreground" : "border-border"
              }`}>
                {active && "✓"}
              </span>
              <span className="font-display font-medium text-[0.95rem]">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={back} className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
          ← Volver
        </button>
        <button
          onClick={next}
          disabled={data.sintomas.length === 0}
          className="px-8 py-3 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase disabled:opacity-30 hover:bg-dark-gray transition-colors"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
};

export default StepSintomas;
