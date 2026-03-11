import { useScrollReveal } from "@/hooks/useScrollReveal";

const QuoteSection = () => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="reveal py-32 md:py-56 text-center">
      <div className="container">
        <p className="font-serif text-[clamp(1.5rem,4vw,3rem)] font-light italic leading-snug text-dark-gray max-w-[800px] mx-auto mb-8">
          "Si entiendes lo que tienes, confías."
        </p>
        <p className="font-mono text-[0.75rem] tracking-[0.2em] uppercase text-mid-gray">
          Equipo Clínica Miró · 18 años de experiencia · 11.000+ implantes documentados
        </p>
      </div>
    </section>
  );
};

export default QuoteSection;
