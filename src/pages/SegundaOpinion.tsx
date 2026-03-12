import { useState, useRef } from "react";
import { notifyStaff } from "@/lib/api";
import SegundaOpinionSelector from "@/components/segunda-opinion/SegundaOpinionSelector";
import SegundaOpinionClinica from "@/components/segunda-opinion/SegundaOpinionClinica";
import SegundaOpinionPresupuesto from "@/components/segunda-opinion/SegundaOpinionPresupuesto";
import SegundaOpinionConfirmacion from "@/components/segunda-opinion/SegundaOpinionConfirmacion";

export type SubFlujo = "clinico" | "presupuesto" | null;

const SegundaOpinion = () => {
  const [flujo, setFlujo] = useState<SubFlujo>(null);
  const [enviado, setEnviado] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="container flex items-center justify-between">
          <a href="/" className="font-serif font-light text-[1.3rem] tracking-[0.04em] text-foreground no-underline">
            Clínica Miró<span className="text-accent">.</span>
          </a>
          <span className="text-[0.75rem] tracking-[0.12em] uppercase text-muted-foreground font-display">
            Segunda Opinión
          </span>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container max-w-[640px]">
          {enviado ? (
            <SegundaOpinionConfirmacion flujo={flujo} />
          ) : !flujo ? (
            <SegundaOpinionSelector onSelect={setFlujo} />
          ) : flujo === "clinico" ? (
            <SegundaOpinionClinica onBack={() => setFlujo(null)} onSuccess={() => setEnviado(true)} />
          ) : (
            <SegundaOpinionPresupuesto onBack={() => setFlujo(null)} onSuccess={() => setEnviado(true)} />
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container text-center">
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/60">
            Potenciado por HUMANA.AI · Clínica Miró
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SegundaOpinion;
