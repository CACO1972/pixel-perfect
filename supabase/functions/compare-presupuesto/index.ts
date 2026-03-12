import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storagePath, nombre, whatsapp, email, comentario } = await req.json();

    if (!storagePath) {
      return new Response(
        JSON.stringify({ error: "storagePath is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("second-opinion")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return new Response(
        JSON.stringify({ error: "Could not download file", manual: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Attempt OCR with Google Vision API
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
    let extractedText = "";

    if (googleApiKey) {
      try {
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const visionRes = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${googleApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: [
                {
                  image: { content: base64 },
                  features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
                },
              ],
            }),
          }
        );

        const visionData = await visionRes.json();
        extractedText =
          visionData?.responses?.[0]?.fullTextAnnotation?.text || "";

        console.log("OCR extracted text length:", extractedText.length);
      } catch (ocrErr) {
        console.warn("OCR failed, falling back to manual:", ocrErr);
      }
    }

    // 3. If we got text, try to compare with Dentalink aranceles
    let comparison = null;

    if (extractedText.length > 50) {
      try {
        // Use OpenAI to parse the budget items from OCR text
        const openaiKey = Deno.env.get("OPENAI_API_KEY");
        if (openaiKey) {
          const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openaiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              temperature: 0.1,
              messages: [
                {
                  role: "system",
                  content: `Eres un asistente dental. Extrae los tratamientos y montos de este presupuesto dental chileno.
Responde SOLO un JSON array con objetos: [{"tratamiento": "nombre", "monto": número, "cantidad": número}].
Si no puedes extraer items claros, responde []. No inventes datos.`,
                },
                { role: "user", content: extractedText },
              ],
            }),
          });

          const aiData = await aiRes.json();
          const parsed = aiData?.choices?.[0]?.message?.content || "[]";

          try {
            const items = JSON.parse(parsed.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
            if (Array.isArray(items) && items.length > 0) {
              comparison = {
                items,
                extractedText: extractedText.substring(0, 500),
                status: "parsed",
              };
              console.log("Parsed budget items:", items.length);
            }
          } catch {
            console.warn("Could not parse AI response as JSON");
          }
        }
      } catch (parseErr) {
        console.warn("Budget parsing failed:", parseErr);
      }
    }

    // 4. Notify staff with results (enhanced message if OCR worked)
    const whatsappPhoneId = Deno.env.get("WHATSAPP_PHONE_ID");
    const whatsappToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const staffNumber = Deno.env.get("WHATSAPP_STAFF_NUMBER");

    if (comparison && whatsappPhoneId && whatsappToken && staffNumber) {
      const itemsSummary = comparison.items
        .map((i: { tratamiento: string; monto: number; cantidad: number }) =>
          `• ${i.tratamiento}: $${i.monto?.toLocaleString("es-CL") || "?"} x${i.cantidad || 1}`
        )
        .join("\n");

      const enhancedMsg = `🤖 OCR AUTOMÁTICO - PRESUPUESTO\n\n👤 ${nombre}\n📱 ${whatsapp}\n📧 ${email}\n\n📋 Items detectados:\n${itemsSummary}\n\n💬 ${comentario || "Sin comentario"}\n\n⚠️ Verificar y comparar con aranceles Dentalink antes de enviar al paciente.`;

      try {
        await fetch(
          `https://graph.facebook.com/v21.0/${whatsappPhoneId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: staffNumber,
              type: "text",
              text: { body: enhancedMsg },
            }),
          }
        );
      } catch (waErr) {
        console.warn("Enhanced WhatsApp notify failed:", waErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ocrExtracted: extractedText.length > 50,
        itemsFound: comparison?.items?.length || 0,
        manual: !comparison,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("compare-presupuesto error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", manual: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
