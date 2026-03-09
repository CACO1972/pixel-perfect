import { useState } from "react";
import type { WizardData } from "@/pages/Evaluacion";

const CUOTAS_OPTIONS = [1, 3, 6, 12];
const PRECIO_BASE = 49000;

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const formatCLP = (n: number) =>
  "$" + n.toLocaleString("es-CL");

const StepFinanciamiento = ({ data, update, next, back }: Props) => {
  const [cuotas, setCuotas] = useState(1);

  const cuotaMensual = Math.round(PRECIO_BASE / cuotas);

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        <span className="text-accent">Financiamiento</span> flexible
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-8">
        Elige cómo pagar tu evaluación premium.
      </p>

      {/* Price display */}
      <div className="border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-display font-bold text-[1rem]">Evaluación Dental Premium</p>
            <p className="text-mid-gray text-[0.75rem]">
              Diagnóstico IA + plan de tratamiento + alternativas escritas
            </p>
          </div>
          <span className="font-display font-[800] text-[1.5rem] text-accent tabular-nums">
            {formatCLP(PRECIO_BASE)}
          </span>
        </div>

        {/* Cuotas selector */}
        <p className="text-[0.75rem] font-display uppercase tracking-wide text-mid-gray mb-3">
          Pagar en cuotas
        </p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {CUOTAS_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCuotas(c)}
              className={`py-3 rounded-lg text-center font-display font-semibold text-[0.85rem] transition-all ${
                cuotas === c
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground hover:bg-accent/10"
              }`}
            >
              {c === 1 ? "Contado" : `${c}x`}
            </button>
          ))}
        </div>

        {/* Monthly amount */}
        {cuotas > 1 && (
          <div className="flex items-center justify-between py-4 border-t border-border">
            <span className="text-[0.85rem] text-mid-gray">
              {cuotas} cuotas sin interés de
            </span>
            <span className="font-display font-[800] text-[1.3rem] tabular-nums">
              {formatCLP(cuotaMensual)}<span className="text-mid-gray text-[0.75rem] font-normal">/mes</span>
            </span>
          </div>
        )}
      </div>

      {/* Payment methods */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="text-[0.7rem] text-mid-gray font-display tracking-wide">Tarjeta de crédito</span>
        <span className="w-px h-3 bg-border" />
        <span className="text-[0.7rem] text-mid-gray font-display tracking-wide">Tarjeta de débito</span>
        <span className="w-px h-3 bg-border" />
        <span className="text-[0.7rem] text-mid-gray font-display tracking-wide">Transferencia</span>
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
