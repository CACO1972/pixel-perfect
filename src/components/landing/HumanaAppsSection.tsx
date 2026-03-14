import { ReactNode, useRef, useEffect } from "react";

import mockupScandent from "@/assets/mockup-scandent.jpg";
import mockupSimetria from "@/assets/mockup-simetria.jpg";
import mockupImplantx from "@/assets/mockup-implantx.jpg";
import mockupZerocaries from "@/assets/mockup-zerocaries.jpg";
import mockupArmonia from "@/assets/mockup-armonia.jpg";
import mockupCopilot from "@/assets/mockup-copilot.jpg";
import mockupSentia from "@/assets/mockup-sentia.jpg";

/* ── App Block ─────────────────────────────────────────── */

interface AppBlockProps {
  number: string;
  category: string;
  name: ReactNode;
  tagline: string;
  description: string;
  cta: string;
  image: string;
  even?: boolean;
  color: string;
}

const AppBlock = ({ number, category, name, tagline, description, cta, image, even, color }: AppBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal border-b border-border/40 last:border-b-0"
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[80vh] ${even ? "md:[direction:rtl]" : ""}`}>
        {/* Image side */}
        <div className="relative overflow-hidden bg-background min-h-[50vh] md:min-h-0">
          <img
            src={image}
            alt={`${typeof name === "string" ? name : "App"} mockup`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {/* Color overlay */}
          <div
            className="absolute inset-0 mix-blend-multiply opacity-30"
            style={{ background: `hsl(${color})` }}
          />
        </div>

        {/* Text side */}
        <div className={`flex items-center ${even ? "md:[direction:ltr]" : ""}`}>
          <div className="p-8 md:p-16 lg:p-20 flex flex-col gap-6 max-w-xl">
            {/* Number + category */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground">
                {number}
              </span>
              <span className="w-8 h-px bg-border" />
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent/70">
                {category}
              </span>
            </div>

            {/* Name */}
            <h3
              className="font-anton text-[clamp(3rem,8vw,6rem)] leading-[0.85] uppercase tracking-[-0.02em] text-foreground"
            >
              {name}
            </h3>

            {/* Tagline */}
            <p className="font-serif italic text-[1.15rem] text-muted-foreground leading-relaxed">
              {tagline}
            </p>

            {/* Description */}
            <p className="text-[0.85rem] text-muted-foreground/80 leading-relaxed max-w-md">
              {description}
            </p>

            {/* CTA */}
            <button className="humana-btn-brutal self-start mt-2">
              {cta}
            </button>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="shimmer-line h-px w-full" />
    </div>
  );
};

/* ── Data ──────────────────────────────────────────────── */

const apps: (Omit<AppBlockProps, "color"> & { color: string })[] = [
  {
    color: "345 60% 35%",
    number: "01 / 07",
    category: "IA · Visión Dental",
    name: (
      <>
        SCAN<br />DENT
      </>
    ),
    tagline: "La IA que observa donde el ojo no llega",
    description:
      "Orientación visual dental en 2 minutos. Detección temprana. Sin reemplazar al profesional, potenciándolo.",
    cta: "ESCANEAR AHORA →",
    image: mockupScandent,
  },
  {
    color: "270 50% 45%",
    number: "02 / 07",
    category: "Simulación · Facial",
    name: (
      <>
        SIME<br />TRÍA
      </>
    ),
    tagline: "Tu sonrisa ideal, antes de tocar nada",
    description:
      "Simulación facial en tiempo real. Índice Miró (IM = M×E×C). El futuro de tu sonrisa visible en segundos.",
    cta: "SIMULAR MI SONRISA →",
    image: mockupSimetria,
    even: true,
  },
  {
    color: "310 45% 38%",
    number: "03 / 07",
    category: "Riesgo · Implantología",
    name: (
      <>
        IM<br />PLANT<br />X
      </>
    ),
    tagline: "Riesgo implantológico con causalidad, no correlación",
    description:
      "SCM — Structural Causal Models. ROC-AUC 0.894. Validado con 4.126 casos. El algoritmo que cambió el estándar.",
    cta: "CALCULAR RIESGO →",
    image: mockupImplantx,
  },
  {
    color: "345 60% 35%",
    number: "04 / 07",
    category: "Prevención · Caries",
    name: (
      <>
        ZERO<br />CARIES
      </>
    ),
    tagline: "Diagnóstico de caries incipientes. Tratamiento regenerativo.",
    description:
      "Sin inyecciones. Sin taladro. IA para detectar caries en etapa inicial y guiar tratamiento regenerativo no invasivo. El fin de la odontología del miedo.",
    cta: "EVALUAR RIESGO →",
    image: mockupZerocaries,
    even: true,
  },
  {
    color: "270 50% 45%",
    number: "05 / 07",
    category: "Estética · Facial",
    name: <>Armonía</>,
    tagline: "Belleza contextual. No universales. No el número áureo.",
    description:
      "SCUT-FBP5500. HuggingFace. FaceXFormer. 5.500 rostros analizados. La belleza como función de edad, cultura y género.",
    cta: "ANALIZAR ARMONÍA →",
    image: mockupArmonia,
  },
  {
    color: "310 45% 38%",
    number: "06 / 07",
    category: "IA · Clínica · Asistente",
    name: (
      <>
        CO<br />PILOT
      </>
    ),
    tagline: "Tu asistente clínico nunca duerme",
    description:
      "IA conversacional para el flujo clínico diario. Desde notas hasta decisiones. El copiloto que todo dentista necesitaba.",
    cta: "ACTIVAR COPILOT →",
    image: mockupCopilot,
    even: true,
  },
  {
    color: "345 60% 35%",
    number: "07 / 07",
    category: "Predicción · Abandono",
    name: <>SENTIA</>,
    tagline: "Predice el abandono antes de que pase",
    description:
      "Machine learning para retención de pacientes. Integración con aseguradoras. El paciente que no vuelve, ya no se pierde. — En desarrollo.",
    cta: "EN DESARROLLO →",
    image: mockupSentia,
  },
];

/* ── Main Section ──────────────────────────────────────── */

const HumanaAppsSection = () => (
  <section id="humana-apps" className="bg-background">
    {/* Header */}
    <div className="py-16 md:py-24 text-center border-b border-border/40">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent mb-3">
        // 7 APLICACIONES · ECOSISTEMA HUMANA.AI
      </p>
      <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-muted-foreground">
        ORIENTACIÓN VISUAL · NO REEMPLAZA EVALUACIÓN PRESENCIAL
      </p>
    </div>

    {/* App blocks */}
    {apps.map((app) => (
      <AppBlock key={app.number} {...app} />
    ))}
  </section>
);

export default HumanaAppsSection;
