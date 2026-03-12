import type { WizardData } from "@/pages/Evaluacion";
import type { DentalHallazgo } from "@/lib/api";
import { trackFunnel } from "@/lib/funnel";

const PROGRAMAS = [
  {
    id: "miro_one",
    nombre: "MIRO ONE",
    subtitulo: "Implantes",
    desc: "Solución completa de implantes dentales con planificación digital 3D y guía quirúrgica.",
    incluye: ["Diagnóstico IA completo", "Planificación 3D", "Guía quirúrgica digital", "Seguimiento post-op"],
    motivos: ["faltan_dientes"],
    // Keywords in hallazgos that indicate this program
    hallazgoKeywords: ["ausencia", "falta", "faltan", "edéntulo", "pérdida dental", "diente perdido", "dientes perdidos", "espacio edéntulo", "pieza ausente", "piezas ausentes", "implante"],
  },
  {
    id: "align",
    nombre: "ALIGN",
    subtitulo: "Ortodoncia",
    desc: "Alineación y corrección dental con tecnología de última generación.",
    incluye: ["Análisis cefalométrico IA", "Simulación de resultado", "Plan de tratamiento detallado", "Opciones de aparatos"],
    motivos: ["ortodoncia", "mejorar_sonrisa"],
    hallazgoKeywords: ["apiñamiento", "maloclusión", "mordida", "desalineación", "diastema", "espaciamiento", "chuecos", "torcidos", "rotación", "malposición", "sobremordida", "cruzada", "abierta", "protrusión", "clase ii", "clase iii"],
  },
  {
    id: "estetica",
    nombre: "ESTÉTICA",
    subtitulo: "Diseño de Sonrisa",
    desc: "Restauraciones estéticas para devolver la armonía y naturalidad a tu sonrisa.",
    incluye: ["Análisis facial IA (Armonía)", "Diseño digital de sonrisa", "Mock-up / prueba estética", "Carillas o restauraciones"],
    motivos: ["mejorar_sonrisa"],
    hallazgoKeywords: ["desgaste", "desgastado", "teñido", "manchas", "pigmentación", "oscurecimiento", "fractura", "chip", "caries frontal", "caries anterior", "estética", "carilla", "corona", "resina", "blanqueamiento", "discromía", "fluorosis"],
  },
  {
    id: "zero_caries",
    nombre: "ZERO CARIES",
    subtitulo: "Prevención con IA",
    desc: "Programa preventivo inteligente que detecta caries y riesgos antes de que avancen.",
    incluye: ["Análisis dental IA", "Mapa de riesgo personalizado", "Protocolo preventivo", "Control semestral"],
    motivos: ["preventivo"],
    hallazgoKeywords: ["caries", "cavidad", "desmineralización", "mancha blanca", "lesión cariosa", "sarro", "cálculo", "placa", "gingivitis"],
  },
  {
    id: "revive",
    nombre: "REVIVE",
    subtitulo: "Rehabilitación Oral",
    desc: "Recuperación oral integral para devolverte función y estética con un plan personalizado.",
    incluye: ["Diagnóstico IA completo", "Plan de tratamiento escalonado", "Alternativas A/B/C escritas", "Seguimiento continuo"],
    motivos: ["dolor", "segunda_opinion"],
    hallazgoKeywords: ["inflamación", "periodontal", "movilidad", "absceso", "infección", "dolor", "sensibilidad", "recesión", "bolsa periodontal", "pérdida ósea"],
  },
];

// Score each program based on AI findings
function scoreProgram(programa: typeof PROGRAMAS[0], hallazgos: DentalHallazgo[]): number {
  let score = 0;
  const allText = hallazgos.map(h => 
    `${h.tipo} ${h.descripcion} ${h.ubicacion} ${h.recomendacionEspecifica}`.toLowerCase()
  ).join(" ");

  for (const kw of programa.hallazgoKeywords) {
    if (allText.includes(kw.toLowerCase())) {
      score += 1;
    }
  }
  // Weight by severity
  for (const h of hallazgos) {
    const hText = `${h.tipo} ${h.descripcion} ${h.ubicacion}`.toLowerCase();
    const matches = programa.hallazgoKeywords.some(kw => hText.includes(kw.toLowerCase()));
    if (matches) {
      if (h.severidad === "severo") score += 2;
      else if (h.severidad === "moderado") score += 1;
    }
  }
  return score;
}

function getRecommendedProgram(data: WizardData) {
  const hallazgos = data.analisis?.hallazgos || [];
  
  if (hallazgos.length > 0) {
    // Score all programs based on AI findings
    const scored = PROGRAMAS.map(p => ({ program: p, score: scoreProgram(p, hallazgos) }))
      .sort((a, b) => b.score - a.score);
    
    // If top program has a meaningful score, use it
    if (scored[0].score > 0) {
      return scored[0].program;
    }
  }
  
  // Fallback to motivo-based recommendation
  return PROGRAMAS.find((p) => p.motivos.includes(data.motivo)) || null;
}

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const StepRuta = ({ data, update, next, back }: Props) => {
  // Track: ai_result — usuario llegó a ver el resultado del análisis IA
  useEffect(() => {
    trackFunnel("ai_result", {
      motivo: data.motivo,
      zona:   data.zona,
      metadata: {
        analisisValido: data.analisis?.analisisValido ?? false,
        estadoGeneral:  data.analisis?.estadoGeneral ?? "desconocido",
        programaRecomendado: data.programaRecomendado,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fire once on mount
  const recomendado = getRecommendedProgram(data);
  const otros = PROGRAMAS.filter((p) => p !== recomendado);

  const handleSelect = (id: string) => {
    update({ programaRecomendado: id });
    next();
  };

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Tu ruta <span className="text-accent">recomendada</span>
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-8">
        Según tu motivo de consulta, te sugerimos el programa ideal.
      </p>

      {/* Recommended program */}
      {recomendado && (
        <button
          onClick={() => handleSelect(recomendado.id)}
          className="w-full text-left border-2 border-accent bg-accent/5 rounded-xl p-6 mb-4 hover:bg-accent/10 transition-colors relative"
        >
          <span className="absolute top-3 right-3 text-[0.65rem] font-display font-bold tracking-[0.12em] uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
            Recomendado
          </span>
          <p className="font-display font-[800] text-[1.3rem] tracking-tight">{recomendado.nombre}</p>
          <p className="text-accent text-[0.8rem] font-display font-semibold tracking-wide uppercase mb-2">
            {recomendado.subtitulo}
          </p>
          <p className="text-mid-gray text-[0.85rem] mb-4">{recomendado.desc}</p>
          <ul className="space-y-1.5">
            {recomendado.incluye.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[0.8rem]">
                <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[0.6rem] text-accent">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </button>
      )}

      {/* Other programs */}
      <div className="grid gap-3">
        {otros.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelect(p.id)}
            className="w-full text-left border border-border rounded-xl p-5 hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-display font-bold text-[1rem]">{p.nombre}</p>
              <span className="text-[0.7rem] text-mid-gray font-display uppercase tracking-wide">{p.subtitulo}</span>
            </div>
            <p className="text-mid-gray text-[0.8rem]">{p.desc}</p>
          </button>
        ))}
      </div>

      <button
        onClick={back}
        className="mt-8 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase block mx-auto"
      >
        ← Volver
      </button>
    </div>
  );
};

export default StepRuta;
