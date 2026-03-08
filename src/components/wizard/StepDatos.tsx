import { useState } from "react";
import type { WizardData } from "@/pages/Evaluacion";

interface Props {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  next: () => void;
  back: () => void;
}

const StepDatos = ({ data, update, next, back }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (!data.whatsapp.trim()) e.whatsapp = "Ingresa tu WhatsApp";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Email inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) next();
  };

  const inputClass = (field: string) =>
    `w-full px-5 py-4 border rounded-xl font-display text-[0.95rem] outline-none transition-colors bg-background ${
      errors[field] ? "border-destructive" : "border-border focus:border-accent"
    }`;

  return (
    <div>
      <h2 className="font-display font-[800] text-[clamp(1.5rem,4vw,2.5rem)] leading-tight mb-2">
        Tus <span className="text-accent">datos</span> de contacto
      </h2>
      <p className="text-mid-gray text-[0.95rem] mb-8">Para coordinar tu evaluación presencial.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nombre completo *"
            value={data.nombre}
            onChange={(e) => update({ nombre: e.target.value })}
            className={inputClass("nombre")}
            maxLength={100}
          />
          {errors.nombre && <p className="text-destructive text-[0.75rem] mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="WhatsApp +56 9 ... *"
            value={data.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value })}
            className={inputClass("whatsapp")}
            maxLength={20}
          />
          {errors.whatsapp && <p className="text-destructive text-[0.75rem] mt-1">{errors.whatsapp}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="tu@email.com *"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            className={inputClass("email")}
            maxLength={255}
          />
          {errors.email && <p className="text-destructive text-[0.75rem] mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="RUT (opcional)"
            value={data.rut}
            onChange={(e) => update({ rut: e.target.value })}
            className={inputClass("rut")}
            maxLength={12}
          />
          <p className="text-[0.75rem] text-mid-gray mt-1">Formato: 12345678-9</p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={back} className="text-[0.8rem] text-mid-gray hover:text-foreground transition-colors font-display tracking-wide uppercase">
            ← Volver
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-foreground text-background font-display font-bold text-[0.85rem] tracking-[0.05em] uppercase hover:bg-dark-gray transition-colors"
          >
            Continuar →
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepDatos;
