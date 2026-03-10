import { useState } from "react";

const PROGRAMAS = [
  {
    id: "evaluacion",
    nombre: "Evaluación Premium",
    precio: 49000,
    desc: "Diagnóstico IA + plan de tratamiento + alternativas escritas",
  },
  {
    id: "implantes",
    nombre: "MIRO ONE · Implantes",
    precio: 890000,
    desc: "Implante unitario completo (cirugía + corona)",
  },
  {
    id: "ortodoncia",
    nombre: "ALIGN · Ortodoncia",
    precio: 1490000,
    desc: "Tratamiento ortodóntico integral con alineadores",
  },
  {
    id: "rehabilitacion",
    nombre: "REVIVE · Rehabilitación",
    precio: 650000,
    desc: "Rehabilitación oral personalizada",
  },
];

const CUOTAS_OPTIONS = [1, 3, 6, 12, 18, 24];

const formatCLP = (n: number) => "$" + n.toLocaleString("es-CL");

const Costos = () => {
  const [selectedPrograma, setSelectedPrograma] = useState(PROGRAMAS[0]);
  const [cuotas, setCuotas] = useState(1);

  const cuotaMensual = Math.round(selectedPrograma.precio / cuotas);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="container flex items-center justify-between">
          <a href="/" className="font-serif font-light text-[1.3rem] tracking-[0.04em] text-foreground no-underline">
            Clínica Miró<span className="text-accent">.</span>
          </a>
          <span className="text-[0.75rem] tracking-[0.12em] uppercase text-mid-gray font-display">
            Financiamiento
          </span>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-[720px]">
          <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
            <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-2">
              Costos y <span className="text-accent">financiamiento</span>
            </h1>
            <p className="text-mid-gray text-[0.95rem] mb-10">
              Simula tus cuotas. Todas las opciones incluyen financiamiento sin interés con tarjeta de crédito.
            </p>

            {/* Program selector */}
            <div className="grid gap-3 mb-8">
              {PROGRAMAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPrograma(p); setCuotas(1); }}
                  className={`w-full text-left px-6 py-5 border rounded-xl transition-all flex items-center justify-between ${
                    selectedPrograma.id === p.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  <div>
                    <p className="font-display font-bold text-[0.95rem]">{p.nombre}</p>
                    <p className="text-mid-gray text-[0.8rem]">{p.desc}</p>
                  </div>
                  <span className="font-display font-[800] text-[1.1rem] text-accent tabular-nums whitespace-nowrap ml-4">
                    {formatCLP(p.precio)}
                  </span>
                </button>
              ))}
            </div>

            {/* Simulator */}
            <div className="border border-border rounded-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-display font-bold text-[1.1rem]">{selectedPrograma.nombre}</p>
                  <p className="text-mid-gray text-[0.8rem]">Precio total</p>
                </div>
                <span className="font-display font-[800] text-[1.8rem] text-accent tabular-nums">
                  {formatCLP(selectedPrograma.precio)}
                </span>
              </div>

              <p className="text-[0.75rem] font-display uppercase tracking-wide text-mid-gray mb-3">
                Selecciona número de cuotas
              </p>
              <div className="grid grid-cols-6 gap-2 mb-6">
                {CUOTAS_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCuotas(c)}
                    className={`py-3 rounded-lg text-center font-display font-semibold text-[0.85rem] transition-all ${
                      cuotas === c
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-foreground hover:bg-accent/10"
                    }`}
                  >
                    {c === 1 ? "1x" : `${c}x`}
                  </button>
                ))}
              </div>

              {/* Result */}
              <div className="bg-secondary rounded-xl p-6 text-center">
                {cuotas === 1 ? (
                  <div>
                    <p className="text-mid-gray text-[0.85rem] mb-1">Pago al contado</p>
                    <p className="font-display font-[800] text-[2.5rem] text-accent tabular-nums leading-none">
                      {formatCLP(selectedPrograma.precio)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-mid-gray text-[0.85rem] mb-1">{cuotas} cuotas sin interés de</p>
                    <p className="font-display font-[800] text-[2.5rem] text-accent tabular-nums leading-none">
                      {formatCLP(cuotaMensual)}
                      <span className="text-mid-gray text-[0.9rem] font-normal">/mes</span>
                    </p>
                    <p className="text-mid-gray text-[0.75rem] mt-2">
                      Total: {formatCLP(selectedPrograma.precio)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment methods */}
            <div className="border border-border rounded-xl p-6 mb-8">
              <h3 className="font-display font-bold text-[0.85rem] uppercase tracking-wide text-mid-gray mb-4">
                Medios de pago aceptados
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "💳", label: "Tarjeta de crédito", sub: "Hasta 24 cuotas" },
                  { icon: "🏦", label: "Tarjeta de débito", sub: "Pago inmediato" },
                  { icon: "📲", label: "Transferencia", sub: "Banco a banco" },
                  { icon: "🔄", label: "Flow.cl", sub: "Pago seguro" },
                ].map((m) => (
                  <div key={m.label} className="text-center p-3">
                    <span className="text-2xl block mb-1">{m.icon}</span>
                    <p className="font-display font-semibold text-[0.8rem]">{m.label}</p>
                    <p className="text-[0.7rem] text-mid-gray">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/evaluacion"
                className="flex-1 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase text-center hover:bg-dark-gray transition-colors no-underline rounded-xl"
              >
                Agendar evaluación →
              </a>
              <a
                href="https://wa.me/56935572986?text=Hola%2C%20tengo%20una%20consulta%20sobre%20costos%20y%20financiamiento."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 border-2 border-foreground text-foreground font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase text-center hover:bg-foreground hover:text-background transition-colors no-underline rounded-xl"
              >
                Consultar por WhatsApp
              </a>
            </div>

            <p className="text-center text-[0.75rem] text-mid-gray mt-6">
              Los valores son referenciales y pueden variar según el diagnóstico clínico.
              <br />Consulta por convenios y descuentos especiales.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container text-center">
          <p className="text-[0.75rem] text-mid-gray font-display">
            Clínica Miró · Av. Nueva Providencia 2214, Of 189, Providencia
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/60 mt-2">
            Potenciado por HUMANA.AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Costos;
