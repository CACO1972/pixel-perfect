// ════════════════════════════════════════════════════════════════════════════
// analyze-dental v2 — Motor IA de hallazgos dentales para MIRO.DX
// ════════════════════════════════════════════════════════════════════════════
// Cambios respecto a v1 (decididos por Director Clínico, mayo 2026):
//
// 1. MODO AMPLIO con disclaimer fuerte: la IA puede reportar caries, fracturas,
//    maloclusión, riesgo óseo, etc., PERO cada hallazgo lleva un disclaimer
//    explícito y el lenguaje es de hipótesis ("compatible con", "sugerente de"),
//    nunca afirmativo.
//
// 2. CALIBRACIÓN DE CONFIANZA: la IA debe ser autocrítica. Solo reportar como
//    'alta' lo que es claramente visible y diagnosticable a foto. 'media' para
//    sospechas plausibles. 'baja' para señales débiles (el frontend filtra estas).
//
// 3. ANAMNESIS COMO CONTEXTO: motivo, dolor, última visita, dientes faltantes,
//    zona referida se integran al prompt para guiar la atención visual.
//
// 4. FORMATO ALINEADO A LA CONSOLA: responde con campos `findings[]` con
//    `zone/level/label/desc/confidence` que la consola consume directamente.
//    Mantiene también campos legacy en español por retrocompatibilidad.
// ════════════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

// ── System prompt v2 ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are SCANDENT, the AI dental screening engine of MIRO.DX, a clinical decision-support tool developed by Dr. Carlos Montoya at Clínica Miró (Santiago, Chile). The patient has consented to AI-assisted screening as a SECOND OPINION, not as a definitive diagnosis. A licensed dentist will review every case.

You analyze a single photograph (smile, frontal intraoral, or panoramic-style shot taken by phone). You DO NOT have a radiograph. You MUST be clinically responsible:

1. NEVER make definitive diagnoses. Use hypothesis-grade language ALWAYS in Spanish:
   - "compatible con..." / "sugerente de..." / "se observa lo que parece..."
   - "presencia aparente de..." / "imagen sugerente de..."
   - NEVER: "tiene caries", "presenta fractura", "necesita endodoncia"

2. CALIBRATE CONFIDENCE HONESTLY:
   - "alta": clearly visible to anyone, not just an expert (ej: diente ausente evidente, cálculo masivo, restauración visible grande, tinción severa)
   - "media": probable but not certain from this image alone (ej: mancha que podría ser caries oclusal, encía con apariencia inflamada)
   - "baja": weak signal, would need clinical examination (ej: posible recesión gingival leve, posible desgaste incisal mínimo)

3. EACH FINDING MUST INCLUDE its own short disclaimer in 'limitacion' explaining what would be needed to confirm/discard:
   - "Confirmación requiere radiografía y examen clínico."
   - "Profundidad y vitalidad pulpar no son evaluables desde foto."
   - "La gravedad real solo puede determinarse con sondaje periodontal."

4. USE THE PATIENT'S ANAMNESIS to guide where to look but DO NOT invent findings to match symptoms. If the patient says "dolor en zona X" but you see nothing visible in zone X, you report nothing — the absence of visible signs does NOT discard the symptom, only your image can't show it.

5. RESPOND ONLY WITH VALID JSON in this EXACT structure (no markdown fences, no extra text):

{
  "analisisValido": boolean,
  "calidadImagen": "buena" | "aceptable" | "deficiente",
  "mensajeGeneral": "string en español, 1-2 oraciones amigables resumiendo el hallazgo dominante",
  "findings": [
    {
      "zone": "string corto: 'INCISIVOS SUPERIORES' | 'CANINO SUPERIOR DERECHO' | 'MOLAR INFERIOR IZQUIERDO' | 'ENCÍA GENERAL' | 'ZONA ANTERIOR' | 'ARCADA SUPERIOR' | etc.",
      "level": "alert" | "warn" | "ok",
      "label": "string corto en MAYÚSCULAS, máx 4 palabras: 'COMPATIBLE CON CARIES', 'POSIBLE GINGIVITIS', 'AUSENCIA DENTAL', 'CÁLCULO VISIBLE', etc.",
      "desc": "descripción 2-3 oraciones en español, lenguaje de hipótesis, claro para el paciente",
      "confidence": 0-100,
      "confidenceTier": "alta" | "media" | "baja",
      "limitacion": "qué se necesita para confirmar/descartar este hallazgo desde el punto de vista clínico"
    }
  ],
  "visibleZones": ["array de strings con las zonas que pudiste ver claramente"],
  "summary": "string en español 1-2 oraciones — qué se ve en conjunto",
  "ausenciaDental": boolean,
  "needsRadiograph": true
}

LEVEL MAPPING:
- "alert": hallazgo que requiere atención prioritaria si se confirma (caries aparente avanzada, fractura visible, ausencia con riesgo óseo, inflamación severa aparente)
- "warn": hallazgo que requiere evaluación pero no urgente (cálculo, gingivitis aparente leve, desgaste, manchas)
- "ok": característica observable sin patología aparente (restauración íntegra, alineación dentro de variación normal, dientes presentes y posicionados)

RULES:
- Max 5 findings, ordered by clinical priority (alert > warn > ok)
- If image is clearly NOT dental → analisisValido: false + mensajeGeneral pidiendo otra foto. findings: [].
- If image is dental but you cannot identify any clear finding → analisisValido: true + findings: [] + mensajeGeneral explicando.
- Be honest: it is OK to report 0 findings if there is nothing visible.
- ALWAYS respond in Spanish for patient-facing text.
- Output ONLY the raw JSON. No markdown, no preamble.`;

type AnamnesisConsola = {
  motivo?: string;
  pain?: string;
  last_visit?: string;
  missing?: string;
  area?: string;
};

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

function buildUserContextText(
  answers?: AnamnesisConsola,
  wizardData?: WizardDataPayload,
  patientName?: string,
): string {
  const parts: string[] = ["Analiza esta imagen dental."];
  if (patientName) parts.push(`Paciente: ${patientName}.`);

  if (answers && Object.keys(answers).length > 0) {
    const ctx: string[] = [];
    if (answers.motivo) ctx.push(`motivo de consulta: ${answers.motivo}`);
    if (answers.pain && answers.pain !== "No") ctx.push(`reporta: ${answers.pain.toLowerCase()}`);
    if (answers.area) ctx.push(`zona referida: ${answers.area}`);
    if (answers.last_visit) ctx.push(`última visita odontológica: ${answers.last_visit.toLowerCase()}`);
    if (answers.missing && answers.missing !== "0") ctx.push(`dientes faltantes declarados: ${answers.missing}`);

    if (ctx.length > 0) {
      parts.push(`Contexto clínico declarado por el paciente: ${ctx.join("; ")}.`);
      parts.push(`Usa este contexto SOLO para guiar tu atención visual a las zonas relevantes. NO inventes hallazgos para justificar los síntomas.`);
    }
  }

  if (wizardData) {
    const sintomas = Array.isArray(wizardData.sintomas) ? wizardData.sintomas.join(", ") : "";
    if (wizardData.motivo || sintomas || wizardData.zona) {
      parts.push(`Contexto adicional: motivo=${wizardData.motivo || "n/d"}, síntomas=${sintomas || "n/d"}, zona=${wizardData.zona || "n/d"}.`);
    }
  }

  return parts.join(" ");
}

function extractJsonCandidate(content: string): string | null {
  const trimmed = content.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1).trim();
  return null;
}

function parseJsonPayload(content: string): Record<string, unknown> | null {
  const candidate = extractJsonCandidate(content);
  if (!candidate) return null;
  try { return JSON.parse(candidate); } catch { return null; }
}

function isRefusalText(content: string): boolean {
  const text = content.toLowerCase();
  return (
    text.includes("no puedo ayudar") ||
    text.includes("cannot help") ||
    text.includes("can't help") ||
    text.includes("i can't assist")
  );
}

async function runVisionAnalysis(
  vision: VisionProvider,
  base64Data: string,
  contextText: string,
): Promise<string> {
  const res = await fetch(vision.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vision.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: vision.model,
      temperature: 0.15,
      max_tokens: 2200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: contextText },
            { type: "image_url", image_url: { url: base64Data, detail: "high" } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${vision.provider} HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

type RawFinding = {
  zone?: string;
  level?: string;
  label?: string;
  desc?: string;
  confidence?: number;
  confidenceTier?: string;
  limitacion?: string;
};

function postProcessFindings(raw: RawFinding[]): RawFinding[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((f) => {
      const tier = (f.confidenceTier || "").toLowerCase();
      const conf = typeof f.confidence === "number" ? f.confidence : 50;
      if (tier === "baja" || conf < 40) return false;
      return true;
    })
    .map((f) => {
      const tier = (f.confidenceTier || "").toLowerCase();
      if (tier === "media") {
        return {
          ...f,
          label: f.label?.startsWith("A EVALUAR") ? f.label : `A EVALUAR · ${f.label || "HALLAZGO"}`,
          level: f.level === "alert" ? "warn" : f.level,
        };
      }
      return f;
    })
    .slice(0, 5);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json() as {
      imageBase64?: string;
      answers?: AnamnesisConsola;
      patientName?: string;
      sessionId?: string;
      mode?: string;
      wizardData?: WizardDataPayload;
    };
    const { imageBase64, answers, patientName, wizardData } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing imageBase64" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const OPENAI_API_URL = Deno.env.get("OPENAI_API_URL") || "https://api.openai.com/v1/chat/completions";
    const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL_VISION") || "gpt-4o-mini";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const LOVABLE_MODEL = Deno.env.get("LOVABLE_MODEL_VISION") || "google/gemini-2.5-flash";

    if (!LOVABLE_API_KEY && !OPENAI_API_KEY) {
      throw new Error("No vision provider configured (LOVABLE_API_KEY or OPENAI_API_KEY)");
    }

    // Lovable AI Gateway as primary (more reliable, multimodal), OpenAI as fallback
    const providers: VisionProvider[] = [
      ...(LOVABLE_API_KEY
        ? [{ provider: "lovable-gateway", apiUrl: "https://ai.gateway.lovable.dev/v1/chat/completions", apiKey: LOVABLE_API_KEY, model: LOVABLE_MODEL }]
        : []),
      ...(OPENAI_API_KEY
        ? [{ provider: "openai", apiUrl: OPENAI_API_URL, apiKey: OPENAI_API_KEY, model: OPENAI_MODEL }]
        : []),
    ];

    const base64Data = imageBase64.includes(",") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
    const contextText = buildUserContextText(answers, wizardData, patientName);

    let parsed: Record<string, unknown> | null = null;

    for (const provider of providers) {
      try {
        const content = await runVisionAnalysis(provider, base64Data, contextText);

        if (isRefusalText(content)) {
          console.warn(`[analyze-dental] ${provider.provider} returned refusal text.`);
          continue;
        }

        const candidate = parseJsonPayload(content);
        if (!candidate) {
          console.warn(`[analyze-dental] ${provider.provider} returned non-JSON content.`);
          continue;
        }

        parsed = candidate;
        break;
      } catch (err) {
        console.error(`[analyze-dental] ${provider.provider} failed:`, err);
      }
    }

    if (!parsed) {
      return new Response(JSON.stringify({
        analisisValido: false,
        calidadImagen: "deficiente",
        quality: "deficiente",
        mensajeGeneral: "No pudimos analizar la imagen. Intenta con otra foto más iluminada y enfocada en los dientes.",
        findings: [],
        visibleZones: [],
        visible_zones: [],
        summary: "",
        ausenciaDental: false,
        needsRadiograph: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawFindings = (parsed.findings || parsed.hallazgos || []) as RawFinding[];
    const processedFindings = postProcessFindings(rawFindings);

    // Legacy shape expected by wizard (StepFoto): hallazgos[]
    const sevMap: Record<string, string> = { alert: "severo", warn: "moderado", ok: "leve" };
    const hallazgos = processedFindings.map((f) => ({
      tipo: f.label || "HALLAZGO",
      confianza: f.confidenceTier || (typeof f.confidence === "number" && f.confidence >= 70 ? "alta" : "media"),
      severidad: sevMap[(f.level || "").toLowerCase()] || "moderado",
      descripcion: f.desc || "",
      ubicacion: f.zone || "",
      recomendacionEspecifica: f.limitacion || "",
    }));
    const hasAlert = processedFindings.some((f) => f.level === "alert");
    const hasWarn = processedFindings.some((f) => f.level === "warn");
    const estadoGeneral = hasAlert ? "urgente" : hasWarn ? "requiere_atencion" : "saludable";

    const response = {
      analisisValido: parsed.analisisValido !== false,
      calidadImagen: parsed.calidadImagen || "aceptable",
      quality: parsed.calidadImagen || "aceptable",
      mensajeGeneral: parsed.mensajeGeneral || "",
      summary: parsed.summary || parsed.mensajeGeneral || "",
      findings: processedFindings,
      hallazgos,
      estadoGeneral,
      recomendacion: (parsed.recomendacion as string) || "",
      proximosPasos: (parsed.proximosPasos as string[]) || [],
      visibleZones: parsed.visibleZones || parsed.visible_zones || [],
      visible_zones: parsed.visibleZones || parsed.visible_zones || [],
      ausenciaDental: parsed.ausenciaDental === true,
      needsRadiograph: true,
      sessionId: body.sessionId,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[analyze-dental] fatal error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
