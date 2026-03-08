import { useRef, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const modules = [
  {
    icon: "🔍",
    name: "SCANDENT",
    desc: "Pre-diagnóstico dental con IA. Analiza tu foto y detecta hallazgos antes de la consulta.",
    tag: "Análisis dental",
  },
  {
    icon: "🦴",
    name: "ImplantX",
    desc: "Evaluación de riesgo implantológico. Predicción de éxito basada en tu caso específico.",
    tag: "Implantes",
  },
  {
    icon: "📐",
    name: "Simetría",
    desc: "Análisis facial y proporciones. Datos objetivos para planificar tu sonrisa ideal.",
    tag: "Estética facial",
  },
  {
    icon: "✨",
    name: "Armonía",
    desc: "Diseño de sonrisa digital. Visualiza el resultado antes de comenzar el tratamiento.",
    tag: "Diseño de sonrisa",
  },
  {
    icon: "🛡️",
    name: "ZeroCaries",
    desc: "Detección temprana de caries. Sin inyección, sin taladro. Intervención mínima.",
    tag: "Prevención",
  },
  {
    icon: "🧠",
    name: "Copilot",
    desc: "Plan de tratamiento generado por IA. Tu Informe Clarity con opciones, costos y escenarios.",
    tag: "Plan de tratamiento",
  },
];

const ModuleCard = ({ m }: { m: typeof modules[0] }) => {
  const ref = useRef<HTMLDivElement>(null);
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
      className="reveal p-6 md:p-8 border border-border/60 bg-background hover:border-accent/40 hover:-translate-y-1 transition-all duration-500 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{m.icon}</span>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent/70">{m.tag}</span>
      </div>
      <h3 className="font-display font-[800] text-[1.1rem] uppercase tracking-[0.05em]">{m.name}</h3>
      <p className="text-[0.85rem] text-mid-gray leading-relaxed">{m.desc}</p>
    </div>
  );
};

const HumanaSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section id="humana" className="py-24 md:py-40 bg-ivory">
      <div className="container">
        <div ref={headerRef} className="reveal mb-16 md:mb-24">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-3">
            Potenciado por HUMANA.AI
          </p>
          <h2 className="font-serif font-light text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.01em] leading-[1.05] mb-4">
            6 módulos de IA analizan<br />tu caso en paralelo.
          </h2>
          <p className="text-mid-gray text-[1rem] max-w-[600px] leading-relaxed">
            No son apps separadas. Son parte integral de tu evaluación. 
            Cada módulo aporta evidencia para que tu decisión sea informada y trazable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <ModuleCard key={m.name} m={m} />
          ))}
        </div>

        {/* Informe Clarity callout */}
        <div className="mt-12 p-8 md:p-10 border border-accent/20 bg-accent/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-[800] text-[1.1rem] uppercase tracking-[0.05em] mb-2">
              📋 Informe Clarity
            </h3>
            <p className="text-mid-gray text-[0.9rem] leading-relaxed max-w-[500px]">
              Recibirás un Informe Clarity: diagnóstico + opciones + costos, en lenguaje que tú y tu familia puedan entender.
            </p>
          </div>
          <a
            href="/evaluacion"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground text-[0.75rem] font-bold tracking-[0.12em] uppercase no-underline hover:-translate-y-px transition-transform whitespace-nowrap"
          >
            Comenzar →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HumanaSection;
