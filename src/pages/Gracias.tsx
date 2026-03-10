import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendWhatsApp, notifyStaff, dentalinkProxy } from "@/lib/api";

const PAYMENT_STORAGE_KEY = "miro_payment_pending";

const MOTIVO_LABELS: Record<string, string> = {
  faltan_dientes: "Me faltan dientes",
  mejorar_sonrisa: "Mejorar sonrisa",
  dolor: "Dolor o molestia",
  ortodoncia: "Ortodoncia",
  segunda_opinion: "Segunda opinión",
  preventivo: "Chequeo preventivo",
};

const ZONA_LABELS: Record<string, string> = {
  arriba_derecha: "Arriba derecha",
  arriba_izquierda: "Arriba izquierda",
  abajo_derecha: "Abajo derecha",
  abajo_izquierda: "Abajo izquierda",
  general: "Toda la boca",
};

const SINTOMA_LABELS: Record<string, string> = {
  dolor_morder: "Dolor al morder",
  encias_sangrantes: "Encías sangrantes",
  sensibilidad: "Sensibilidad",
  dientes_flojos: "Dientes flojos",
  mal_aliento: "Mal aliento",
  sin_sintomas: "Sin síntomas",
};

interface PendingPaymentData {
  nombre: string;
  whatsapp: string;
  email: string;
  rut?: string;
  motivo: string;
  zona: string;
  sintomas: string[];
  analisisEstado: string;
  orderId: string;
}

/** Generate a human-friendly unique code from orderId */
const generateCode = (orderId: string): string => {
  const hash = orderId.replace(/[^A-Z0-9]/gi, "").slice(-6).toUpperCase();
  return `MIRO-${hash}`;
};

const Gracias = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const token = searchParams.get("token");
  const whatsappSent = useRef(false);
  const [patientName, setPatientName] = useState("");
  const [codigoUnico, setCodigoUnico] = useState("");

  const pendingRaw = useMemo(() => {
    try {
      return sessionStorage.getItem(PAYMENT_STORAGE_KEY);
    } catch {
      return null;
    }
  }, []);

  const isSuccess = status === "success" || (!!token && status !== "failed" && status !== "error" && !!pendingRaw);

  useEffect(() => {
    if (!isSuccess || whatsappSent.current || !pendingRaw) return;

    try {
      const patient = JSON.parse(pendingRaw) as PendingPaymentData;
      if (!patient?.nombre || !patient?.whatsapp || !patient?.email) return;

      setPatientName(patient.nombre);
      setCodigoUnico(generateCode(patient.orderId));
      whatsappSent.current = true;

      const [nombre, ...apellidoParts] = patient.nombre.trim().split(" ");
      const apellido = apellidoParts.join(" ") || nombre;

      dentalinkProxy("create_patient", {
        nombre,
        apellido,
        telefono: patient.whatsapp,
        email: patient.email,
        ...(patient.rut ? { rut: patient.rut } : {}),
      }).catch((err) => console.warn("Dentalink create_patient failed:", err));

      const staffMsg = `✅ PAGO CONFIRMADO — EVALUACIÓN\n\n👤 ${patient.nombre}\n📱 ${patient.whatsapp}\n📧 ${patient.email}\n${patient.rut ? `🪪 ${patient.rut}\n` : ""}📋 Motivo: ${MOTIVO_LABELS[patient.motivo] || patient.motivo}\n📍 Zona: ${ZONA_LABELS[patient.zona] || patient.zona}\n🩺 Síntomas: ${(patient.sintomas || []).map((s) => SINTOMA_LABELS[s] || s).join(", ")}\n🤖 IA: ${patient.analisisEstado || "sin análisis"}\n🧾 Orden: ${patient.orderId}`;

      notifyStaff(staffMsg).catch((err) => console.warn("WhatsApp notify failed:", err));

      const code = generateCode(patient.orderId);
      const msg = `✅ ¡Hola ${patient.nombre}! Tu Evaluación Dental Premium en Clínica Miró está confirmada.\n\n📋 Código: ${code}\n\n📅 Próximo paso: agenda tu hora:\n🔗 https://ff.healthatom.io/41knMr\n\nO escríbenos al +56 9 3557 2986\n\n📍 Av. Nueva Providencia 2214, Of 189, Providencia\n⏰ Llega 15 min antes\n\nPotenciado por HUMANA.AI · Clínica Miró`;

      sendWhatsApp(patient.whatsapp, msg).catch((err) =>
        console.warn("WhatsApp confirmation failed:", err),
      );

      sessionStorage.removeItem(PAYMENT_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to parse payment data:", e);
    }
  }, [isSuccess, pendingRaw]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-4 border-b border-border/40">
        <div className="container">
          <a href="/" className="font-serif font-light text-[1.3rem] tracking-[0.04em] text-foreground no-underline">
            Clínica Miró<span className="text-accent">.</span>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container max-w-[560px] text-center">
          {isSuccess ? (
            <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
              <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mx-auto mb-6 text-4xl">
                ✅
              </div>
              <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-tight mb-4">
                ¡Evaluación <span className="text-accent">confirmada</span>!
              </h1>

              {/* Unique code */}
              {codigoUnico && (
                <div className="bg-secondary border border-border rounded-xl p-6 mb-6 inline-block mx-auto">
                  <p className="text-[0.7rem] font-display uppercase tracking-[0.15em] text-mid-gray mb-2">
                    Tu código único
                  </p>
                  <p className="font-display font-[800] text-[2rem] tracking-[0.08em] text-accent leading-none">
                    {codigoUnico}
                  </p>
                  <p className="text-[0.7rem] text-mid-gray mt-2">Preséntalo en tu cita</p>
                </div>
              )}

              <p className="text-mid-gray text-[1rem] leading-relaxed mb-2 max-w-md mx-auto">
                {patientName ? `${patientName}, tu` : "Tu"} pago ha sido procesado exitosamente.
              </p>
              <p className="text-mid-gray text-[0.9rem] leading-relaxed mb-10 max-w-md mx-auto">
                📱 Te enviamos una confirmación por WhatsApp con los detalles y link para agendar.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href="https://ff.healthatom.io/41knMr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-accent text-accent-foreground font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:opacity-90 transition-colors no-underline"
                >
                  📅 Agendar hora online
                </a>
                <a
                  href="https://wa.me/56935572986?text=Hola%2C%20acabo%20de%20pagar%20mi%20evaluación%20y%20quiero%20agendar%20mi%20hora."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-foreground text-foreground font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-foreground hover:text-background transition-colors no-underline"
                >
                  💬 Agendar por WhatsApp
                </a>
              </div>

              {/* Next steps */}
              <div className="text-left bg-secondary p-8 rounded-xl">
                <h3 className="font-display font-bold text-[0.85rem] uppercase tracking-wide text-mid-gray mb-6">
                  Próximos pasos
                </h3>
                <div className="space-y-5">
                  {[
                    { icon: "📅", title: "Agenda tu hora", desc: "Elige el día y horario que más te acomode" },
                    { icon: "🏥", title: "Llega 15 min antes", desc: "Av. Nueva Providencia 2214, Of 189, Providencia" },
                    { icon: "📷", title: "Radiografía panorámica", desc: "Te la tomamos en la clínica, incluida en tu evaluación" },
                    { icon: "🤖", title: "IA analiza tus imágenes", desc: "6 módulos HUMANA.AI procesan tu caso en paralelo" },
                    { icon: "📋", title: "Informe Clarity", desc: "Diagnóstico + opciones + costos, en lenguaje claro" },
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
            </div>
          ) : (
            <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
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
                <a href="/evaluacion" className="px-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors no-underline">
                  Intentar de nuevo
                </a>
                <a
                  href="https://wa.me/56974157966?text=Hola%2C%20tuve%20un%20problema%20con%20el%20pago%20de%20mi%20evaluación."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-foreground text-foreground font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-foreground hover:text-background transition-colors no-underline"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
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

export default Gracias;
