import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CtaSection = () => {
  const headlineRef = useScrollReveal();
  const formRef = useScrollReveal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section id="form" className="py-24 md:py-40 bg-secondary text-center">
      <div className="container">
        <h2 ref={headlineRef} className="reveal font-display font-[900] text-[clamp(2rem,6vw,5rem)] uppercase tracking-[-0.03em] leading-[0.95] mb-8">
          Tu sonrisa merece<br />una decisión <span className="text-accent">informada.</span>
        </h2>
        <p className="font-serif italic text-[clamp(1rem,2vw,1.3rem)] text-mid-gray mb-12">
          Evidencia científica + predicción de escenarios. Traducidos a claridad.
        </p>

        {/* Counter */}
        <div className="inline-flex items-center gap-6 px-8 py-5 bg-background border border-border rounded-2xl mb-10">
          <span className="text-[2.5rem] font-[800] text-accent leading-none tabular-nums">50</span>
          <div className="text-left">
            <div className="text-[0.85rem] font-semibold">Cupos disponibles</div>
            <div className="text-[0.75rem] text-mid-gray">de 50 totales · por orden de inscripción</div>
            <div className="w-[200px] h-[3px] bg-border rounded-full mt-1.5 overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-accent to-gold-light rounded-full" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div ref={formRef} className="reveal max-w-[480px] mx-auto">
          {!submitted ? (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                  className="px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none focus:border-accent transition-colors bg-background"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp +56 9 ..."
                  required
                  className="px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none focus:border-accent transition-colors bg-background"
                />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none focus:border-accent transition-colors bg-background"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-4 bg-foreground text-background border-none rounded-xl font-display text-[0.95rem] font-bold tracking-[0.05em] uppercase cursor-pointer hover:bg-dark-gray transition-colors disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Reservar mi cupo"}
                </button>
              </form>
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                <span className="font-mono text-[10px] text-mid-gray">🔒 Sin costo</span>
                <span className="font-mono text-[10px] text-mid-gray">📱 WhatsApp</span>
                <span className="font-mono text-[10px] text-mid-gray">🦷 Evaluación completa</span>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-[60px] h-[60px] rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center mx-auto mb-4 text-2xl">
                ✅
              </div>
              <h3 className="font-serif text-2xl font-normal mb-2">¡Cupo reservado!</h3>
              <p className="text-mid-gray text-[0.9rem] leading-relaxed">
                Te contactaremos por WhatsApp para coordinar tu evaluación.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mt-8">
          <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray">Evidencia + Predicción + Comunicación</span>
          <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray">Informe claro para tu familia</span>
          <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray">No reemplaza al clínico: lo potencia</span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
