/**
 * analyze-dental — Clínica Miró / HUMANA.AI
 * Analiza foto dental con GPT-4o (visión) y corre ImplantX scoring
 * cuando el análisis detecta ausencia de dientes.
 *
 * POST body: { imageBase64: string, wizardData?: { motivo, sintomas, zona, edad?, fumador?, diabetico? } }
 * Response: DentalAnalysis + implantxScore (optional)
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── ImplantX risk engine (inline port of src/lib/implantx.ts) ─────────────────
type RiskLevel = 1 | 2 | 3 | 4 | 5;

interface ImplantRiskInput {
  edad?: number;
  fumador?: boolean;
  diabetico?: boolean;
  hueso_disponible?: "suficiente" | "limite" | "insuficiente";
  higiene_oral?: "buena" | "regular" | "mala";
  enfermedad_periodontal?: boolean;
  bruxismo?: boolean;
  implantes_previos?: boolean;
  radiacion_cabeza_cuello?: boolean;
  inmunosuprimido?: boolean;
  osteoporosis?: boolean;
}

interface ImplantRiskResult {
  nivel: RiskLevel;
  etiqueta: string;
  score: number;
  factores: string[];
  recomendacion: string;
  viable: boolean;
}

function calcularRiesgoImplantX(input: ImplantRiskInput): ImplantRiskResult {
  let score = 0;
  const factores: string[] = [];

  if (input.fumador) { score += 2; factores.push("Fumador activo"); }
  if (input.diabetico) { score += 2; factores.push("Diabetes"); }
  if (input.hueso_disponible === "limite") { score += 1; factores.push("Hueso límite"); }
  if (input.hueso_disponible === "insuficiente") { score += 3; factores.push("Hueso insuficiente"); }
  if (input.higiene_oral === "regular") { score += 1; factores.push("Higiene regular"); }
  if (input.higiene_oral === "mala") { score += 2; factores.push("Higiene deficiente"); }
  if (input.enfermedad_periodontal) { score += 2; factores.push("Enf. periodontal activa"); }
  if (input.bruxismo) { score += 1; factores.push("Bruxismo"); }
  if (input.radiacion_cabeza_cuello) { score += 3; factores.push("Radiación cabeza/cuello"); }
  if (input.inmunosuprimido) { score += 2; factores.push("Inmunosupresión"); }
  if (input.osteoporosis) { score += 2; factores.push("Osteoporosis"); }
  if (input.edad && input.edad > 75) { score += 1; factores.push("Edad > 75"); }

  // Synergias de riesgo cruzado
  if (input.fumador && input.diabetico) score += 2;
  if (input.enfermedad_periodontal && input.higiene_oral === "mala") score += 1;
  if (input.bruxismo && input.implantes_previos) score += 1;

  let nivel: RiskLevel;
  let etiqueta: string;
  let recomendacion: string;
  let viable = true;

  if (score <= 1) { nivel = 1; etiqueta = "Riesgo muy bajo"; recomendacion = "Candidato ideal para implante. Proceder con planificación estándar."; }
  else if (score <= 3) { nivel = 2; etiqueta = "Riesgo bajo"; recomendacion = "Buen candidato. Optimizar factores modificables antes del procedimiento."; }
  else if (score <= 5) { nivel = 3; etiqueta = "Riesgo moderado"; recomendacion = "Viable con precauciones. Protocolo reforzado y consentimiento informado ampliado."; }
  else if (score <= 8) { nivel = 4; etiqueta = "Riesgo alto"; recomendacion = "Requiere evaluación multidisciplinaria. Tratar condiciones previas antes de implantar."; viable = false; }
  else { nivel = 5; etiqueta = "Riesgo muy alto"; recomendacion = "Contraindicación relativa. Evaluar alternativas protésicas. Consulta con especialista requerida."; viable = false; }

  return { nivel, etiqueta, score, factores, recomendacion, viable };
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres SCANDENT, el motor de análisis dental de HUMANA.AI (Clínica Miró, Santiago, Chile).
Analiza la foto dental y responde SOLO con un JSON válido con esta estructura:

{
  "analisisValido": boolean,
  "mensajeGeneral": "string en español para el paciente",
  "hallazgos": [
    {
      "tipo": "caries|gingivitis|calculo_dental|desgaste|fractura|maloclusión|ausencia_dental|pigmentacion|otro",
      "confianza": "alta|media|baja",
      "severidad": "leve|moderado|severo",
      "descripcion": "descripción clara en español para el paciente",
      "ubicacion": "ej: incisivo superior derecho, molar inferior izquierdo",
      "recomendacionEspecifica": "acción concreta sugerida"
    }
  ],
  "estadoGeneral": "saludable|requiere_atencion|urgente",
  "recomendacion": "recomendación general",
  "proximosPasos": ["paso 1", "paso 2"],
  "calidadImagen": "buena|aceptable|deficiente",
  "ausenciaDental": boolean,
  "riesgoImplante": {
    "detectado": boolean,
    "notas": "observaciones sobre hueso visible, inflamación peri-implantar u otros factores"
  }
}

REGLAS:
- Si la imagen NO es dental → analisisValido: false
- Máximo 5 hallazgos, ordenados por severidad desc
- ausenciaDental: true si ves uno o más dientes ausentes
- riesgoImplante.detectado: true si la zona edéntula tiene signos de riesgo (pérdida ósea visible, inflamación)
- Responde SOLO el JSON, sin markdown ni texto extra`;

// ── Main ──────────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageBase64, wizardData } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
    const MODEL = Deno.env.get("OPENAI_MODEL_VISION") || "gpt-4o";
    const base64Data = imageBase64.includes(",") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    // ── 1. GPT-4o vision analysis ──
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
              {
                type: "text",
                text: wizardData
                  ? `Analiza esta imagen dental. Contexto del paciente: motivo=${wizardData.motivo}, síntomas=${(wizardData.sintomas || []).join(",")}, zona=${wizardData.zona}`
                  : "Analiza esta imagen dental:",
              },
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

    let parsed: Record<string, unknown>;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      parsed = {
        analisisValido: false,
        mensajeGeneral: "No pudimos analizar la imagen. Intenta con otra foto.",
        hallazgos: [],
        estadoGeneral: "requiere_atencion",
        recomendacion: "Te recomendamos una evaluación presencial.",
        proximosPasos: ["Agendar evaluación presencial"],
        calidadImagen: "deficiente",
        ausenciaDental: false,
        riesgoImplante: { detectado: false, notas: "" },
      };
    }

    // ── 2. ImplantX scoring si hay ausencia dental ──
    let implantxScore: ImplantRiskResult | null = null;

    if (parsed.ausenciaDental === true || parsed.estadoGeneral === "urgente") {
      const riesgoNotas = String((parsed.riesgoImplante as Record<string,unknown>)?.notas || "");
      const implantInput: ImplantRiskInput = {
        edad: wizardData?.edad ? Number(wizardData.edad) : undefined,
        fumador: wizardData?.fumador === true,
        diabetico: wizardData?.diabetico === true,
        bruxismo: (wizardData?.sintomas || []).includes("bruxismo"),
        enfermedad_periodontal: (wizardData?.sintomas || []).includes("dolor_encias"),
        higiene_oral: wizardData?.higiene_oral || "regular",
        hueso_disponible: riesgoNotas.toLowerCase().includes("pérdida ósea") ? "limite" : "suficiente",
        radiacion_cabeza_cuello: false,
        inmunosuprimido: false,
        osteoporosis: false,
      };

      implantxScore = calcularRiesgoImplantX(implantInput);
    }

    const response = {
      ...parsed,
      ...(implantxScore ? { implantxScore } : {}),
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-dental error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
