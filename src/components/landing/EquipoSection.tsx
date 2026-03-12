/**
 * EquipoSection — Carrusel del equipo clínico
 * Design: editorial refinado, consonante con design system v3
 * Fotos: reemplazar src por URLs reales cuando estén disponibles
 * Posición en Index: después de QuoteSection, antes de ProgramsSection
 */
import { useRef, useState, useEffect } from "react";

interface Miembro {
  nombre: string;
  titulo: string;
  especialidad: string;
  descripcion: string;
  foto: string;          // ruta o URL — reemplazar con foto real
  tag: string;
}

const EQUIPO: Miembro[] = [
  {
    nombre: "Dr. Carlos Montoya",
    titulo: "Director Médico",
    especialidad: "Implantología Oral",
    descripcion:
      "18 años liderando implantología de alta complejidad. Ex Director del Postgrado en Implantología de Universidad Mayor (2000–2020). Más de 11.000 implantes documentados.",
    foto: "/images/doctor-montoya.svg",
    tag: "Fundador",
  },
  {
    nombre: "Dra. Equipo Miró",
    titulo: "Especialista",
    especialidad: "Ortodoncia & Estética",
    descripcion:
      "Especializada en ortodoncia invisible y rehabilitación estética integral. Combina precisión técnica con un enfoque centrado en el resultado visual.",
    foto: "",
    tag: "Ortodoncia",
  },
  {
    nombre: "Dr. Equipo Miró",
    titulo: "Especialista",
    especialidad: "Endodoncia",
    descripcion:
      "Tratamiento de conductos de alta precisión con microscopio. Resolución de casos complejos con tasas de éxito sobre el promedio nacional.",
    foto: "",
    tag: "Endodoncia",
  },
  {
    nombre: "Dra. Equipo Miró",
    titulo: "Especialista",
    especialidad: "Periodoncia",
    descripcion:
      "Diagnóstico y tratamiento de enfermedad periodontal. Clave en la preparación del lecho óseo para implantes exitosos a largo plazo.",
    foto: "",
    tag: "Periodoncia",
  },
];

// SVG placeholder cuando no hay foto
const PhotoPlaceholder = ({ nombre, tag }: { nombre: string; tag: string }) => (
  <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="400" height="500" fill="#f5f0ea"/>
    <ellipse cx="200" cy="190" rx="90" ry="100" fill="#c9a87c" fillOpacity="0.25"/>
    <rect x="90" y="270" width="220" height="280" rx="12" fill="#c9a87c" fillOpacity="0.12"/>
    <rect x="60" y="280" width="280" height="260" rx="10" fill="white" fillOpacity="0.5"/>
    <text x="200" y="440" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="13" fill="#a89878" letterSpacing="2">
      {tag.toUpperCase()}
    </text>
    <text x="200" y="465" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="11" fill="#c0b8ae" letterSpacing="1">
      FOTO PRÓXIMAMENTE
    </text>
  </svg>
);

export default function EquipoSection() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = EQUIPO.length;

  // Auto-advance cada 5s (pausa en hover)
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total);
    }, 5000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = () => { stopTimer(); setCurrent(c => (c - 1 + total) % total); startTimer(); };
  const next = () => { stopTimer(); setCurrent(c => (c + 1) % total); startTimer(); };

  // Touch/drag support
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - dragStart.current;
    if (delta < -50) next();
    else if (delta > 50) prev();
    setDragging(false);
  };

  const m = EQUIPO[current];

  return (
    <section
      className="py-24 md:py-36 overflow-hidden"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <div className="container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-14 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent">
                Quiénes somos
              </span>
            </div>
            <h2 className="font-serif font-light text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.01em]">
              El equipo detrás<br />
              <em className="not-italic text-accent">de tu diagnóstico.</em>
            </h2>
          </div>

          {/* Nav arrows desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-11 h-11 border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              ←
            </button>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="w-11 h-11 border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
          className="select-none"
        >
          <div className="grid md:grid-cols-[1fr_1fr] gap-0 border border-border">
            {/* Photo panel */}
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[560px] overflow-hidden bg-[#f5f0ea]">
              {m.foto ? (
                <img
                  key={current}
                  src={m.foto}
                  alt={m.nombre}
                  className="w-full h-full object-cover object-center transition-opacity duration-700"
                  style={{ animation: "fadeIn 0.6s ease" }}
                />
              ) : (
                <div className="w-full h-full" style={{ animation: "fadeIn 0.6s ease" }}>
                  <PhotoPlaceholder nombre={m.nombre} tag={m.tag} />
                </div>
              )}

              {/* Tag badge */}
              <div className="absolute top-5 left-5">
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase bg-accent text-white px-3 py-1.5">
                  {m.tag}
                </span>
              </div>

              {/* Dot indicators mobile */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                {EQUIPO.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { stopTimer(); setCurrent(i); startTimer(); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-accent w-4" : "bg-white/50"}`}
                    aria-label={`Ir a ${EQUIPO[i].nombre}`}
                  />
                ))}
              </div>
            </div>

            {/* Info panel */}
            <div
              key={`info-${current}`}
              className="flex flex-col justify-between p-8 md:p-14 border-t md:border-t-0 md:border-l border-border"
              style={{ animation: "slideUp 0.5s ease" }}
            >
              <div>
                {/* Specialty */}
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-6">
                  {m.especialidad}
                </p>

                {/* Name */}
                <h3 className="font-serif font-light text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] tracking-[-0.01em] mb-2">
                  {m.nombre}
                </h3>
                <p className="font-body text-[0.85rem] text-accent tracking-[0.08em] uppercase mb-8">
                  {m.titulo}
                </p>

                {/* Description */}
                <p className="font-body text-[1rem] font-light text-muted-foreground leading-relaxed max-w-[420px]">
                  {m.descripcion}
                </p>
              </div>

              {/* Bottom nav desktop */}
              <div className="hidden md:flex items-center gap-4 pt-10 border-t border-border mt-10">
                {EQUIPO.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { stopTimer(); setCurrent(i); startTimer(); }}
                    className={`h-0.5 transition-all duration-300 ${i === current ? "w-8 bg-accent" : "w-4 bg-border hover:bg-muted-foreground"}`}
                    aria-label={`Ir a ${EQUIPO[i].nombre}`}
                  />
                ))}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  Desliza para ver más
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile nav arrows */}
        <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
          <button onClick={prev} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground" aria-label="Anterior">←</button>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{current + 1} / {total}</span>
          <button onClick={next} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground" aria-label="Siguiente">→</button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}
