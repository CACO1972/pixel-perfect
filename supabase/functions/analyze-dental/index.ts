import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres un sistema de análisis dental preliminar (SCANDENT by HUMANA.AI). Analiza la foto dental del paciente y responde SOLO con un JSON válido con esta estructura exacta:

{
  "analisisValido": boolean,
  "mensajeGeneral": "string - resumen para el paciente en español",
  "hallazgos": [
    {
      "tipo": "string - ej: caries, gingivitis, calculo_dental, desgaste, fractura, maloclusión, ausencia_dental, pigmentacion",
      "confianza": "string - alta/media/baja",
      "severidad": "string - leve/moderado/severo",
      "descripcion": "string - descripción clara para el paciente",
      "ubicacion": "string - ej: incisivo superior, molar inferior derecho, encías",
      "recomendacionEspecifica": "string"
    }
  ],
  "estadoGeneral": "string - saludable/requiere_atencion/urgente",
  "recomendacion": "string - recomendación general",
  "proximosPasos": ["string - lista de pasos a seguir"],
  "calidadImagen": "string - buena/aceptable/deficiente"
}

IMPORTANTE:
- Si la imagen NO es dental o no se puede analizar, devuelve analisisValido: false
- Sé conservador: si no estás seguro, usa confianza "baja"
- Este es un análisis ORIENTATIVO, no diagnóstico. Menciónalo siempre
- Máximo 5 hallazgos
- Responde SOLO el JSON, sin markdown ni texto adicional`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
    const MODEL = Deno.env.get("OPENAI_MODEL_VISION") || "gpt-4o";

    // Strip data URL prefix if present
    const base64Data = imageBase64.includes(",") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analiza esta imagen dental del paciente:" },
              { type: "image_url", image_url: { url: base64Data, detail: "high" } },
            ],
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      throw new Error(`OpenAI API error: ${openaiRes.status}`);
    }

    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsed = {
        analisisValido: false,
        mensajeGeneral: "No pudimos analizar la imagen correctamente. Intenta con otra foto.",
        hallazgos: [],
        estadoGeneral: "requiere_atencion",
        recomendacion: "Te recomendamos una evaluación presencial.",
        proximosPasos: ["Agendar evaluación presencial"],
        calidadImagen: "deficiente",
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-dental error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
