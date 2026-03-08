import { useScrollReveal } from "@/hooks/useScrollReveal";

const programs = [
  { name: "Miro One", type: "Implantes", desc: "Rehabilitación con implantes. Predicción de éxito ImplantX antes de intervenir.", price: "Desde $2.800.000" },
  { name: "Revive", type: "Rehabilitación", desc: "Estética + función. Análisis ARMONÍA + Simetría para resultado predecible.", price: "Desde $1.500.000" },
  { name: "Align", type: "Ortodoncia", desc: "Corrección de alineación con planificación digital completa.", price: "Desde $1.200.000" },
  { name: "Zero Caries", type: "Prevención", desc: "Detección temprana SCANDENT. Sin inyección, sin taladro.", price: "Desde $350.000" },
];

const ProgramsSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section id="programs" className="py-24 md:py-40 bg-foreground text-background relative overflow-hidden">
      {/* Background text */}
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

        {/* HUMANA.AI featured card */}
        <div className="mb-px">
          {(() => {
            const ref = useScrollReveal();
            return (
              <div ref={ref} className="reveal bg-accent/[0.06] border border-accent/20 p-8 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="font-[800] text-[clamp(1.2rem,2vw,1.6rem)] uppercase tracking-[0.05em]">
                      HUMANA.AI · Demo Interactivo
                    </div>
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
            );
          })()}
        </div>

        {/* Program cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
          {programs.map((p) => {
            const ref = useScrollReveal();
            return (
              <div
                key={p.name}
                ref={ref}
                className="reveal bg-background/[0.03] border border-background/[0.06] p-8 md:p-10 flex flex-col gap-4 backdrop-blur-sm hover:bg-background/[0.06] hover:border-accent hover:-translate-y-1 transition-all duration-500"
              >
                <div className="font-[800] text-[clamp(1rem,1.5vw,1.3rem)] uppercase tracking-[0.05em]">
                  {p.name}
                </div>
                <div className="font-serif italic text-[0.95rem] text-accent">{p.type}</div>
                <div className="text-[0.8rem] text-background/50 leading-relaxed">{p.desc}</div>
                <div className="font-bold font-mono text-[0.75rem] tracking-[0.1em] text-background/40 mt-auto pt-4 border-t border-background/[0.06]">
                  {p.price}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
