import { useState } from "react";
import type { WizardData } from "@/pages/Evaluacion";
import { createPayment } from "@/lib/api";

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

const PROGRAMA_LABELS: Record<string, string> = {
  miro_one: "MIRO ONE · Implantes",
  revive: "REVIVE · Rehabilitación",
  align: "ALIGN · Ortodoncia",
  zero_caries: "ZERO CARIES · Prevención",
};

const PAYMENT_STORAGE_KEY = "miro_payment_pending";

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
      const nombre = data.nombre.trim();
      const email = data.email.trim().toLowerCase();
      const telefono = data.whatsapp.trim().replace(/\s+/g, "");

      if (!nombre || !email || !telefono) {
        setError("Completa nombre, WhatsApp y email antes de pagar.");
        setLoading(false);
        return;
      }

      if (/@(test\.com|example\.com)$/i.test(email)) {
        setError("Usa un email real para continuar con el pago.");
        setLoading(false);
        return;
      }

      const orderId = `eval-${Date.now()}`;
      const returnUrl = `${window.location.origin}/gracias`;

      const paymentRes = await createPayment({
        email,
        amount: 49000,
        subject: "Evaluación Dental Premium - Clínica Miró",
        commerceOrder: orderId,
        nombre,
        telefono,
        urlReturn: returnUrl,
      });

      sessionStorage.setItem(
        PAYMENT_STORAGE_KEY,
        JSON.stringify({
          nombre,
          whatsapp: telefono,
          email,
          rut: data.rut?.trim() || "",
          motivo: data.motivo,
          zona: data.zona,
          sintomas: data.sintomas,
          analisisEstado: data.analisis?.estadoGeneral || "sin análisis",
          orderId,
        }),
      );

      const separator = paymentRes.url.includes("?") ? "&" : "?";
      window.location.href = `${paymentRes.url}${separator}token=${encodeURIComponent(paymentRes.token)}`;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("userEmail")) {
        setError("El email ingresado no fue aceptado por el medio de pago. Usa un correo real (ej: Gmail/Outlook).");
      } else {
        setError("Error al procesar el pago. Intenta de nuevo.");
      }
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
        {data.programaRecomendado && (
          <SummaryRow label="Programa" value={PROGRAMA_LABELS[data.programaRecomendado] || data.programaRecomendado} />
        )}
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

      <div className="mt-4 text-center">
        <a
          href="https://wa.me/56974157966?text=Hola%2C%20quiero%20agendar%20mi%20evaluación%20presencial."
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors no-underline"
        >
          ¿Prefieres pagar presencial? <span className="underline">Agenda por WhatsApp →</span>
        </a>
      </div>

      <button onClick={back} className="mt-6 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase block mx-auto">
        ← Volver a editar
      </button>

      {/* HUMANA badge */}
      <p className="text-center font-mono text-[10px] tracking-[0.15em] uppercase text-accent/60 mt-8">
        Potenciado por HUMANA.AI · Clínica Miró
      </p>
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
