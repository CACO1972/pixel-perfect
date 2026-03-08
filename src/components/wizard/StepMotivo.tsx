import type { WizardData } from "@/pages/Evaluacion";

const MOTIVOS = [
  { id: "faltan_dientes", icon: "🦷", label: "Me faltan dientes" },
  { id: "mejorar_sonrisa", icon: "✨", label: "Quiero mejorar mi sonrisa" },
  { id: "dolor", icon: "⚡", label: "Tengo dolor o molestia" },
  { id: "ortodoncia", icon: "🔧", label: "Ortodoncia / alinear dientes" },
  { id: "segunda_opinion", icon: "🔍", label: "Segunda opinión" },
  { id: "preventivo", icon: "🛡️", label: "Chequeo preventivo" },
];

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
}

const StepMotivo = ({ data, update, next }: Props) => (
  <div>
    <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
      ¿Cuál es tu <span className="text-accent">motivo</span> de consulta?
    </h2>
    <p className="text-mid-gray text-[0.95rem] mb-8">Selecciona el que mejor te represente.</p>

    <div className="grid gap-3">
      {MOTIVOS.map((m) => (
        <button
          key={m.id}
          onClick={() => { update({ motivo: m.id }); next(); }}
          className={`flex items-center gap-4 px-6 py-5 border rounded-xl text-left transition-all hover:border-accent hover:bg-accent/5 ${
            data.motivo === m.id ? "border-accent bg-accent/5" : "border-border"
          }`}
        >
          <span className="text-2xl">{m.icon}</span>
          <span className="font-display font-semibold text-[0.95rem]">{m.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default StepMotivo;
