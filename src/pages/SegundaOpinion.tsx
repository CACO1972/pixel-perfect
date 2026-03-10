import { useState, useRef } from "react";

type Flujo = "presupuesto" | "clinico" | null;

const SegundaOpinion = () => {
  const [flujo, setFlujo] = useState<Flujo>(null);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [enviado, setEnviado] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp message with form data
    const tipo = flujo === "presupuesto" ? "Revisión de presupuesto" : "Segunda opinión clínica";
    const msg = `Hola, quiero una segunda opinión.\n\nTipo: ${tipo}\nNombre: ${nombre}\nEmail: ${email}\n\nDescripción: ${descripcion}`;
    const waUrl = `https://wa.me/56935572986?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    setEnviado(true);
  };

  const inputClass =
    "w-full px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none transition-colors bg-background focus:border-accent";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="container flex items-center justify-between">
          <a href="/" className="font-serif font-light text-[1.3rem] tracking-[0.04em] text-foreground no-underline">
            Clínica Miró<span className="text-accent">.</span>
          </a>
          <span className="text-[0.75rem] tracking-[0.12em] uppercase text-mid-gray font-display">
            Segunda Opinión
          </span>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-[640px]">
          {enviado ? (
            <div className="text-center py-16 animate-[fadeInUp_0.5s_var(--ease)_both]">
              <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mx-auto mb-6 text-4xl">
                ✅
              </div>
              <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
                ¡Solicitud <span className="text-accent">enviada</span>!
              </h1>
              <p className="text-mid-gray text-[1rem] leading-relaxed mb-8 max-w-md mx-auto">
                Nuestro equipo revisará tu caso y te contactará por WhatsApp en menos de 24 horas hábiles.
              </p>
              <a
                href="/"
                className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors no-underline inline-block"
              >
                Volver al inicio
              </a>
            </div>
          ) : !flujo ? (
            <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
              <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-2">
                Segunda <span className="text-accent">opinión</span>
              </h1>
              <p className="text-mid-gray text-[0.95rem] mb-10">
                ¿Tienes un presupuesto o diagnóstico de otra clínica? Te damos nuestra evaluación honesta.
              </p>

              <div className="grid gap-4">
                <button
                  onClick={() => setFlujo("presupuesto")}
                  className="w-full text-left border border-border rounded-xl p-6 hover:border-accent hover:bg-accent/5 transition-all"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl">📄</span>
                    <div>
                      <p className="font-display font-bold text-[1.1rem]">Revisar presupuesto</p>
                      <p className="text-mid-gray text-[0.85rem]">Sube tu presupuesto y te damos una opinión detallada</p>
                    </div>
                  </div>
                  <ul className="ml-14 space-y-1 text-[0.8rem] text-mid-gray">
                    <li>• Comparativa de precios</li>
                    <li>• Verificación de tratamientos propuestos</li>
                    <li>• Alternativas si aplica</li>
                  </ul>
                </button>

                <button
                  onClick={() => setFlujo("clinico")}
                  className="w-full text-left border-2 border-accent bg-accent/5 rounded-xl p-6 hover:bg-accent/10 transition-all relative"
                >
                  <span className="absolute top-3 right-3 text-[0.65rem] font-display font-bold tracking-[0.12em] uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                    Recomendado
                  </span>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl">🔬</span>
                    <div>
                      <p className="font-display font-bold text-[1.1rem]">Segunda opinión clínica</p>
                      <p className="text-mid-gray text-[0.85rem]">Radiografía + diagnóstico IA + evaluación profesional</p>
                    </div>
                  </div>
                  <ul className="ml-14 space-y-1 text-[0.8rem] text-mid-gray">
                    <li>• Análisis de radiografía con IA</li>
                    <li>• Diagnóstico independiente</li>
                    <li>• Plan alternativo con costos</li>
                  </ul>
                </button>
              </div>

              <a href="/" className="mt-8 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase block text-center no-underline">
                ← Volver al inicio
              </a>
            </div>
          ) : (
            <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
              <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
                {flujo === "presupuesto" ? (
                  <>Revisión de <span className="text-accent">presupuesto</span></>
                ) : (
                  <>Opinión <span className="text-accent">clínica</span></>
                )}
              </h2>
              <p className="text-mid-gray text-[0.95rem] mb-8">
                {flujo === "presupuesto"
                  ? "Sube tu presupuesto y completa tus datos para que podamos revisarlo."
                  : "Cuéntanos tu caso y sube tu radiografía si la tienes."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre completo *"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={inputClass}
                  required
                />
                <input
                  type="tel"
                  placeholder="WhatsApp +56 9 ... *"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={inputClass}
                  required
                />
                <input
                  type="email"
                  placeholder="tu@email.com *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
                <textarea
                  placeholder={
                    flujo === "presupuesto"
                      ? "Describe brevemente los tratamientos del presupuesto..."
                      : "Describe tu situación dental actual..."
                  }
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className={`${inputClass} min-h-[120px] resize-none`}
                  required
                />

                {/* File upload */}
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 hover:border-accent/50 transition-colors cursor-pointer"
                  >
                    <span className="text-2xl">{archivo ? "📎" : "📤"}</span>
                    <span className="font-display text-[0.85rem] font-medium">
                      {archivo ? archivo.name : flujo === "presupuesto" ? "Subir presupuesto (PDF/Imagen)" : "Subir radiografía (opcional)"}
                    </span>
                    <span className="text-[0.7rem] text-mid-gray">Máx 10MB · PDF, JPG, PNG</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setFlujo(null)}
                    className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors"
                  >
                    Enviar por WhatsApp →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container text-center">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/60">
            Potenciado por HUMANA.AI · Clínica Miró
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SegundaOpinion;
