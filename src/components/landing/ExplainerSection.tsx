import { useEffect, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: "01", text: "Responde el cuestionario inteligente (3 min)" },
  { num: "02", text: "La IA genera tu informe Clarity personalizado" },
  { num: "03", text: "Agenda tu evaluación con el equipo de Clínica Miró" },
  { num: "04", text: "Llegas preparado. Sin repetir nada." },
];

const ExplainerSection = () => {
  const headerRef = useScrollReveal();
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".explainer-step").forEach((s) =>
            s.classList.add("animate")
          );
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-40 border-t border-border">
      <div className="container">
        <div ref={headerRef} className="reveal mb-12 md:mb-20">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent mb-3">Cómo funciona</p>
          <h2 className="font-display font-[900] text-[clamp(2rem,5vw,4rem)] uppercase tracking-[-0.02em] leading-[0.95]">
            4 pasos.<br />Sin complicaciones.
          </h2>
        </div>

        {/* Desktop timeline */}
        <div ref={timelineRef} className="hidden md:flex gap-0 relative">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="explainer-step flex-1 flex flex-col items-center relative opacity-0 translate-y-5"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {/* Icon circle */}
              <div className="w-14 h-14 rounded-full border-[1.5px] border-border flex items-center justify-center bg-background relative z-[2] transition-all duration-500">
                <span className="font-display font-bold text-sm">{step.num}</span>
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="step-line absolute top-7 z-[1] h-px bg-border"
                  style={{
                    width: "calc(100% - 56px)",
                    left: "calc(50% + 28px)",
                    transformOrigin: "left",
                    transform: "scaleX(0)",
                  }}
                />
              )}
              {/* Content */}
              <div className="text-center mt-6">
                <span className="block text-[0.65rem] tracking-[0.2em] text-accent mb-1">{`PASO ${step.num}`}</span>
                <span className="text-[clamp(0.85rem,1.2vw,1rem)] font-medium text-dark-gray leading-snug max-w-[160px] mx-auto block">
                  {step.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-start gap-6">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full border-[1.5px] border-accent flex items-center justify-center bg-background relative z-[2]">
                  <span className="font-display font-bold text-sm">{step.num}</span>
                </div>
                {i < steps.length - 1 && <div className="w-px h-10 bg-accent/30" />}
              </div>
              <div className="pb-8 pt-3">
                <span className="block text-[0.65rem] tracking-[0.2em] text-accent mb-1">{`PASO ${step.num}`}</span>
                <span className="text-[0.9rem] font-medium text-dark-gray leading-snug">{step.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplainerSection;
