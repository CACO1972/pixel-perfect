import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepMotivo from "@/components/wizard/StepMotivo";
import StepZona from "@/components/wizard/StepZona";
import StepSintomas from "@/components/wizard/StepSintomas";
import StepFoto from "@/components/wizard/StepFoto";
import StepRuta from "@/components/wizard/StepRuta";
import StepFinanciamiento from "@/components/wizard/StepFinanciamiento";
import StepDatos from "@/components/wizard/StepDatos";
import StepResumen from "@/components/wizard/StepResumen";
import type { DentalAnalysis } from "@/lib/api";

export interface WizardData {
  motivo: string;
  zona: string;
  sintomas: string[];
  fotoBase64: string | null;
  analisis: DentalAnalysis | null;
  programaRecomendado: string;
  nombre: string;
  whatsapp: string;
  email: string;
  rut: string;
}

const INITIAL: WizardData = {
  motivo: "",
  zona: "",
  sintomas: [],
  fotoBase64: null,
  analisis: null,
  programaRecomendado: "",
  nombre: "",
  whatsapp: "",
  email: "",
  rut: "",
};

const STEP_LABELS = ["Motivo", "Zona", "Síntomas", "Foto IA", "Ruta", "Financiamiento", "Tus datos", "Confirmar"];

const Evaluacion = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);
  const navigate = useNavigate();

  const update = (partial: Partial<WizardData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const totalSteps = STEP_LABELS.length;
  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const stepComponents = [
    <StepMotivo key={0} data={data} update={update} next={next} />,
    <StepZona key={1} data={data} update={update} next={next} back={back} />,
    <StepSintomas key={2} data={data} update={update} next={next} back={back} />,
    <StepFoto key={3} data={data} update={update} next={next} back={back} />,
    <StepRuta key={4} data={data} update={update} next={next} back={back} />,
    <StepFinanciamiento key={5} data={data} update={update} next={next} back={back} />,
    <StepDatos key={6} data={data} update={update} next={next} back={back} />,
    <StepResumen key={7} data={data} back={back} />,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center w-8 h-8 border border-border/60 hover:border-accent transition-colors"
              aria-label="Volver"
            >
              <svg className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <a href="/" className="font-serif font-light text-[1.3rem] tracking-[0.04em] text-foreground no-underline">
              Clínica Miró<span className="text-accent">.</span>
            </a>
          </div>
          <span className="text-[0.75rem] tracking-[0.12em] uppercase text-mid-gray font-display">
            Evaluación Premium
          </span>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-[640px]">
          {/* Progress bar */}
          <div className="flex items-center gap-1 mb-2">
            {STEP_LABELS.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
                  i <= step ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mb-10">
            <span className="text-[0.7rem] text-mid-gray font-display tracking-wide uppercase">
              Paso {step + 1} de {totalSteps} — {STEP_LABELS[step]}
            </span>
          </div>

          {/* Step content */}
          <div className="animate-[fadeInUp_0.5s_var(--ease)_both]" key={step}>
            {stepComponents[step]}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Evaluacion;
