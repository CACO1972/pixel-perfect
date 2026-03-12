import { useState } from "react";
import { notifyStaff } from "@/lib/api";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const inputClass =
  "w-full px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none transition-colors bg-background focus:border-accent";

const SegundaOpinionClinica = ({ onBack, onSuccess }: Props) => {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const staffMsg = `🔍 SEGUNDA OPINIÓN CLÍNICA\n\n👤 ${nombre}\n📱 ${whatsapp}\n📧 ${email}\n💬 ${descripcion}`;
    notifyStaff(staffMsg).catch((err) => console.warn("Staff notify failed:", err));

    const msg = `Hola, necesito una segunda opinión clínica.\n\nNombre: ${nombre}\nEmail: ${email}\n\n${descripcion}`;
    const waUrl = `https://wa.me/56935572986?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Evaluación <span className="text-accent">independiente</span>
      </h2>
      <p className="text-muted-foreground text-[0.95rem] mb-8">
        Cuéntanos tu situación. Nuestro equipo te contactará para agendar tu evaluación presencial con análisis IA incluido.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nombre completo *" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} required />
        <input type="tel" placeholder="WhatsApp +56 9 ... *" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} required />
        <input type="email" placeholder="tu@email.com *" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <textarea
          placeholder="¿Qué te dijeron en la otra clínica? ¿Qué parte del diagnóstico te genera desconfianza?"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={`${inputClass} min-h-[120px] resize-none`}
          required
        />

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

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={onBack} className="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors font-display tracking-wide uppercase">
            ← Volver
          </button>
          <button type="submit" disabled={loading} className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:opacity-90 transition-colors disabled:opacity-50">
            {loading ? "Enviando..." : "Enviar solicitud →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SegundaOpinionClinica;
