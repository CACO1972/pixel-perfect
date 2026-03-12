/**
 * CtaSection — Cierre conversional
 * Posición: después de MapaConfianza, antes de SiteFooter
 */

const CtaSection = () => (
  <section className="py-24 md:py-36 relative overflow-hidden">
    {/* Accent line top */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-accent" />

    <div className="container text-center">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 mb-8">
        <span className="w-1.5 h-1.5 bg-accent rounded-full pulse-dot" />
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent">
          Primer paso sin compromiso
        </span>
      </div>

      {/* Headline */}
      <h2 className="font-serif font-light text-[clamp(2rem,5vw,4rem)] leading-[1.08] tracking-[-0.01em] mb-6 max-w-3xl mx-auto">
        Tu diagnóstico claro,<br />
        <em className="not-italic text-accent">en 90 minutos.</em>
      </h2>

      <p className="font-body text-[clamp(1rem,1.5vw,1.15rem)] font-light text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
        Evaluación completa con informe escrito. Sin presión, sin vendedores.
        Solo información que te pertenece.
      </p>

      {/* Price + CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <a
          href="https://ff.healthatom.io/41knMr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-body font-semibold text-[0.95rem] tracking-[0.04em] uppercase transition-all hover:bg-accent/90 hover:shadow-[0_8px_30px_rgba(201,168,124,0.35)] active:scale-[0.98]"
        >
          Agendar evaluación
          <span className="text-white/60 font-mono text-xs">→</span>
        </a>
        <div className="text-center sm:text-left">
          <div className="font-display font-[800] text-2xl tracking-[-0.02em]">$49.000</div>
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground">CLP · 90 min · Informe Clarity</div>
        </div>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
        {[
          "Sin lista de espera",
          "Informe escrito incluido",
          "Cancelación gratuita",
        ].map((item) => (
          <div key={item} className="flex items-center gap-2 font-body text-[0.8rem]">
            <span className="w-1 h-1 bg-accent rounded-full" />
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* Accent line bottom */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-transparent to-accent/30" />
  </section>
);

export default CtaSection;
