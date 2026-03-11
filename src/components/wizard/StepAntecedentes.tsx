import { useState } from "react";
import type { WizardData } from "@/pages/Evaluacion";

const ENFERMEDADES = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hipertension", label: "Hipertensión" },
  { id: "cardiopatia", label: "Cardiopatía" },
  { id: "osteoporosis", label: "Osteoporosis" },
  { id: "hepatitis", label: "Hepatitis" },
  { id: "vih", label: "VIH" },
  { id: "tiroides", label: "Problemas de tiroides" },
  { id: "ninguna", label: "Ninguna de las anteriores" },
];

const HABITOS = [
  { id: "tabaco", label: "Fumo o fumé regularmente" },
  { id: "bruxismo", label: "Aprieto o rechino los dientes" },
  { id: "respirador_bucal", label: "Respiro por la boca" },
  { id: "ninguno", label: "Ninguno" },
];

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
}

const StepAntecedentes = ({ data, update, next }: Props) => {
  const [paso, setPaso] = useState<"enfermedades" | "alergias" | "medicamentos" | "habitos" | "embarazo">("enfermedades");
  const [alergiaTexto, setAlergiaTexto] = useState(data.antecedentes?.alergias || "");
  const [medicamentoTexto, setMedicamentoTexto] = useState(data.antecedentes?.medicamentos || "");

  const enfermedades = data.antecedentes?.enfermedades || [];
  const habitos = data.antecedentes?.habitos || [];

  const toggleEnfermedad = (id: string) => {
    if (id === "ninguna") {
      update({ antecedentes: { ...data.antecedentes, enfermedades: ["ninguna"], alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos, embarazo: data.antecedentes?.embarazo || false } });
      return;
    }
    const current = enfermedades.filter((e) => e !== "ninguna");
    const updated = current.includes(id) ? current.filter((e) => e !== id) : [...current, id];
    update({ antecedentes: { ...data.antecedentes, enfermedades: updated, alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos, embarazo: data.antecedentes?.embarazo || false } });
  };

  const toggleHabito = (id: string) => {
    if (id === "ninguno") {
      update({ antecedentes: { ...data.antecedentes, enfermedades, alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos: ["ninguno"], embarazo: data.antecedentes?.embarazo || false } });
      return;
    }
    const current = habitos.filter((h) => h !== "ninguno");
    const updated = current.includes(id) ? current.filter((h) => h !== id) : [...current, id];
    update({ antecedentes: { ...data.antecedentes, enfermedades, alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos: updated, embarazo: data.antecedentes?.embarazo || false } });
  };

  const saveAndAdvance = () => {
    update({
      antecedentes: {
        enfermedades,
        alergias: alergiaTexto.trim(),
        medicamentos: medicamentoTexto.trim(),
        habitos,
        embarazo: data.antecedentes?.embarazo || false,
      },
    });
    next();
  };

  const inputClass =
    "w-full px-5 py-4 border border-border rounded-xl font-display text-[0.95rem] outline-none transition-colors bg-background focus:border-accent";

  if (paso === "enfermedades") {
    return (
      <div>
        <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
          Antecedentes <span className="text-accent">médicos</span>
        </h2>
        <p className="text-mid-gray text-[0.95rem] mb-8">
          ¿Tienes alguna de estas condiciones? Puedes seleccionar varias.
        </p>

        <div className="grid gap-3">
          {ENFERMEDADES.map((e) => {
            const active = enfermedades.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => toggleEnfermedad(e.id)}
                className={`flex items-center gap-4 px-6 py-4 border rounded-xl text-left transition-all hover:border-accent ${
                  active ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[0.7rem] transition-colors ${
                    active ? "border-accent bg-accent text-accent-foreground" : "border-border"
                  }`}
                >
                  {active && "✓"}
                </span>
                <span className="font-display font-medium text-[0.95rem]">{e.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPaso("alergias")}
          disabled={enfermedades.length === 0}
          className="w-full mt-8 py-4 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase disabled:opacity-30 hover:bg-dark-gray transition-colors"
        >
          Continuar →
        </button>
      </div>
    );
  }

  if (paso === "alergias") {
    return (
      <div>
        <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
          ¿Tienes <span className="text-accent">alergias</span>?
        </h2>
        <p className="text-mid-gray text-[0.95rem] mb-8">
          A medicamentos, anestesia, látex u otros materiales.
        </p>

        <textarea
          value={alergiaTexto}
          onChange={(e) => setAlergiaTexto(e.target.value)}
          placeholder="Ej: Alergia a la penicilina, al látex... o escribe 'No' si no tienes."
          className={`${inputClass} min-h-[120px] resize-none`}
          maxLength={500}
        />

        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setPaso("enfermedades")} className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
            ← Volver
          </button>
          <button
            onClick={() => setPaso("medicamentos")}
            disabled={!alergiaTexto.trim()}
            className="px-8 py-3 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase disabled:opacity-30 hover:bg-dark-gray transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  if (paso === "medicamentos") {
    return (
      <div>
        <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
          ¿Tomas <span className="text-accent">medicamentos</span>?
        </h2>
        <p className="text-mid-gray text-[0.95rem] mb-8">
          Anticoagulantes, antihipertensivos, bifosfonatos u otros.
        </p>

        <textarea
          value={medicamentoTexto}
          onChange={(e) => setMedicamentoTexto(e.target.value)}
          placeholder="Ej: Losartán 50mg, Aspirina... o escribe 'No' si no tomas."
          className={`${inputClass} min-h-[120px] resize-none`}
          maxLength={500}
        />

        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setPaso("alergias")} className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
            ← Volver
          </button>
          <button
            onClick={() => setPaso("habitos")}
            disabled={!medicamentoTexto.trim()}
            className="px-8 py-3 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase disabled:opacity-30 hover:bg-dark-gray transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  if (paso === "habitos") {
    return (
      <div>
        <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
          <span className="text-accent">Hábitos</span> relevantes
        </h2>
        <p className="text-mid-gray text-[0.95rem] mb-8">
          Estos datos nos ayudan a planificar mejor tu tratamiento.
        </p>

        <div className="grid gap-3">
          {HABITOS.map((h) => {
            const active = habitos.includes(h.id);
            return (
              <button
                key={h.id}
                onClick={() => toggleHabito(h.id)}
                className={`flex items-center gap-4 px-6 py-4 border rounded-xl text-left transition-all hover:border-accent ${
                  active ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[0.7rem] transition-colors ${
                    active ? "border-accent bg-accent text-accent-foreground" : "border-border"
                  }`}
                >
                  {active && "✓"}
                </span>
                <span className="font-display font-medium text-[0.95rem]">{h.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setPaso("medicamentos")} className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
            ← Volver
          </button>
          <button
            onClick={() => setPaso("embarazo")}
            disabled={habitos.length === 0}
            className="px-8 py-3 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase disabled:opacity-30 hover:bg-dark-gray transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>
    );
  }

  // Embarazo
  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        ¿Estás <span className="text-accent">embarazada</span>?
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-8">
        O en período de lactancia. Es importante para la planificación del tratamiento.
      </p>

      <div className="grid gap-3">
        <button
          onClick={() => {
            update({ antecedentes: { ...data.antecedentes, enfermedades, alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos, embarazo: true } });
            saveAndAdvance();
          }}
          className="flex items-center gap-4 px-6 py-5 border rounded-xl text-left transition-all hover:border-accent hover:bg-accent/5 border-border"
        >
          <span className="font-display font-semibold text-[0.95rem]">Sí</span>
        </button>
        <button
          onClick={() => {
            update({ antecedentes: { ...data.antecedentes, enfermedades, alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos, embarazo: false } });
            saveAndAdvance();
          }}
          className="flex items-center gap-4 px-6 py-5 border rounded-xl text-left transition-all hover:border-accent hover:bg-accent/5 border-border"
        >
          <span className="font-display font-semibold text-[0.95rem]">No</span>
        </button>
        <button
          onClick={() => {
            update({ antecedentes: { ...data.antecedentes, enfermedades, alergias: alergiaTexto, medicamentos: medicamentoTexto, habitos, embarazo: false } });
            saveAndAdvance();
          }}
          className="flex items-center gap-4 px-6 py-5 border rounded-xl text-left transition-all hover:border-accent hover:bg-accent/5 border-border"
        >
          <span className="font-display font-semibold text-[0.95rem]">No aplica</span>
        </button>
      </div>

      <button onClick={() => setPaso("habitos")} className="mt-6 text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
        ← Volver
      </button>
    </div>
  );
};

export default StepAntecedentes;
