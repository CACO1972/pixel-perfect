import { useEffect, useRef, useState, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Building2, MapPin, Plane, Brain, Users, BedDouble, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── City data (placeholder values for dev) ─────────────────── */
const cities = [
  { id: "antofagasta", name: "Antofagasta", region: "Región de Antofagasta", patients: 312, savingSolo: 180000, savingDuo: 320000, x: 38, y: 12 },
  { id: "la-serena", name: "La Serena", region: "Región de Coquimbo", patients: 289, savingSolo: 95000, savingDuo: 170000, x: 32, y: 22 },
  { id: "valparaiso", name: "Valparaíso", region: "Región de Valparaíso", patients: 446, savingSolo: 35000, savingDuo: 60000, x: 28, y: 32 },
  { id: "santiago", name: "Santiago", region: "Región Metropolitana", patients: 12996, savingSolo: 0, savingDuo: 0, x: 34, y: 34 },
  { id: "rancagua", name: "Rancagua", region: "Región de O'Higgins", patients: 198, savingSolo: 20000, savingDuo: 35000, x: 36, y: 37 },
  { id: "talca", name: "Talca", region: "Región del Maule", patients: 267, savingSolo: 45000, savingDuo: 80000, x: 34, y: 42 },
  { id: "concepcion", name: "Concepción", region: "Región del Biobío", patients: 534, savingSolo: 75000, savingDuo: 130000, x: 30, y: 50 },
  { id: "temuco", name: "Temuco", region: "Región de la Araucanía", patients: 389, savingSolo: 90000, savingDuo: 160000, x: 28, y: 58 },
  { id: "puerto-montt", name: "Puerto Montt", region: "Región de los Lagos", patients: 278, savingSolo: 110000, savingDuo: 195000, x: 24, y: 66 },
  { id: "punta-arenas", name: "Punta Arenas", region: "Región de Magallanes", patients: 156, savingSolo: 220000, savingDuo: 390000, x: 18, y: 88 },
];

const formatCLP = (n: number) => n.toLocaleString("es-CL");

/* ── Animated counter hook ──────────────────────────────────── */
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.floor(eased * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { value, ref };
}

/* ── City dot component ─────────────────────────────────────── */
const CityDot = ({ city, index, activeId, onActivate, onDeactivate }: {
  city: typeof cities[0]; index: number; activeId: string | null;
  onActivate: (id: string) => void; onDeactivate: () => void;
}) => {
  const isActive = activeId === city.id;
  const isSantiago = city.id === "santiago";
  const dimmed = activeId !== null && !isActive;

  return (
    <div
      className="absolute group"
      style={{ left: `${city.x}%`, top: `${city.y}%`, transform: "translate(-50%, -50%)", zIndex: isActive ? 30 : 10 }}
      onMouseEnter={() => onActivate(city.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(city.id)}
      onBlur={onDeactivate}
      tabIndex={0}
      role="button"
      aria-label={`${city.name}: ${city.patients} pacientes estimados`}
    >
      {/* Dot */}
      <div
        className="rounded-full transition-all duration-200 ease-out cursor-pointer motion-reduce:transition-none"
        style={{
          width: isSantiago ? 16 : 10,
          height: isSantiago ? 16 : 10,
          background: isActive ? "hsl(213, 52%, 24%)" : isSantiago ? "hsl(213, 52%, 35%)" : "hsl(213, 52%, 50%)",
          boxShadow: isActive ? "0 0 0 4px hsl(213 52% 24% / 0.2)" : "none",
          transform: isActive ? "scale(1.15)" : "scale(1)",
          opacity: dimmed ? 0.35 : 1,
          animationDelay: `${index * 80}ms`,
        }}
      />

      {/* Tooltip */}
      {isActive && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-background border border-border shadow-lg p-4 text-left motion-reduce:transition-none"
          style={{
            animation: "tooltipIn 220ms cubic-bezier(.16,1,.3,1) forwards",
            zIndex: 50,
          }}
        >
          <p className="font-display font-bold text-sm text-foreground">{city.name} <span className="font-normal text-muted-foreground">· {formatCLP(city.patients)} pacientes estimados</span></p>
          <p className="text-xs text-muted-foreground mt-1">Datos basados en 16.619 historias clínicas auditadas.</p>
          {city.savingSolo > 0 && (
            <>
              <p className="text-xs text-navy mt-2 font-medium">
                Ahorro promedio al evitar un viaje solo para evaluación: aprox. <strong>${formatCLP(city.savingSolo)} CLP</strong> si viajas solo / <strong>${formatCLP(city.savingDuo)} CLP</strong> si viajan 2 personas.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Además, evitas al menos 1 día de permiso en el trabajo.</p>
            </>
          )}
          {city.savingSolo === 0 && (
            <p className="text-xs text-navy mt-2 font-medium">Santiago: sede central de Clínica Miró.</p>
          )}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-background border-r border-b border-border rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
};

/* ── Main section ───────────────────────────────────────────── */
const MapaConfianzaSection = () => {
  const navigate = useNavigate();
  const headerRef = useScrollReveal();
  const [activeCity, setActiveCity] = useState<string | null>(null);

  /* Counters */
  const counter1 = useCountUp(16619, 900);
  const counter2 = useCountUp(12996, 800);
  const counter3 = useCountUp(3623, 700);

  /* Map container reveal */
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapVisible, setMapVisible] = useState(false);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setMapVisible(true); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Benefit section pulse */
  const benefitIconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = benefitIconRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.animation = "benefitPulse 600ms cubic-bezier(.16,1,.3,1) 1";
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-20 md:py-32 border-t border-border bg-background">
      {/* ── ANIMATIONS ────────────────────────────────────────── */}
      <style>{`
        @keyframes tooltipIn { from { opacity:0; transform:translate(-50%,6px) } to { opacity:1; transform:translate(-50%,0) } }
        @keyframes benefitPulse { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
        @keyframes dotIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.7) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
        .map-fade { opacity:0; transform:scale(0.95); transition:opacity 400ms cubic-bezier(.16,1,.3,1), transform 400ms cubic-bezier(.16,1,.3,1) }
        .map-fade.visible { opacity:1; transform:scale(1) }
        .map-fade.visible .city-dot { animation: dotIn 300ms cubic-bezier(.16,1,.3,1) forwards }
        .benefit-card { transition: background 200ms, box-shadow 200ms, transform 200ms }
        .benefit-card:hover { background: hsl(var(--secondary)); box-shadow: 0 4px 16px hsl(var(--foreground)/0.06); transform: translateY(-2px) }
        .benefit-card .underline-anim { position:relative }
        .benefit-card .underline-anim::after { content:''; position:absolute; bottom:-2px; left:0; width:100%; height:1.5px; background:hsl(var(--navy)); transform:scaleX(0); transform-origin:left; transition:transform 300ms cubic-bezier(.16,1,.3,1) }
        .benefit-card:hover .underline-anim::after { transform:scaleX(1) }
        .metric-card { transition: box-shadow 200ms, transform 200ms }
        .metric-card:hover { box-shadow: 0 4px 16px hsl(var(--foreground)/0.06); transform: translateY(-2px) }
        @media (prefers-reduced-motion: reduce) {
          .map-fade, .map-fade.visible .city-dot, .benefit-card, .metric-card { transition:none !important; animation:none !important }
        }
      `}</style>

      <div className="container">
        {/* ── 1. Header ───────────────────────────────────────── */}
        <div ref={headerRef} className="reveal max-w-4xl mb-6 md:mb-10">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-navy mb-3">Mapa de confianza</p>
          <h2 className="font-display font-[900] text-[clamp(1.6rem,4vw,2.8rem)] uppercase tracking-tight leading-[1.05] text-foreground">
            Mapa de confianza y ahorro de viaje
          </h2>
          <p className="font-body text-base md:text-lg text-muted-foreground mt-4 leading-relaxed max-w-3xl">
            Pacientes de todo Chile ya confiaron en Clínica Miró. Este mapa integra 16.619 historias clínicas auditadas con nuestro sistema de preevaluación a distancia asistido por IA, que evita viajes innecesarios y concentra tu desplazamiento cuando realmente vienes a atenderte.
          </p>
          <p className="font-body text-sm text-navy font-medium mt-3">
            Te mostramos desde dónde vienen nuestros pacientes y qué beneficios obtienes al evaluar a distancia y viajar solo para tratarte.
          </p>
        </div>

        {/* ── 2. Two-column: Map + Cards ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* MAP COLUMN */}
          <div className="lg:col-span-3">
            <div
              ref={mapRef}
              className={`map-fade relative bg-secondary/40 border border-border overflow-hidden ${mapVisible ? "visible" : ""}`}
              style={{ aspectRatio: "3/4", maxHeight: 620 }}
            >
              {/* Chile silhouette placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                <svg viewBox="0 0 100 200" className="h-[90%] w-auto" fill="hsl(var(--navy))">
                  <path d="M45 5 Q42 10 40 20 Q38 30 35 38 Q32 45 30 55 Q28 65 26 75 Q24 85 22 95 Q20 110 18 125 Q16 140 15 155 Q14 170 16 180 Q18 190 20 195 L25 195 Q26 185 28 175 Q30 165 32 155 Q34 145 36 135 Q38 125 40 115 Q42 105 44 95 Q46 85 48 75 Q50 65 50 55 Q50 45 48 35 Q47 25 46 15 Z" />
                </svg>
              </div>

              {/* Label */}
              <div className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                Chile · Distribución de pacientes
              </div>

              {/* City dots */}
              {cities.map((city, i) => (
                <CityDot
                  key={city.id}
                  city={city}
                  index={i}
                  activeId={activeCity}
                  onActivate={setActiveCity}
                  onDeactivate={() => setActiveCity(null)}
                />
              ))}

              {/* Santiago marker */}
              <div className="absolute font-mono text-[8px] tracking-[0.15em] uppercase text-navy/60" style={{ left: "40%", top: "35%" }}>
                Santiago ★
              </div>
            </div>

            {/* Map legend */}
            <p className="font-body text-xs text-muted-foreground mt-3 leading-relaxed max-w-lg">
              El ahorro estimado corresponde al viaje que ya no tienes que hacer solo para tu primera evaluación (pasajes, una noche de alojamiento estándar y traslados urbanos).
            </p>
          </div>

          {/* CARDS COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Card 1 — Base validada */}
            <div ref={counter1.ref} className="metric-card border border-border p-6 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-navy" />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-navy">Base validada</span>
              </div>
              <span className="font-display font-[900] text-[clamp(2rem,5vw,3rem)] text-foreground leading-none block mb-2">
                {formatCLP(counter1.value)}
              </span>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Pacientes únicos en base auditada, distribuidos entre Región Metropolitana y regiones de Chile.
              </p>
            </div>

            {/* Card 2 — Preevaluación IA */}
            <div className="metric-card border border-border p-6 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-navy" />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-navy">Preevaluación asistida por IA</span>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Analizamos tus estudios y fotografías a distancia con apoyo de IA clínica. Así, tu primer viaje a Santiago ya es para atenderte o operarte, no para una consulta exploratoria.
              </p>
            </div>

            {/* Card 3 — Ahorro viaje */}
            <div className="metric-card border border-border p-6 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <Plane className="w-4 h-4 text-navy" />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-navy">Ahorro del primer viaje</span>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Muchos pacientes evitan un viaje completo (pasajes + alojamiento + traslados) gracias a la preevaluación a distancia. El ahorro exacto depende de tu ciudad y de si viajas solo o acompañado.
              </p>
            </div>

            {/* Card 4 — Alojamiento */}
            <div className="metric-card border border-border p-6 bg-background">
              <div className="flex items-center gap-2 mb-3">
                <BedDouble className="w-4 h-4 text-navy" />
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-navy">Alojamiento clínico</span>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Para tratamientos mayores, contamos con departamentos para 2 personas en el mismo edificio de la clínica. Te operas y en 2 minutos estás reposando, sin desplazamientos adicionales por la ciudad.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Benefit banner ───────────────────────────────── */}
        <div className="border border-border bg-secondary/30 p-8 md:p-12 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div ref={benefitIconRef} className="shrink-0 w-10 h-10 flex items-center justify-center bg-navy/10 text-navy motion-reduce:!animate-none">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl text-foreground leading-tight">
                Cuando viajas, es para tratarte… y descansar al lado de la clínica
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed max-w-3xl">
                Nuestro sistema de preevaluación a distancia mejorado con IA permite que tu viaje a Santiago se concentre en el tratamiento: cirugía de implantes u otros procedimientos. Si tu plan supera ciertos montos, incluimos 1 o 2 noches de alojamiento en departamentos para 2 personas, ubicados en el mismo edificio donde está la clínica. Terminas tu procedimiento y en pocos minutos ya estás reposando.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="benefit-card border border-border bg-background p-6 cursor-default">
              <h4 className="underline-anim inline-block font-display font-bold text-sm text-foreground mb-2">
                Tratamientos sobre 1 millón de pesos
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                Incluyen 1 noche de alojamiento en departamento para 2 personas.
              </p>
            </div>
            <div className="benefit-card border border-border bg-background p-6 cursor-default">
              <h4 className="underline-anim inline-block font-display font-bold text-sm text-foreground mb-2">
                Tratamientos sobre 2 millones de pesos
              </h4>
              <p className="font-body text-sm text-muted-foreground">
                Incluyen 2 noches de alojamiento en departamento para 2 personas.
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. Disclaimer ───────────────────────────────────── */}
        <div className="border-l-2 border-navy/20 pl-4 md:pl-6 mb-12">
          <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-3xl">
            * Los beneficios de alojamiento aplican únicamente para tratamientos cuyo presupuesto total sea superior a 1.000.000 CLP (1 noche) o superior a 2.000.000 CLP (2 noches), para un máximo de 2 personas. Los valores de ahorro por viaje son referenciales y pueden variar según fecha, ciudad de origen y tipo de transporte utilizado. La preevaluación a distancia no reemplaza la evaluación clínica presencial final, pero permite planificar tu viaje para venir directamente a tratarte.
          </p>
        </div>

        {/* ── 5. CTA ──────────────────────────────────────────── */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-display font-bold text-lg md:text-xl text-foreground mb-2">
            ¿Vives en región y estás evaluando un tratamiento de implantes u otro procedimiento mayor?
          </p>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Completa tu preevaluación a distancia y te ayudamos a planificar tu viaje para que cada día en Santiago cuente.
          </p>
          <button
            onClick={() => navigate("/evaluacion")}
            className="inline-flex items-center gap-2 bg-navy text-white font-display font-bold text-xs tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-navy/40 motion-reduce:transition-none"
          >
            Quiero mi preevaluación a distancia <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MapaConfianzaSection;
