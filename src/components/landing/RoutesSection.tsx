import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useEffect, useState } from "react";

const RouteItem = ({ route }: { route: { num: string; title: string; desc: string; back: string; href: string } }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal border-b border-border perspective-[1000px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateX(-180deg)" : "rotateX(0deg)",
        }}
      >
        {/* Front */}
        <a
          href={route.href || "#"}
          className="flex items-center justify-between py-6 md:py-10 no-underline text-foreground relative"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-baseline gap-4 md:gap-10">
            <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent font-semibold min-w-[2rem]">{route.num}</span>
            <span className="font-bold text-[clamp(1.2rem,2.5vw,2rem)] tracking-[-0.01em]">{route.title}</span>
          </div>
          <span className="hidden md:block text-[0.85rem] text-muted-foreground max-w-[300px] text-right leading-relaxed">{route.desc}</span>
          <svg className="w-5 h-5 text-muted-foreground ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        {/* Back */}
        <a
          href={route.href || "#"}
          className="absolute inset-0 flex items-center justify-between py-6 md:py-10 no-underline bg-accent text-foreground px-4 md:px-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          <div className="flex items-baseline gap-4 md:gap-10">
            <span className="font-mono text-[0.7rem] tracking-[0.2em] font-semibold min-w-[2rem]">{route.num}</span>
            <span className="font-bold text-[clamp(1rem,2vw,1.5rem)] tracking-[-0.01em]">{route.back}</span>
          </div>
          <span className="text-[0.85rem] font-semibold tracking-[0.12em] uppercase">Ir →</span>
        </a>
      </div>
    </div>
  );
};

const routes = [
  { num: "01", title: "Soy paciente nuevo", desc: "Evaluación completa con IA. Diagnóstico claro y plan personalizado.", back: "Comienza tu evaluación personalizada", href: "/evaluacion" },
  { num: "02", title: "Mi portal de paciente", desc: "Accede a tu historial, informes y seguimiento de tratamiento.", back: "Ingresa a tu portal con tus datos", href: "/paciente" },
  { num: "03", title: "Segunda opinión", desc: "Compara diagnósticos y presupuestos con evidencia científica objetiva.", back: "Sube tu presupuesto y recibe análisis gratuito", href: "/segunda-opinion" },
  { num: "04", title: "Soy de regiones o internacional", desc: "Pre-evaluación remota completa antes de viajar a Santiago.", back: "Evaluación 100% remota con radiografía digital", href: "/evaluacion" },
];

const RoutesSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section className="py-24 md:py-40">
      <div className="container">
        <div ref={headerRef} className="reveal mb-12 md:mb-20">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent mb-3">Tu camino</p>
          <h2 className="font-display font-[900] text-[clamp(2rem,5vw,4rem)] uppercase tracking-[-0.02em] leading-[0.95]">
            Elige tu<br />ruta.
          </h2>
        </div>

        <div className="border-t border-border">
          {routes.map((route) => (
            <RouteItem key={route.num} route={route} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoutesSection;
