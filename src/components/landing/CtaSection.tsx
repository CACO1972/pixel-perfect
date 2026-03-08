import { useScrollReveal } from "@/hooks/useScrollReveal";

const CtaSection = () => {
  const headlineRef = useScrollReveal();
  const formRef = useScrollReveal();

  return (
    <section id="form" className="py-24 md:py-40 bg-secondary text-center">
      <div className="container">
        <h2 ref={headlineRef} className="reveal font-display font-[900] text-[clamp(2rem,6vw,5rem)] uppercase tracking-[-0.03em] leading-[0.95] mb-8">
          Tu sonrisa merece<br />una decisión <span className="text-accent">informada.</span>
        </h2>
        <p className="font-serif italic text-[clamp(1rem,2vw,1.3rem)] text-mid-gray mb-12">
          Evidencia científica + predicción de escenarios. Traducidos a claridad.
        </p>

        {/* Price highlight */}
        <div className="inline-flex items-center gap-6 px-8 py-5 bg-background border border-border rounded-2xl mb-10">
          <span className="text-[2.5rem] font-[800] text-accent leading-none tabular-nums">$49.000</span>
          <div className="text-left">
            <div className="text-[0.85rem] font-semibold">Evaluación Dental Premium</div>
            <div className="text-[0.75rem] text-mid-gray">Análisis IA + diagnóstico clínico + plan de tratamiento</div>
          </div>
        </div>

        {/* CTA Button */}
        <div ref={formRef} className="reveal max-w-[480px] mx-auto">
          <a
            href="/evaluacion"
            className="inline-block w-full px-5 py-5 bg-foreground text-background border-none rounded-xl font-display text-[1rem] font-bold tracking-[0.05em] uppercase text-center no-underline hover:bg-dark-gray transition-colors"
          >
            Comenzar evaluación →
          </a>
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
            <span className="font-mono text-[10px] text-mid-gray">🔒 Pago seguro · Flow.cl</span>
            <span className="font-mono text-[10px] text-mid-gray">🤖 Análisis IA incluido</span>
            <span className="font-mono text-[10px] text-mid-gray">🦷 Evaluación completa</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mt-8">
          <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray">Evidencia + Predicción + Comunicación</span>
          <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray">Informe claro para tu familia</span>
          <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray">No reemplaza al clínico: lo potencia</span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
