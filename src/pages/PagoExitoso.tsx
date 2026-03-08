import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PagoExitoso = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const isSuccess = status === "success" || !status; // default to success on this page

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-4 border-b border-border/40">
        <div className="container">
          <a href="/" className="font-display font-[800] text-[1.1rem] tracking-[0.08em] uppercase text-foreground no-underline">
            Clínica Miró<span className="text-accent">.</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-[560px] text-center">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mx-auto mb-6 text-4xl">
                ✅
              </div>
              <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
                ¡Evaluación <span className="text-accent">confirmada</span>!
              </h1>
              <p className="text-mid-gray text-[1rem] leading-relaxed mb-10 max-w-md mx-auto">
                Tu pago ha sido procesado exitosamente. Te contactaremos por WhatsApp para coordinar tu cita.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href="https://ff.healthatom.io/41knMr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors rounded-xl no-underline"
                >
                  📅 Agendar hora online
                </a>
                <a
                  href="https://wa.me/56935572986?text=Hola%2C%20acabo%20de%20pagar%20mi%20evaluación%20y%20quiero%20agendar%20mi%20hora."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-foreground text-foreground font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-foreground hover:text-background transition-colors rounded-xl no-underline"
                >
                  💬 Agendar por WhatsApp
                </a>
              </div>

              {/* Next steps */}
              <div className="text-left bg-secondary rounded-2xl p-8">
                <h3 className="font-display font-bold text-[0.85rem] uppercase tracking-wide text-mid-gray mb-6">
                  Próximos pasos
                </h3>
                <div className="space-y-5">
                  {[
                    { icon: "📅", title: "Agenda tu hora", desc: "Elige el día y horario que más te acomode" },
                    { icon: "🏥", title: "Llega 15 min antes", desc: "Av. Nueva Providencia 2214, Of 189, Providencia" },
                    { icon: "📷", title: "Radiografía panorámica", desc: "Te la tomamos en la clínica, incluida en tu evaluación" },
                    { icon: "🤖", title: "IA analiza tus imágenes", desc: "HUMANA.AI procesa tus radiografías en tiempo real" },
                    { icon: "📋", title: "Diagnóstico + plan + presupuesto", desc: "Te entregamos un informe claro para tu decisión informada" },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-xl mt-0.5">{step.icon}</span>
                      <div>
                        <p className="font-display font-bold text-[0.9rem]">{step.title}</p>
                        <p className="text-mid-gray text-[0.85rem]">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto mb-6 text-4xl">
                ❌
              </div>
              <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
                Pago no completado
              </h1>
              <p className="text-mid-gray text-[1rem] leading-relaxed mb-8">
                El pago no fue procesado. Puedes intentar de nuevo o contactarnos directamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/evaluacion" className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors rounded-xl no-underline">
                  Intentar de nuevo
                </a>
                <a
                  href="https://wa.me/56974157966?text=Hola%2C%20tuve%20un%20problema%20con%20el%20pago%20de%20mi%20evaluación."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-foreground text-foreground font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-foreground hover:text-background transition-colors rounded-xl no-underline"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container text-center">
          <p className="text-[0.75rem] text-mid-gray font-display">
            Clínica Miró · Av. Nueva Providencia 2214, Of 189, Providencia · +56 9 7415 7966
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/60 mt-2">
            Potenciado por HUMANA.AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PagoExitoso;
