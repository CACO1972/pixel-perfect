import { useState, useRef } from "react";
import { notifyStaff } from "@/lib/api";

type Flujo = "presupuesto" | "clinico" | null;

const SegundaOpinion = () => {
  const [flujo, setFlujo] = useState<Flujo>(null);
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tipo = flujo === "presupuesto" ? "Revisión de presupuesto" : "Segunda opinión clínica";

    // Notify staff via WhatsApp
    const staffMsg = `🔍 SEGUNDA OPINIÓN\n\n👤 ${nombre}\n📱 ${whatsapp}\n📧 ${email}\n📋 Tipo: ${tipo}\n💬 ${descripcion}\n📎 Archivo: ${archivo ? archivo.name : "No adjuntó"}`;
    notifyStaff(staffMsg).catch((err) => console.warn("Staff notify failed:", err));

    // Also open WhatsApp for patient
    const msg = `Hola, necesito una segunda opinión.\n\nTipo: ${tipo}\nNombre: ${nombre}\nEmail: ${email}\n\n${descripcion}`;
    const waUrl = `https://wa.me/56935572986?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setLoading(false);
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
          <span className="text-[0.75rem] tracking-[0.12em] uppercase text-muted-foreground font-display">
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
                Ya recibimos <span className="text-accent">tu caso</span>
              </h1>
              <p className="text-muted-foreground text-[1rem] leading-relaxed mb-4 max-w-md mx-auto">
                Nuestro equipo clínico revisará tu información y te contactará por WhatsApp en menos de 24 horas hábiles.
              </p>
              <p className="text-muted-foreground text-[0.85rem] leading-relaxed mb-8 max-w-md mx-auto">
                No necesitas preparar nada más. Si tienes radiografías adicionales, las puedes enviar por WhatsApp directamente.
              </p>
              <a
                href="/"
                className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:opacity-90 transition-colors no-underline inline-block"
              >
                Volver al inicio
              </a>
            </div>
          ) : !flujo ? (
            <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
              {/* Empathetic headline */}
              <p className="text-accent font-display font-bold text-[0.75rem] tracking-[0.15em] uppercase mb-4">
                Segunda opinión
              </p>
              <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-[1.15] mb-4">
                Te dijeron que necesitas un tratamiento<br />
                <span className="text-accent">y no estás seguro.</span>
              </h1>
              <p className="text-muted-foreground text-[1.05rem] leading-relaxed mb-4 max-w-lg">
                Es normal. Muchos pacientes llegan con un presupuesto que no entienden, un diagnóstico que les genera dudas, o la sensación de que les están vendiendo algo que no necesitan.
              </p>
              <p className="text-foreground text-[1rem] leading-relaxed mb-10 max-w-lg font-medium">
                En Clínica Miró te damos una evaluación honesta, respaldada por inteligencia artificial, para que tomes la mejor decisión con información clara.
              </p>

              {/* Two paths */}
              <div className="grid gap-4">
                <button
                  onClick={() => setFlujo("presupuesto")}
                  className="w-full text-left border border-border rounded-xl p-6 hover:border-accent hover:bg-accent/5 transition-all group"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <span className="text-3xl mt-0.5">📄</span>
                    <div>
                      <p className="font-display font-bold text-[1.1rem] group-hover:text-accent transition-colors">
                        "Me dieron un presupuesto y quiero comparar"
                      </p>
                      <p className="text-muted-foreground text-[0.85rem] mt-1">
                        Sube tu presupuesto de otra clínica y te decimos si los tratamientos son adecuados y si los precios son razonables.
                      </p>
                    </div>
                  </div>
                  <div className="ml-14 flex flex-wrap gap-2">
                    {["Comparativa de precios", "Verificación de tratamientos", "Alternativas"].map((tag) => (
                      <span key={tag} className="text-[0.7rem] font-display tracking-wide uppercase bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                <button
                  onClick={() => setFlujo("clinico")}
                  className="w-full text-left border-2 border-accent bg-accent/5 rounded-xl p-6 hover:bg-accent/10 transition-all relative group"
                >
                  <span className="absolute top-3 right-3 text-[0.65rem] font-display font-bold tracking-[0.12em] uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                    Recomendado
                  </span>
                  <div className="flex items-start gap-4 mb-3">
                    <span className="text-3xl mt-0.5">🔬</span>
                    <div>
                      <p className="font-display font-bold text-[1.1rem] group-hover:text-accent transition-colors">
                        "No confío en el diagnóstico que me dieron"
                      </p>
                      <p className="text-muted-foreground text-[0.85rem] mt-1">
                        Te hacemos una evaluación completa e independiente: radiografía panorámica, análisis con IA y diagnóstico del equipo clínico. Sin compromisos.
                      </p>
                    </div>
                  </div>
                  <div className="ml-14 flex flex-wrap gap-2">
                    {["Radiografía incluida", "Análisis HUMANA.AI", "Plan con costos claros"].map((tag) => (
                      <span key={tag} className="text-[0.7rem] font-display tracking-wide uppercase bg-accent/15 text-accent px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              </div>

              {/* Trust element */}
              <div className="mt-10 border-t border-border/40 pt-8">
                <p className="text-muted-foreground text-[0.8rem] leading-relaxed text-center max-w-md mx-auto">
                  💬 <em>"Me dijeron que necesitaba 4 implantes. En Miró me explicaron que con 2 era suficiente y me ahorraron más de $3 millones."</em>
                </p>
                <p className="text-center text-[0.7rem] text-muted-foreground/60 mt-2 font-display">
                  — Paciente real, 2025
                </p>
              </div>

              <a href="/" className="mt-8 text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors font-display tracking-wide uppercase block text-center no-underline">
                ← Volver al inicio
              </a>
            </div>
          ) : (
            <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
              <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
                {flujo === "presupuesto" ? (
                  <>Revisemos tu <span className="text-accent">presupuesto</span></>
                ) : (
                  <>Evaluación <span className="text-accent">independiente</span></>
                )}
              </h2>
              <p className="text-muted-foreground text-[0.95rem] mb-8">
                {flujo === "presupuesto"
                  ? "Sube el presupuesto que te dieron y cuéntanos qué te genera dudas. Te respondemos en menos de 24h."
                  : "Cuéntanos tu situación. Nuestro equipo te contactará para agendar tu evaluación presencial con análisis IA incluido."}
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
                      ? "¿Qué tratamientos te propusieron? ¿Qué te genera dudas del presupuesto?"
                      : "¿Qué te dijeron en la otra clínica? ¿Qué parte del diagnóstico te genera desconfianza?"
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
                      {archivo
                        ? archivo.name
                        : flujo === "presupuesto"
                          ? "Subir presupuesto (PDF o foto)"
                          : "Subir radiografía o documento (opcional)"}
                    </span>
                    <span className="text-[0.7rem] text-muted-foreground">Máx 10MB · PDF, JPG, PNG</span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                  />
                </div>

                {flujo === "clinico" && (
                  <div className="bg-secondary rounded-xl p-5">
                    <p className="font-display font-bold text-[0.85rem] mb-1">¿Qué incluye?</p>
                    <ul className="text-muted-foreground text-[0.8rem] space-y-1">
                      <li>📷 Radiografía panorámica en clínica</li>
                      <li>🤖 Análisis con 6 módulos HUMANA.AI</li>
                      <li>👨‍⚕️ Diagnóstico del equipo clínico</li>
                      <li>📋 Informe Clarity con opciones y costos claros</li>
                    </ul>
                    <p className="font-display font-bold text-accent text-[0.9rem] mt-3">$49.000 · Evaluación completa</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setFlujo(null)}
                    className="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors font-display tracking-wide uppercase"
                  >
                    ← Volver
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Enviando..." : "Enviar solicitud →"}
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
