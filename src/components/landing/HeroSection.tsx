import { useEffect, useRef } from "react";

const stats = [
  { num: "30+", label: "Años de experiencia" },
  { num: "11K+", label: "Implantes documentados" },
  { num: "6", label: "Módulos IA activos" },
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
        {/* HUMANA.AI badge */}
        <div className="inline-flex items-center gap-2 mb-8 md:mb-12">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent">
            Potenciado por HUMANA.AI · 6 módulos activos
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif font-light text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] tracking-[-0.01em] mb-6 md:mb-10">
          Si entiendes<br />
          lo que tienes,<br />
          <em className="not-italic text-accent">confías.</em>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-[clamp(1rem,2vw,1.25rem)] font-light text-mid-gray max-w-[620px] leading-relaxed mb-8 md:mb-12">
          La mayoría llega con un presupuesto de otra clínica que no entiende. Aquí el diagnóstico se explica, se escribe y se documenta. Tú decides.
        </p>

        {/* CTA */}
        <a
          href="/evaluacion"
          className="inline-flex items-center gap-3 text-[0.85rem] font-semibold tracking-[0.15em] uppercase text-accent-foreground no-underline px-8 py-4 bg-accent hover:opacity-90 hover:-translate-y-px transition-all group"
        >
          Comenzar evaluación
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 md:gap-16 mt-16 md:mt-24 pt-8 border-t border-border">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-[800] text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.02em] leading-none">
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
