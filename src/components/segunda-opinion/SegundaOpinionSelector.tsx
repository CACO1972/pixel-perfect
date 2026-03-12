import type { SubFlujo } from "@/pages/SegundaOpinion";

interface Props {
  onSelect: (flujo: SubFlujo) => void;
}

const SegundaOpinionSelector = ({ onSelect }: Props) => {
  return (
    <div className="animate-[fadeInUp_0.5s_var(--ease)_both]">
      <p className="text-accent font-display font-bold text-[0.75rem] tracking-[0.15em] uppercase mb-4">
        Segunda opinión
      </p>
      <h1 className="font-display font-[800] text-[clamp(1.8rem,5vw,3rem)] leading-[1.15] mb-4">
        Te dijeron que necesitas un tratamiento<br />
        <span className="text-accent">y no estás seguro.</span>
      </h1>
      <p className="text-muted-foreground text-[1.05rem] leading-relaxed mb-4 max-w-lg">
        Es normal. Muchos pacientes llegan con un presupuesto que no entienden, un diagnóstico que les genera dudas, o la sensación de que les están vendiendo algo que no necesitan.
      </p>
      <p className="text-foreground text-[1rem] leading-relaxed mb-10 max-w-lg font-medium">
        En Clínica Miró te damos una evaluación honesta, respaldada por inteligencia artificial, para que tomes la mejor decisión con información clara.
      </p>

      {/* Two paths */}
      <div className="grid gap-4">
        <button
          onClick={() => onSelect("clinico")}
          className="w-full text-left border-2 border-accent bg-accent/5 rounded-xl p-6 hover:bg-accent/10 transition-all relative group"
        >
          <span className="absolute top-3 right-3 text-[0.65rem] font-display font-bold tracking-[0.12em] uppercase bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
            Recomendado
          </span>
          <div className="flex items-start gap-4 mb-3">
            <span className="text-3xl mt-0.5">🔬</span>
            <div>
              <p className="font-display font-bold text-[1.1rem] group-hover:text-accent transition-colors">
                "No confío en el diagnóstico que me dieron"
              </p>
              <p className="text-muted-foreground text-[0.85rem] mt-1">
                Te hacemos una evaluación completa e independiente: radiografía panorámica, análisis con IA y diagnóstico del equipo clínico. Sin compromisos.
              </p>
            </div>
          </div>
          <div className="ml-14 flex flex-wrap gap-2">
            {["Radiografía incluida", "Análisis HUMANA.AI", "Plan con costos claros"].map((tag) => (
              <span key={tag} className="text-[0.7rem] font-display tracking-wide uppercase bg-accent/15 text-accent px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </button>

        <button
          onClick={() => onSelect("presupuesto")}
          className="w-full text-left border border-border rounded-xl p-6 hover:border-accent hover:bg-accent/5 transition-all group"
        >
          <div className="flex items-start gap-4 mb-3">
            <span className="text-3xl mt-0.5">📄</span>
            <div>
              <p className="font-display font-bold text-[1.1rem] group-hover:text-accent transition-colors">
                "Quiero comparar un presupuesto"
              </p>
              <p className="text-muted-foreground text-[0.85rem] mt-1">
                Sube tu presupuesto de otra clínica y te entregamos una comparación de precios aproximada. Respuesta en menos de 24 horas.
              </p>
            </div>
          </div>
          <div className="ml-14 flex flex-wrap gap-2">
            {["Comparativa de precios", "Verificación de tratamientos", "Respuesta 24h"].map((tag) => (
              <span key={tag} className="text-[0.7rem] font-display tracking-wide uppercase bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </button>
      </div>

      {/* Trust element */}
      <div className="mt-10 border-t border-border/40 pt-8">
        <p className="text-muted-foreground text-[0.8rem] leading-relaxed text-center max-w-md mx-auto">
          💬 <em>"Me dijeron que necesitaba 4 implantes. En Miró me explicaron que con 2 era suficiente y me ahorraron más de $3 millones."</em>
        </p>
        <p className="text-center text-[0.7rem] text-muted-foreground/60 mt-2 font-display">
          — Paciente real, 2025
        </p>
      </div>

      <a href="/" className="mt-8 text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors font-display tracking-wide uppercase block text-center no-underline">
        ← Volver al inicio
      </a>
    </div>
  );
};

export default SegundaOpinionSelector;
