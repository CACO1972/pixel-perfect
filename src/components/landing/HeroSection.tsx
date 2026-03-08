import { useEffect, useRef } from "react";

const stats = [
  { num: "30+", label: "Años de experiencia" },
  { num: "15K", label: "Pacientes tratados" },
  { num: "1ª", label: "Clínica con IA" },
  { num: "98%", label: "Satisfacción" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="reveal min-h-screen flex flex-col justify-center pt-24 relative overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-[0.08] grayscale-[0.5]"
        >
          <source src="/videos/teaser.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container relative z-[2]">
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 mb-8 md:mb-12">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-mid-gray">
            Humana.AI · Lanzamiento 16 de marzo · Santiago, Chile
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display font-[900] text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.03em] uppercase mb-6 md:mb-10">
          Tres dentistas.<br />
          Tres diagnósticos<br />
          <em className="not-italic text-accent">distintos.</em>
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-[clamp(1.1rem,2.5vw,1.6rem)] font-light italic text-mid-gray max-w-[620px] leading-relaxed mb-8 md:mb-12">
          HUMANA reduce la incertidumbre del paciente y aumenta su confianza para decidir. Evidencia científica + predicción de escenarios, traducidos a explicaciones claras.
        </p>

        {/* CTA */}
        <a
          href="#form"
          className="inline-flex items-center gap-3 text-[0.85rem] font-semibold tracking-[0.15em] uppercase text-foreground no-underline px-8 py-4 border-2 border-foreground hover:bg-foreground hover:text-background transition-all group"
        >
          Reservar mi cupo
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 md:gap-16 mt-16 md:mt-24 pt-8 border-t border-border">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-[800] text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.02em] leading-none">
                {s.num}
              </div>
              <div className="text-[0.7rem] tracking-[0.15em] uppercase text-mid-gray mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked bg text (desktop) */}
      <div className="hidden lg:block absolute right-[-2vw] top-1/2 -translate-y-1/2 z-[1] pointer-events-none">
        {["HUMANA", "HUMANA", "HUMANA", "HUMANA"].map((text, i) => (
          <span
            key={i}
            className="block font-display font-[900] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85] tracking-[-0.03em] whitespace-nowrap"
            style={{ opacity: 0.04 - i * 0.01 }}
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
