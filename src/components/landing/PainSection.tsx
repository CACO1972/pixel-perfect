import { useRef, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const painData = [
  {
    num: "01",
    old: "Diagnósticos confusos",
    new_text: "Informe Clarity que entiendes",
    desc: "Tu diagnóstico traducido a lenguaje simple, con opciones de tratamiento comparables. Para ti y tu familia.",
  },
  {
    num: "02",
    old: "Presupuestos sin contexto",
    new_text: "Escenarios claros antes de decidir",
    desc: "Cada opción tiene datos reales: tasas de éxito, duración estimada y costos transparentes basados en evidencia.",
  },
  {
    num: "03",
    old: "Decisiones a ciegas",
    new_text: "Soporte a la decisión con IA",
    desc: "No reemplaza a tu dentista: lo potencia. HUMANA combina evidencia + predicción para que tú decidas informado.",
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
            No más<br />incertidumbre.
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
