import { useRef, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const painData = [
  {
    num: "01",
    old: "Tres dentistas, tres presupuestos",
    new_text: "Un diagnóstico que puedes leer",
    desc: "La variabilidad diagnóstica en odontología llega al 40%. En Miró el criterio es siempre el mismo: datos, no intuición del día.",
  },
  {
    num: "02",
    old: "\u201C¿Por qué tanto? ¿Es necesario?\u201D",
    new_text: "Alternativas escritas, con evidencia",
    desc: "El documento Explica detalla cada alternativa: qué implica, qué riesgos tiene, cuánto cuesta. Te lo llevas. Sin presión.",
  },
  {
    num: "03",
    old: "\u201CMe dijeron que era urgente\u201D",
    new_text: "La urgencia real siempre se documenta",
    desc: "Radiografía aumentada, overlay visual, firma del clínico. Si hay urgencia, verás exactamente por qué. Sin miedo, con evidencia.",
  },
];

const PainCard = ({ item }: { item: typeof painData[0] }) => {
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
      className="reveal bg-secondary p-8 md:p-12 flex flex-col gap-4 hover:bg-background transition-colors duration-500"
    >
      <span className="text-[0.7rem] tracking-[0.2em] text-accent font-semibold">{item.num}</span>
      <span className="font-bold text-[clamp(1rem,1.5vw,1.2rem)] line-through text-mid-gray decoration-foreground/15">{item.old}</span>
      <span className="font-bold text-[clamp(1rem,1.5vw,1.2rem)]">{item.new_text}</span>
      <span className="text-[0.85rem] text-mid-gray leading-relaxed">{item.desc}</span>
    </div>
  );
};

const PainSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section className="py-24 md:py-40 bg-secondary">
      <div className="container">
        <div ref={headerRef} className="reveal mb-16 md:mb-24">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent mb-3">El problema</p>
          <h2 className="font-serif font-light text-[clamp(2rem,5vw,3.5rem)] tracking-[-0.01em] leading-[1.05]">
            El que ya fue<br />y no le creyeron.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {painData.map((item) => (
            <PainCard key={item.num} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainSection;
