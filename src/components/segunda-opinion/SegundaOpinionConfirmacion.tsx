import type { SubFlujo } from "@/pages/SegundaOpinion";

interface Props {
  flujo: SubFlujo;
}

const SegundaOpinionConfirmacion = ({ flujo }: Props) => {
  const isPresupuesto = flujo === "presupuesto";

  return (
    <div className="text-center py-16 animate-[fadeInUp_0.5s_var(--ease)_both]">
      <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mx-auto mb-6 text-4xl">
        ✅
      </div>
      <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
        Ya recibimos <span className="text-accent">tu {isPresupuesto ? "presupuesto" : "caso"}</span>
      </h1>
      <p className="text-muted-foreground text-[1rem] leading-relaxed mb-4 max-w-md mx-auto">
        {isPresupuesto
          ? "Nuestro equipo analizará tu presupuesto y te enviará una comparación detallada por WhatsApp en menos de 24 horas hábiles."
          : "Nuestro equipo clínico revisará tu información y te contactará por WhatsApp en menos de 24 horas hábiles."}
      </p>
      <p className="text-muted-foreground text-[0.85rem] leading-relaxed mb-8 max-w-md mx-auto">
        {isPresupuesto
          ? "Si tienes otros presupuestos para comparar, puedes enviarlos directamente por WhatsApp."
          : "No necesitas preparar nada más. Si tienes radiografías adicionales, las puedes enviar por WhatsApp directamente."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/"
          className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:opacity-90 transition-colors no-underline inline-block"
        >
          Volver al inicio
        </a>
        {isPresupuesto && (
          <a
            href="/evaluacion"
            className="px-8 py-4 border-2 border-accent text-accent font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-accent/10 transition-colors no-underline inline-block"
          >
            Hacer preevaluación IA →
          </a>
        )}
      </div>
    </div>
  );
};

export default SegundaOpinionConfirmacion;
