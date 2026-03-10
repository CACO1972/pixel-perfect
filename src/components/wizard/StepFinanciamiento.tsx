import type { WizardData } from "@/pages/Evaluacion";

const PRECIO_BASE = 49000;

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const formatCLP = (n: number) =>
  "$" + n.toLocaleString("es-CL");

const INCLUYE = [
  { icon: "🔬", text: "Evaluación clínica presencial completa con dentista especialista" },
  { icon: "🤖", text: "Análisis con inteligencia artificial HUMANA.AI (6 módulos)" },
  { icon: "📄", text: "Informe Clarity: documento detallado con diagnóstico, alternativas y costos" },
  { icon: "👨‍👩‍👧", text: "Diseñado para que lo compartas con tu familia y tomen decisiones juntos" },
  { icon: "🔁", text: "Alternativas A / B / C escritas para que compares con total libertad" },
  { icon: "🛡️", text: "Sin compromiso: el informe es tuyo, decidas donde decidas tratarte" },
];

const StepFinanciamiento = ({ data, update, next, back }: Props) => {
  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        ¿Por qué una evaluación <span className="text-accent">presencial</span>?
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-6 leading-relaxed">
        El análisis de IA que acabas de ver es orientativo. Para confirmarlo y entregarte un plan concreto, necesitas una evaluación clínica real.
      </p>

      {/* Value proposition */}
      <div className="border border-accent/30 bg-accent/5 rounded-xl p-5 mb-6">
        <p className="font-display font-bold text-[0.95rem] mb-1">
          Nuestra promesa
        </p>
        <p className="text-[0.9rem] leading-relaxed text-foreground/90">
          Que salgas entendiendo <span className="font-semibold">exactamente</span> qué tienes, qué opciones existen y cuánto cuesta cada una. Te llevarás un <span className="font-semibold text-accent">Informe Clarity</span> — un documento claro que podrás revisar con tu familia para tomar la mejor decisión, con tranquilidad y sin presión.
        </p>
      </div>

      {/* What's included */}
      <div className="space-y-3 mb-8">
        <p className="font-display font-bold text-[0.8rem] uppercase tracking-wide text-mid-gray">
          Qué incluye tu evaluación
        </p>
        {INCLUYE.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
            <p className="text-[0.85rem] leading-snug">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Informe Clarity highlight */}
      <div className="border border-border bg-secondary/50 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">📋</span>
          <p className="font-display font-bold text-[0.9rem]">Informe Clarity</p>
        </div>
        <p className="text-[0.85rem] text-mid-gray leading-relaxed mb-3">
          Un documento digital que te llevas a casa con:
        </p>
        <ul className="space-y-1.5 text-[0.8rem]">
          {[
            "Diagnóstico confirmado con hallazgos clínicos e IA",
            "Alternativas de tratamiento (A, B, C) con pros y contras",
            "Costos desglosados y opciones de financiamiento",
            "Explicación en lenguaje simple, sin tecnicismos",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[0.55rem] text-accent">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Price summary */}
      <div className="border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-[1rem]">Evaluación Dental Premium</p>
            <p className="text-mid-gray text-[0.75rem]">
              Clínica presencial + Informe Clarity + IA
            </p>
          </div>
          <span className="font-display font-[800] text-[1.5rem] text-accent tabular-nums">
            {formatCLP(PRECIO_BASE)}
          </span>
        </div>
        <p className="text-[0.7rem] text-mid-gray mt-3">
          Pago seguro vía Flow.cl · Cuotas disponibles en la pasarela de pago
        </p>
      </div>

      <button
        onClick={next}
        className="w-full py-4 bg-foreground text-background font-display font-bold text-[0.95rem] tracking-[0.05em] uppercase rounded-xl hover:bg-dark-gray transition-colors"
      >
        Continuar →
      </button>

      <button
        onClick={back}
        className="mt-6 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase block mx-auto"
      >
        ← Volver
      </button>
    </div>
  );
};

export default StepFinanciamiento;
