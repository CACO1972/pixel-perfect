/**
 * WhatsAppFloat — Botón flotante WhatsApp
 * Detecta si el paciente ya pasó por el wizard (sessionStorage) 
 * para mostrar el número correcto.
 */
import { useState, useEffect } from "react";

const WA_NEW    = "+56974157966";   // Nuevos pacientes
const WA_RETURN = "+56935572986";   // Pacientes en tratamiento

const WhatsAppFloat = () => {
  const [number, setNumber] = useState(WA_NEW);
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    // Si pasó por el wizard o tiene sesión → número de tratamiento
    const hasSeen = sessionStorage.getItem("miro_session_id");
    if (hasSeen) setNumber(WA_RETURN);

    // Show button after 3s scroll delay
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const message = number === WA_NEW
    ? "Hola, me gustaría conocer más sobre la evaluación en Clínica Miró."
    : "Hola, soy paciente de Clínica Miró y tengo una consulta.";

  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexDirection: "row-reverse",
      }}
    >
      {/* Bubble */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        aria-label="Contactar por WhatsApp"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          transition: "transform 0.2s, box-shadow 0.2s",
          flexShrink: 0,
        }}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          background: "#1a1a1a",
          border: "1px solid rgba(201,168,124,0.3)",
          borderRadius: "6px",
          padding: "8px 14px",
          fontSize: "0.78rem",
          color: "#f0ede8",
          whiteSpace: "nowrap",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          letterSpacing: "0.02em",
        }}>
          {number === WA_NEW ? "¿Primera vez? Escríbenos" : "Pacientes en tratamiento"}
        </div>
      )}
    </div>
  );
};

export default WhatsAppFloat;
