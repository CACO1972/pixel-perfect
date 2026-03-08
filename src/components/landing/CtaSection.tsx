import { useScrollReveal } from "@/hooks/useScrollReveal";

const CtaSection = () => {
  const headlineRef = useScrollReveal();
  const formRef = useScrollReveal();

  return (
    <section id="form" className="py-24 md:py-40 bg-secondary text-center">
      <div className="container">
        <h2 ref={headlineRef} className="reveal font-serif font-light text-[clamp(2rem,5vw,4rem)] tracking-[-0.01em] leading-[1.05] mb-8">
          Tu evaluación,<br />potenciada por <span className="text-accent">IA.</span>
        </h2>
        <p className="font-body text-[clamp(1rem,2vw,1.2rem)] text-mid-gray mb-12 max-w-lg mx-auto">
          Evidencia científica + predicción de escenarios. Traducidos a un Informe Clarity para ti y tu familia.
        </p>

        {/* Price highlight */}
        <div className="inline-flex items-center gap-6 px-8 py-5 bg-background border border-border mb-10">
          <span className="text-[2.5rem] font-display font-[800] text-accent leading-none tabular-nums">$49.000</span>
          <div className="text-left">
            <div className="text-[0.85rem] font-semibold">Evaluación Dental Premium</div>
            <div className="text-[0.75rem] text-mid-gray leading-relaxed">
              Radiografía + Análisis IA (6 módulos) + Informe Clarity + Consulta especialista
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div ref={formRef} className="reveal max-w-[480px] mx-auto">
          <a
            href="/evaluacion"
            className="inline-block w-full px-5 py-5 bg-accent text-accent-foreground border-none font-display text-[1rem] font-bold tracking-[0.05em] uppercase text-center no-underline hover:opacity-90 transition-colors"
          >
            Comenzar evaluación →
          </a>
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
            <span className="font-mono text-[10px] text-mid-gray">🔒 Pago seguro · Flow.cl</span>
            <span className="font-mono text-[10px] text-mid-gray">🤖 6 módulos IA incluidos</span>
            <span className="font-mono text-[10px] text-mid-gray">📋 Informe Clarity</span>
          </div>

          {/* WhatsApp alternative */}
          <div className="mt-6 pt-6 border-t border-border">
            <a
              href="https://wa.me/56974157966?text=Hola%2C%20quiero%20agendar%20mi%20evaluación%20presencial."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors no-underline"
            >
              ¿Prefieres pagar presencial? <span className="underline">Agenda por WhatsApp →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
