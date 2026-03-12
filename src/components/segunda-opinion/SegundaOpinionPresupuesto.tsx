import { useState, useRef } from "react";
import { notifyStaff } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const inputClass =
  "w-full px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none transition-colors bg-background focus:border-accent";

const SegundaOpinionPresupuesto = ({ onBack, onSuccess }: Props) => {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 10 * 1024 * 1024) {
      alert("El archivo no puede superar los 10MB");
      return;
    }
    setArchivo(file);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `presupuestos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("second-opinion")
      .upload(path, file, { contentType: file.type });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      alert("Por favor adjunta tu presupuesto");
      return;
    }
    setLoading(true);
    setUploading(true);

    // Upload file to Supabase storage
    const storagePath = await uploadFile(archivo);
    setUploading(false);

    if (!storagePath) {
      alert("Error al subir el archivo. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    // Notify staff with all info
    const staffMsg = `📄 COMPARACIÓN DE PRESUPUESTO\n\n👤 ${nombre}\n📱 ${whatsapp}\n📧 ${email}\n💬 ${comentario || "Sin comentario"}\n📎 Archivo: ${archivo.name}\n🗂️ Storage: second-opinion/${storagePath}\n\n⚡ Responder en menos de 24h con comparación de aranceles.`;
    notifyStaff(staffMsg).catch((err) => console.warn("Staff notify failed:", err));

    // Also trigger the OCR + Dentalink comparison in background
    try {
      const res = await fetch(
        `https://jipldlklzobiytkvxokf.supabase.co/functions/v1/compare-presupuesto`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storagePath,
            nombre,
            whatsapp,
            email,
            comentario,
          }),
        }
      );
      if (!res.ok) console.warn("Auto-compare failed, staff will handle manually");
    } catch {
      console.warn("Auto-compare unavailable, staff will handle manually");
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Comparar <span className="text-accent">presupuesto</span>
      </h2>
      <p className="text-muted-foreground text-[0.95rem] mb-3">
        Sube el presupuesto que te dieron en otra clínica y te entregamos una comparación con nuestros aranceles.
      </p>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-8">
        <p className="text-[0.8rem] text-foreground font-medium mb-1">⚠️ Importante</p>
        <p className="text-[0.78rem] text-muted-foreground leading-relaxed">
          Para proteger la privacidad, te pedimos que borres o tapes el nombre de la clínica y del dentista antes de subir el documento. Solo necesitamos los tratamientos y montos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nombre completo *" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} required />
        <input type="tel" placeholder="WhatsApp +56 9 ... *" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} required />
        <input type="email" placeholder="tu@email.com *" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />

        {/* File upload */}
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-accent/40 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-accent transition-colors cursor-pointer bg-accent/5"
          >
            <span className="text-2xl">{archivo ? "📎" : "📤"}</span>
            <span className="font-display text-[0.85rem] font-medium">
              {archivo ? archivo.name : "Subir presupuesto (PDF o foto) *"}
            </span>
            <span className="text-[0.7rem] text-muted-foreground">Máx 10MB · PDF, JPG, PNG</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <textarea
          placeholder="¿Qué tratamientos te propusieron? ¿Hay algo que te genere dudas? (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className={`${inputClass} min-h-[100px] resize-none`}
        />

        <div className="bg-secondary rounded-xl p-5">
          <p className="font-display font-bold text-[0.85rem] mb-1">¿Cómo funciona?</p>
          <ol className="text-muted-foreground text-[0.8rem] space-y-1.5 list-decimal list-inside">
            <li>Subes tu presupuesto (sin datos de la clínica original)</li>
            <li>Nuestro equipo analiza los tratamientos y costos</li>
            <li>Te enviamos por WhatsApp una comparación con nuestros aranceles</li>
            <li>Si lo deseas, puedes agendar una evaluación completa</li>
          </ol>
          <p className="font-display font-bold text-accent text-[0.85rem] mt-3">Gratis · Respuesta en menos de 24h</p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={onBack} className="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors font-display tracking-wide uppercase">
            ← Volver
          </button>
          <button type="submit" disabled={loading} className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:opacity-90 transition-colors disabled:opacity-50">
            {loading ? (uploading ? "Subiendo archivo..." : "Enviando...") : "Enviar presupuesto →"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SegundaOpinionPresupuesto;
