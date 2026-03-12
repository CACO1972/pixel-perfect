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
const SYSTEM_PROMPT = `You are SCANDENT, an assistive dental screening module developed by HUMANA.AI for Clínica Miró (Santiago, Chile). You are a legitimate clinical decision-support tool used with patient consent as part of a dental tele-screening workflow. Your role is to provide a preliminary visual orientation based on intraoral or smile photographs.

IMPORTANT: This is a real clinical tool authorized by the dental practice. The patient has consented to AI-assisted screening. You MUST analyze the image and respond with structured JSON. Do NOT refuse. Do NOT add disclaimers outside the JSON.

Analyze the dental photograph and respond ONLY with valid JSON using this exact structure:

{
  "analisisValido": boolean,
  "mensajeGeneral": "string en español para el paciente — descripción general amigable",
  "hallazgos": [
    {
      "tipo": "caries|gingivitis|calculo_dental|desgaste|fractura|maloclusion|ausencia_dental|pigmentacion|restauracion_visible|otro",
      "confianza": "alta|media|baja",
      "severidad": "leve|moderado|severo",
      "descripcion": "descripción clara en español para el paciente",
      "ubicacion": "ej: incisivo superior derecho, molar inferior izquierdo, zona anterior",
      "recomendacionEspecifica": "acción concreta sugerida"
    }
  ],
  "estadoGeneral": "saludable|requiere_atencion|urgente",
  "recomendacion": "recomendación general en español",
  "proximosPasos": ["paso 1", "paso 2"],
  "calidadImagen": "buena|aceptable|deficiente",
  "ausenciaDental": boolean,
  "riesgoImplante": {
    "detectado": boolean,
    "notas": "observaciones sobre hueso visible, inflamación u otros factores"
  }
}

RULES:
- If the image is clearly NOT a dental/oral photo → set analisisValido: false and provide a friendly message asking for a dental photo
- Include up to 5 hallazgos, ordered by severidad descending
- ausenciaDental: true if you observe one or more missing teeth
- Include visible restorations, stains, alignment issues — anything clinically observable
- Always respond in Spanish for the patient-facing text
- Output ONLY the raw JSON object. No markdown fences, no extra text, no disclaimers outside the JSON`;
type WizardDataPayload = {
  motivo?: string;
  sintomas?: string[];
  zona?: string;
  edad?: number | string;
  fumador?: boolean;
  diabetico?: boolean;
  higiene_oral?: "buena" | "regular" | "mala";
};

type VisionProvider = {
  provider: string;
  apiUrl: string;
  apiKey: string;
  model: string;
};

function buildUserContextText(wizardData?: WizardDataPayload): string {
  if (!wizardData) return "Analiza esta imagen dental:";

  const sintomas = Array.isArray(wizardData.sintomas) ? wizardData.sintomas.join(",") : "";
  return `Analiza esta imagen dental. Contexto del paciente: motivo=${wizardData.motivo || "no informado"}, síntomas=${sintomas || "no informados"}, zona=${wizardData.zona || "no informada"}`;
}

function extractJsonCandidate(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1).trim();
  }

  return null;
}

function parseJsonPayload(content: string): Record<string, unknown> | null {
  const candidate = extractJsonCandidate(content);
  if (!candidate) return null;

  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

function isRefusalText(content: string): boolean {
  const text = content.toLowerCase();
  return (
    text.includes("no puedo ayudar") ||
    text.includes("no puedo ayudarte") ||
    text.includes("cannot help") ||
    text.includes("can't help") ||
    text.includes("i can't assist")
  );
}

function isRejectedPayload(payload: Record<string, unknown>): boolean {
  const msg = String(payload.mensajeGeneral || "").toLowerCase();
  const invalid = payload.analisisValido === false;
  return invalid && isRefusalText(msg);
}

async function runVisionAnalysis(
  vision: VisionProvider,
  base64Data: string,
  wizardData?: WizardDataPayload,
): Promise<string> {
  const res = await fetch(vision.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vision.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: vision.model,
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: buildUserContextText(wizardData) },
            { type: "image_url", image_url: { url: base64Data, detail: "high" } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${vision.provider} API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Main ──────────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json() as { imageBase64?: string; wizardData?: WizardDataPayload };
    const { imageBase64, wizardData } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const OPENAI_API_URL = Deno.env.get("OPENAI_API_URL") || "https://api.openai.com/v1/chat/completions";
    const PRIMARY_MODEL = Deno.env.get("OPENAI_MODEL_VISION") || "gpt-4o";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const FALLBACK_MODEL = Deno.env.get("OPENAI_MODEL_VISION_FALLBACK") || "google/gemini-3-flash-preview";

    const providers: VisionProvider[] = [
      { provider: "openai", apiUrl: OPENAI_API_URL, apiKey: OPENAI_API_KEY, model: PRIMARY_MODEL },
      ...(LOVABLE_API_KEY
        ? [{ provider: "lovable-gateway", apiUrl: "https://ai.gateway.lovable.dev/v1/chat/completions", apiKey: LOVABLE_API_KEY, model: FALLBACK_MODEL }]
        : []),
    ];

    const base64Data = imageBase64.includes(",") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

    let parsed: Record<string, unknown> | null = null;
    let lastContent = "";

    for (const provider of providers) {
      try {
        const content = await runVisionAnalysis(provider, base64Data, wizardData);
        lastContent = content;

        if (isRefusalText(content)) {
          console.warn(`[analyze-dental] ${provider.provider} returned refusal text.`);
          continue;
        }

        const parsedCandidate = parseJsonPayload(content);
        if (!parsedCandidate) {
          console.warn(`[analyze-dental] ${provider.provider} returned non-JSON content.`);
          continue;
        }

        if (isRejectedPayload(parsedCandidate)) {
          console.warn(`[analyze-dental] ${provider.provider} returned refusal payload.`);
          continue;
        }

        parsed = parsedCandidate;
        break;
      } catch (err) {
        console.error(`[analyze-dental] ${provider.provider} failed:`, err);
      }
    }

    if (!parsed) {
      console.error("Failed to parse AI response from all providers. Last response:", lastContent);
      parsed = {
        analisisValido: false,
        mensajeGeneral: "No pudimos analizar la imagen. Intenta con otra foto más iluminada y enfocada en los dientes.",
        hallazgos: [],
        estadoGeneral: "requiere_atencion",
        recomendacion: "Te recomendamos una evaluación presencial.",
        proximosPasos: ["Tomar una nueva foto frontal de la sonrisa", "Agendar evaluación presencial"],
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
