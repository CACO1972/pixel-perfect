import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, amount, subject, commerceOrder, nombre, telefono, rut, urlReturn } = await req.json();

    if (!email || !amount || !commerceOrder) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const FLOW_API_KEY = Deno.env.get("FLOW_API_KEY")!;
    const FLOW_SECRET_KEY = Deno.env.get("FLOW_SECRET_KEY")!;
    const FLOW_API_URL = Deno.env.get("FLOW_API_URL") || "https://www.flow.cl/api";
    const SITE_URL = Deno.env.get("SITE_URL") || "https://clinicamiro.cl";

    // Build params for Flow.cl
    // urlConfirmation → edge function flow-webhook
    const SUPABASE_FUNC_URL = "https://jipldlklzobiytkvxokf.supabase.co/functions/v1";
    const extra: Record<string, string> = { nombre, telefono };
    if (rut) extra.rut = rut;

    const params: Record<string, string> = {
      apiKey: FLOW_API_KEY,
      commerceOrder,
      subject: subject || "Evaluación Dental Premium - Clínica Miró",
      currency: "CLP",
      amount: String(amount),
      email,
      urlConfirmation: `${SUPABASE_FUNC_URL}/flow-webhook`,
      urlReturn: urlReturn || `${SITE_URL}/gracias`,
      optional: JSON.stringify(extra),
    };

    // Sort params alphabetically and create signature string
    const sortedKeys = Object.keys(params).sort();
    const signString = sortedKeys.map((k) => `${k}${params[k]}`).join("");
    const signature = createHmac("sha256", FLOW_SECRET_KEY).update(signString).digest("hex");
    params.s = signature;

    // POST to Flow.cl
    const formBody = new URLSearchParams(params);
    const flowRes = await fetch(`${FLOW_API_URL}/payment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    });

    const flowData = await flowRes.json();

    if (!flowRes.ok || !flowData.token) {
      console.error("Flow.cl error:", flowData);
      return new Response(JSON.stringify({ error: "Flow payment creation failed", details: flowData }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save evaluation to DB
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY")!;

    await fetch(`${SUPABASE_URL}/rest/v1/evaluaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        codigo: commerceOrder,
        nombre,
        email,
        telefono,
        tipo: "presencial",
        pago_monto: amount,
        pago_id: flowData.token,
        pago_estado: "pendiente",
        estado: "pendiente_pago",
      }),
    }).catch((err) => console.warn("DB insert failed:", err));

    return new Response(
      JSON.stringify({
        url: flowData.url,
        token: flowData.token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("flow-create-payment error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
