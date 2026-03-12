import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useEffect, useState } from "react";

interface RouteData {
  num: string;
  title: string;
  desc: string;
  expandedText: string;
  href: string;
  tags: string[];
}

const RouteItem = ({ route }: { route: RouteData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

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
      className="reveal border-b border-border"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <a
        href={route.href}
        className="block py-6 md:py-10 no-underline text-foreground group"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-4 md:gap-10">
            <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent font-semibold min-w-[2rem]">{route.num}</span>
            <span className="font-bold text-[clamp(1.2rem,2.5vw,2rem)] tracking-[-0.01em] group-hover:text-accent transition-colors duration-300">{route.title}</span>
          </div>
          <svg
            className="w-5 h-5 text-muted-foreground ml-4 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>

        {/* Desktop short desc (always visible) */}
        <p className="hidden md:block text-[0.85rem] text-muted-foreground ml-[calc(2rem+2.5rem)] mt-1 leading-relaxed max-w-lg">
          {route.desc}
        </p>

        {/* Expandable content */}
        <div
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{
            maxHeight: expanded ? "200px" : "0px",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div className="ml-[calc(2rem+2.5rem)] md:ml-[calc(2rem+2.5rem)] pt-4 pb-2">
            <p className="text-[0.9rem] text-foreground/80 leading-relaxed max-w-lg mb-3">
              {route.expandedText}
            </p>
            <div className="flex flex-wrap gap-2">
              {route.tags.map((tag) => (
                <span key={tag} className="text-[0.7rem] font-display tracking-wide uppercase bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

const routes: RouteData[] = [
  {
    num: "01",
    title: "Es mi primera vez",
    desc: "Evaluación completa con IA. Diagnóstico claro y plan personalizado.",
    expandedText: "Ingresarás a una preevaluación asistida con inteligencia artificial, única en Chile. Ideal si no tienes un diagnóstico previo y quieres saber exactamente qué necesitas, con claridad y sin compromisos.",
    tags: ["Análisis IA", "Plan personalizado", "Sin compromiso"],
    href: "/evaluacion",
  },
  {
    num: "02",
    title: "Quiero una segunda opinión",
    desc: "Ya tienes un diagnóstico o presupuesto. Compáralo con evidencia objetiva.",
    expandedText: "Si ya tienes un diagnóstico previo y quieres validarlo, o si recibiste un presupuesto de otra clínica y quieres comparar precios y tratamientos. Te ayudamos con evidencia objetiva.",
    tags: ["Comparar presupuesto", "Validar diagnóstico", "Respuesta en 24h"],
    href: "/segunda-opinion",
  },
];

const RoutesSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section className="py-24 md:py-40">
      <div className="container">
        <div ref={headerRef} className="reveal mb-12 md:mb-20">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent mb-3">Tu camino</p>
          <h2 className="font-display font-[900] text-[clamp(2rem,5vw,4rem)] uppercase tracking-[-0.02em] leading-[0.95]">
            Comienza<br />aquí.
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
