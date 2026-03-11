import { useRef, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const programs = [
  { name: "Miro One", type: "Implantes", desc: "Rehabilitación con implantes. Predicción de éxito ImplantX antes de intervenir.", price: "Desde $2.800.000", icon: "◆" },
  { name: "Revive", type: "Rehabilitación", desc: "Estética + función. Análisis ARMONÍA + Simetría para resultado predecible.", price: "Desde $1.500.000", icon: "◈" },
  { name: "Align", type: "Ortodoncia", desc: "Corrección de alineación con planificación digital completa.", price: "Desde $1.200.000", icon: "▣" },
  { name: "Zero Caries", type: "Prevención", desc: "Detección temprana SCANDENT. Sin inyección, sin taladro.", price: "Desde $350.000", icon: "◎" },
];

const GlassCard = ({ p, index }: { p: typeof programs[0]; index: number }) => {
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
      className="reveal group relative flex flex-col gap-4 p-8 md:p-10 rounded-none overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(var(--gold)/0.25)]"
      style={{
        background: "linear-gradient(135deg, hsl(var(--background) / 0.08) 0%, hsl(var(--background) / 0.03) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid hsl(var(--background) / 0.08)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsl(var(--gold) / 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Icon */}
      <span className="text-accent text-2xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity">{p.icon}</span>

      <div className="relative z-[1]">
        <div className="font-[800] text-[clamp(1rem,1.5vw,1.3rem)] uppercase tracking-[0.05em] text-background group-hover:text-accent transition-colors duration-300">{p.name}</div>
        <div className="font-serif italic text-[0.95rem] text-accent mt-1">{p.type}</div>
        <div className="text-[0.8rem] text-background/50 leading-relaxed mt-3">{p.desc}</div>
        <div className="font-bold font-mono text-[0.75rem] tracking-[0.1em] text-background/40 mt-auto pt-4 border-t border-background/[0.06]">{p.price}</div>
      </div>
    </div>
  );
};

const ProgramsSection = () => {
  const headerRef = useScrollReveal();
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = featuredRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="programs" className="py-24 md:py-40 bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-[900] text-[clamp(8rem,25vw,20rem)] uppercase tracking-[-0.04em] text-background/[0.02] whitespace-nowrap pointer-events-none" aria-hidden="true">
        HUMANA
      </div>

      <div className="container relative z-[2]">
        <div ref={headerRef} className="reveal mb-16 md:mb-24">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent mb-3">Programas</p>
          <h2 className="font-display font-[900] text-[clamp(2rem,5vw,4rem)] uppercase tracking-[-0.02em] leading-[0.95] text-background">
            Tu tratamiento,<br />diseñado.
          </h2>
        </div>

        <div ref={featuredRef} className="reveal mb-px bg-accent/[0.06] border border-accent/20 p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="font-[800] text-[clamp(1.2rem,2vw,1.6rem)] uppercase tracking-[0.05em]">HUMANA.AI · Demo Interactivo</div>
              <div className="font-serif italic text-[0.95rem] text-accent mt-1">Decidir con confianza</div>
              <div className="text-[0.8rem] text-background/50 leading-relaxed mt-2 max-w-[600px]">
                HUMANA combina evidencia científica + predicción de escenarios y lo traduce a explicaciones claras para que el paciente decida informado.
              </div>
            </div>
            <a href="#form" className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-foreground text-[0.75rem] font-bold tracking-[0.12em] uppercase no-underline hover:-translate-y-px transition-transform whitespace-nowrap">
              Comenzar →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px]">
          {programs.map((p, i) => (
            <GlassCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
