import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
    const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;
    const API_URL = Deno.env.get("WHATSAPP_API_URL") || "https://graph.facebook.com/v18.0";

    // Staff notification mode
    if (body.notify_staff) {
      const STAFF_NUMBER = Deno.env.get("WHATSAPP_STAFF_NUMBER") || "56974157966";
      const res = await sendWhatsApp(API_URL, PHONE_NUMBER_ID, ACCESS_TOKEN, STAFF_NUMBER, body.staff_message);
      return new Response(JSON.stringify(res), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Direct message mode
    const { to, message } = body;
    if (!to || !message) {
      return new Response(JSON.stringify({ error: "Missing 'to' or 'message'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalize Chilean phone number
    let phone = to.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = phone.slice(1);
    if (phone.startsWith("9") && phone.length === 9) phone = "56" + phone;
    if (!phone.startsWith("56")) phone = "56" + phone;

    const res = await sendWhatsApp(API_URL, PHONE_NUMBER_ID, ACCESS_TOKEN, phone, message);

    return new Response(JSON.stringify(res), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("whatsapp-send error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendWhatsApp(
  apiUrl: string,
  phoneNumberId: string,
  accessToken: string,
  to: string,
  message: string,
) {
  const res = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("WhatsApp API error:", data);
    throw new Error(`WhatsApp API error: ${JSON.stringify(data)}`);
  }
  return data;
}
