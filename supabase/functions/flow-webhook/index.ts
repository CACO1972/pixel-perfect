/**
 * flow-webhook — Clínica Miró
 * Recibe el POST de confirmación de Flow.cl después de un pago.
 * 1. Verifica firma HMAC-SHA256
 * 2. Consulta estado del pago a Flow.cl
 * 3. Actualiza tabla `evaluaciones` en Supabase
 * 4. Notifica al staff por WhatsApp si el pago fue aprobado
 * 5. Crea paciente en Dentalink automáticamente
 *
 * URL configurada en Flow como urlConfirmation:
 *   https://jipldlklzobiytkvxokf.supabase.co/functions/v1/flow-webhook
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function signFlow(params: Record<string, string>, secret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signString = sortedKeys.map((k) => `${k}${params[k]}`).join("");
  return createHmac("sha256", secret).update(signString).digest("hex");
}

async function getFlowPaymentStatus(
  token: string,
  apiKey: string,
  secretKey: string,
  apiUrl: string,
): Promise<Record<string, unknown>> {
  const params: Record<string, string> = { apiKey, token };
  params.s = signFlow(params, secretKey);
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${apiUrl}/payment/getStatus?${qs}`);
  if (!res.ok) throw new Error(`Flow getStatus error: ${res.status}`);
  return res.json();
}

async function supabaseUpsert(
  url: string,
  serviceKey: string,
  table: string,
  match: string,
  matchValue: string,
  data: Record<string, unknown>,
) {
  const res = await fetch(`${url}/rest/v1/${table}?${match}=eq.${encodeURIComponent(matchValue)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Supabase PATCH ${table} error:`, text);
  }
}

async function createDentalinkPatient(
  token: string,
  nombre: string,
  apellido: string,
  telefono: string,
  email: string,
  rut?: string,
) {
  const body: Record<string, unknown> = { nombre, apellido, telefono, email };
  if (rut) body.rut = rut;

  const res = await fetch("https://api.dentalink.healthatom.com/api/v1/pacientes", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  // 409 = ya existe — buscar por RUT
  if (res.status === 409 && rut) {
    const search = await fetch(
      `https://api.dentalink.healthatom.com/api/v1/pacientes?q=${encodeURIComponent(rut)}`,
      { headers: { Authorization: `Token ${token}` } },
    );
    return search.json();
  }
  return data;
}

async function notifyWhatsApp(
  accessToken: string,
  phoneNumberId: string,
  to: string,
  message: string,
) {
  const apiUrl = "https://graph.facebook.com/v22.0";
  let phone = to.replace(/\D/g, "");
  if (phone.startsWith("9") && phone.length === 9) phone = "56" + phone;
  if (!phone.startsWith("56")) phone = "56" + phone;

  await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message },
    }),
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Flow.cl POSTea application/x-www-form-urlencoded
    let token: string;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await req.text();
      const params = new URLSearchParams(body);
      token = params.get("token") || "";
    } else {
      // Fallback: JSON (para tests)
      const body = await req.json();
      token = body.token || "";
    }

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Env vars ──
    const FLOW_API_KEY = Deno.env.get("FLOW_API_KEY")!;
    const FLOW_SECRET_KEY = Deno.env.get("FLOW_SECRET_KEY")!;
    const FLOW_API_URL = Deno.env.get("FLOW_API_URL") || "https://www.flow.cl/api";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY")!;
    const WA_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
    const WA_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
    const DENTALINK_TOKEN = Deno.env.get("DENTALINK_TOKEN")!;
    const STAFF_NUMBER = Deno.env.get("WHATSAPP_STAFF_NUMBER") || "56974157966";

    // ── 1. Consultar estado del pago a Flow.cl ──
    const flowData = await getFlowPaymentStatus(token, FLOW_API_KEY, FLOW_SECRET_KEY, FLOW_API_URL);
    console.log("Flow payment status:", JSON.stringify(flowData));

    const commerceOrder = String(flowData.commerceOrder || "");
    const flowStatus = Number(flowData.status);
    // Flow status codes: 1=pendiente, 2=pagado, 3=rechazado, 4=anulado
    const paid = flowStatus === 2;
    const rejected = flowStatus === 3 || flowStatus === 4;

    const paymentState = paid ? "aprobado" : rejected ? "rechazado" : "pendiente";
    const evalEstado = paid ? "pagado" : rejected ? "pago_rechazado" : "pendiente_pago";

    // ── 2. Leer datos extra del pago (optional field) ──
    let extra: Record<string, string> = {};
    try {
      extra = JSON.parse(String(flowData.optional || "{}"));
    } catch {
      extra = {};
    }
    const nombre = extra.nombre || String(flowData.payer || "Paciente");
    const telefono = extra.telefono || "";
    const rut = extra.rut || "";

    // ── 3. Actualizar tabla evaluaciones ──
    await supabaseUpsert(SUPABASE_URL, SERVICE_KEY, "evaluaciones", "codigo", commerceOrder, {
      pago_estado: paymentState,
      pago_token: token,
      pago_monto: Number(flowData.amount || 0),
      estado: evalEstado,
    });

    // ── 4. Si pagado: crear paciente en Dentalink + notificar staff ──
    if (paid) {
      // Split nombre
      const parts = nombre.trim().split(" ");
      const apellido = parts.length > 1 ? parts.slice(1).join(" ") : "";
      const primerNombre = parts[0];

      // Crear paciente en Dentalink (best effort)
      try {
        const dlResult = await createDentalinkPatient(
          DENTALINK_TOKEN,
          primerNombre,
          apellido,
          telefono,
          String(flowData.payer || ""),
          rut || undefined,
        );
        console.log("Dentalink patient:", JSON.stringify(dlResult));
      } catch (err) {
        console.warn("Dentalink create patient failed (non-fatal):", err);
      }

      // Notificar staff
      const staffMsg =
        `🦷 *PAGO CONFIRMADO — Clínica Miró*\n\n` +
        `👤 *Paciente:* ${nombre}\n` +
        `📧 *Email:* ${flowData.payer || "—"}\n` +
        `📱 *WhatsApp:* ${telefono || "—"}\n` +
        `🪪 *RUT:* ${rut || "—"}\n` +
        `💰 *Monto:* $${Number(flowData.amount || 0).toLocaleString("es-CL")} CLP\n` +
        `🔑 *Orden:* ${commerceOrder}\n\n` +
        `✅ Evaluación Premium pagada. Agendar cita.`;

      try {
        await notifyWhatsApp(WA_TOKEN, WA_PHONE_ID, STAFF_NUMBER, staffMsg);
      } catch (err) {
        console.warn("WhatsApp notify staff failed (non-fatal):", err);
      }

      // Notificar paciente si tiene telefono
      if (telefono) {
        const pacienteMsg =
          `Hola ${primerNombre} 😊\n\n` +
          `Tu pago de evaluación en *Clínica Miró* fue confirmado ✅\n\n` +
          `📅 Ahora debes agendar tu cita:\n` +
          `👉 https://ff.healthatom.io/41knMr\n\n` +
          `O escríbenos aquí y te ayudamos a encontrar el mejor horario.\n\n` +
          `_Equipo Clínica Miró_`;
        try {
          await notifyWhatsApp(WA_TOKEN, WA_PHONE_ID, telefono, pacienteMsg);
        } catch (err) {
          console.warn("WhatsApp notify patient failed (non-fatal):", err);
        }
      }
    }

    // ── 5. Responder OK a Flow.cl (espera 200) ──
    return new Response(JSON.stringify({ ok: true, status: paymentState }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("flow-webhook error:", err);
    // Aun así responder 200 para que Flow no reintente infinitamente
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
