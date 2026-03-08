import { useState } from "react";
import type { WizardData } from "@/pages/Evaluacion";
import { createPayment, notifyStaff, dentalinkProxy } from "@/lib/api";

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

interface Props {
  data: WizardData;
  back: () => void;
}

const StepResumen = ({ data, back }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create patient in Dentalink
      const [nombre, ...apellidoParts] = data.nombre.trim().split(" ");
      const apellido = apellidoParts.join(" ") || nombre;
      try {
        await dentalinkProxy("create_patient", {
          nombre,
          apellido,
          telefono: data.whatsapp,
          email: data.email,
          ...(data.rut ? { rut: data.rut } : {}),
        });
      } catch (e) {
        console.warn("Dentalink create_patient failed (non-blocking):", e);
      }

      // 2. Notify staff via WhatsApp
      const estadoIA = data.analisis?.estadoGeneral || "sin análisis";
      const staffMsg = `🦷 NUEVA EVALUACIÓN\n\n👤 ${data.nombre}\n📱 ${data.whatsapp}\n📧 ${data.email}\n${data.rut ? `🪪 ${data.rut}\n` : ""}\n📋 Motivo: ${MOTIVO_LABELS[data.motivo] || data.motivo}\n📍 Zona: ${ZONA_LABELS[data.zona] || data.zona}\n🩺 Síntomas: ${data.sintomas.map((s) => SINTOMA_LABELS[s] || s).join(", ")}\n🤖 IA: ${estadoIA}\n\n💳 Redirigido a pagar $49.000`;

      try {
        await notifyStaff(staffMsg);
      } catch (e) {
        console.warn("WhatsApp notify failed (non-blocking):", e);
      }

      // 3. Create payment
      const orderId = `eval-${Date.now()}`;
      const paymentRes = await createPayment({
        email: data.email,
        amount: 49000,
        subject: "Evaluación Dental Premium - Clínica Miró",
        commerceOrder: orderId,
        nombre: data.nombre,
        telefono: data.whatsapp,
      });

      // 4. Redirect to Flow.cl
      window.location.href = `${paymentRes.url}?token=${paymentRes.token}`;
    } catch (err) {
      console.error("Payment error:", err);
      setError("Error al procesar el pago. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Confirma tu <span className="text-accent">evaluación</span>
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-8">Revisa los datos antes de continuar al pago.</p>

      {/* Summary card */}
      <div className="border border-border rounded-xl divide-y divide-border mb-6">
        <SummaryRow label="Motivo" value={MOTIVO_LABELS[data.motivo] || data.motivo} />
        <SummaryRow label="Zona" value={ZONA_LABELS[data.zona] || data.zona} />
        <SummaryRow label="Síntomas" value={data.sintomas.map((s) => SINTOMA_LABELS[s] || s).join(", ")} />
        <SummaryRow label="Análisis IA" value={
          data.analisis
            ? `${data.analisis.estadoGeneral === "saludable" ? "✅" : data.analisis.estadoGeneral === "urgente" ? "🔴" : "⚠️"} ${data.analisis.estadoGeneral} — ${data.analisis.hallazgos.length} hallazgo(s)`
            : "No realizado"
        } />
        <SummaryRow label="Nombre" value={data.nombre} />
        <SummaryRow label="WhatsApp" value={data.whatsapp} />
        <SummaryRow label="Email" value={data.email} />
        {data.rut && <SummaryRow label="RUT" value={data.rut} />}
      </div>

      {/* Price */}
      <div className="flex items-center justify-between p-6 bg-secondary rounded-xl mb-6">
        <div>
          <p className="font-display font-bold text-[1rem]">Evaluación Dental Premium</p>
          <p className="text-mid-gray text-[0.8rem]">Incluye análisis IA + diagnóstico clínico + plan de tratamiento</p>
        </div>
        <span className="font-display font-[800] text-[1.5rem] text-accent">$49.000</span>
      </div>

      {error && <p className="text-destructive text-[0.85rem] mb-4 text-center">{error}</p>}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-4 bg-foreground text-background font-display font-bold text-[0.95rem] tracking-[0.05em] uppercase rounded-xl hover:bg-dark-gray transition-colors disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Pagar $49.000 →"}
      </button>

      <p className="text-center text-[0.75rem] text-mid-gray mt-3">
        🔒 Pago seguro con Flow.cl · Tarjetas de crédito y débito
      </p>

      <button onClick={back} className="mt-6 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase block mx-auto">
        ← Volver a editar
      </button>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between px-5 py-3.5">
    <span className="text-[0.8rem] text-mid-gray font-display uppercase tracking-wide">{label}</span>
    <span className="text-[0.9rem] font-medium text-right max-w-[60%]">{value}</span>
  </div>
);

export default StepResumen;
