/**
 * MapaConfianzaSection — "Chile confía en Clínica Miró"
 * 
 * Estructura:
 * 1. Teaser de números — 18 años / 11.000+ implantes / 16.000+ pacientes
 * 2. Transición editorial
 * 3. Mapa SVG real de Chile + dots interactivos con tooltip de ahorro
 * 4. Beneficio de alojamiento
 * 5. CTA
 * 
 * Posición en Index: después de ProgramsSection, antes de CtaSection
 * Lógica: prueba social geográfica + cierre emocional antes del CTA final
 */
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plane, BedDouble, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Datos de ciudades ─────────────────────────────────────────────────────────
// Coordenadas ajustadas al SVG real de Chile (viewBox 0 0 200 800)
const cities = [
  { id: "antofagasta",  name: "Antofagasta",  region: "Antofagasta",  patients: 312,   saving1: 180000, saving2: 320000, cx: 115, cy: 190 },
  { id: "la-serena",    name: "La Serena",    region: "Coquimbo",     patients: 289,   saving1: 95000,  saving2: 170000, cx: 90,  cy: 300 },
  { id: "valparaiso",   name: "Valparaíso",   region: "Valparaíso",   patients: 446,   saving1: 35000,  saving2: 60000,  cx: 72,  cy: 370 },
  { id: "santiago",     name: "Santiago",     region: "RM",           patients: 12996, saving1: 0,      saving2: 0,      cx: 80,  cy: 390 },
  { id: "rancagua",     name: "Rancagua",     region: "O'Higgins",    patients: 198,   saving1: 20000,  saving2: 35000,  cx: 85,  cy: 415 },
  { id: "talca",        name: "Talca",        region: "Maule",        patients: 267,   saving1: 45000,  saving2: 80000,  cx: 82,  cy: 445 },
  { id: "concepcion",   name: "Concepción",   region: "Biobío",       patients: 534,   saving1: 75000,  saving2: 130000, cx: 75,  cy: 490 },
  { id: "temuco",       name: "Temuco",       region: "Araucanía",    patients: 389,   saving1: 90000,  saving2: 160000, cx: 68,  cy: 530 },
  { id: "puerto-montt", name: "Puerto Montt", region: "Los Lagos",    patients: 278,   saving1: 110000, saving2: 195000, cx: 60,  cy: 590 },
  { id: "punta-arenas", name: "Punta Arenas", region: "Magallanes",   patients: 156,   saving1: 220000, saving2: 390000, cx: 55,  cy: 730 },
];

const fmt = (n: number) => n.toLocaleString("es-CL");

// ── CountUp hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  const triggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4);
            setValue(Math.floor(eased * target));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay);
        obs.unobserve(el);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, delay]);

  return { value, ref };
}

// ── Chile SVG path (simplificado pero reconocible) ────────────────────────────
// Trazado basado en la forma real de Chile continental
const CHILE_PATH = `
  M 118,5
  C 120,20 122,40 120,60
  C 118,80 115,95 112,110
  C 109,125 110,140 112,155
  C 114,170 115,185 113,200
  C 111,215 108,228 105,240
  C 102,252 100,262 98,272
  C 96,280 93,288 90,295
  C 87,302 83,308 80,315
  C 77,322 74,330 71,338
  C 68,346 65,354 63,362
  C 61,370 60,378 59,387
  C 58,396 58,405 59,414
  C 60,423 62,432 63,441
  C 64,450 64,459 63,468
  C 62,477 60,486 59,495
  C 58,504 57,513 56,522
  C 55,531 54,540 53,549
  C 52,558 51,567 50,577
  C 49,587 48,597 47,608
  C 46,619 45,630 44,641
  C 43,652 42,663 42,674
  C 42,685 43,696 44,706
  C 45,716 47,725 49,734
  C 51,743 52,752 52,761
  L 60,770
  C 58,760 56,750 55,740
  C 54,730 54,720 55,710
  C 56,700 58,690 60,680
  C 62,670 65,660 67,650
  C 69,640 70,629 71,618
  C 72,607 72,596 72,585
  C 72,574 72,563 73,552
  C 74,541 75,530 77,520
  C 79,510 81,500 83,490
  C 85,480 87,470 88,460
  C 89,450 90,440 91,430
  C 92,420 93,410 93,400
  C 93,390 92,380 91,370
  C 90,360 88,351 87,342
  C 86,333 85,324 85,315
  C 85,306 86,297 87,288
  C 88,279 90,270 92,261
  C 94,252 97,244 100,236
  C 103,228 106,220 108,212
  C 110,204 112,196 113,188
  C 114,180 115,172 115,164
  C 115,156 114,148 113,140
  C 112,132 111,124 111,116
  C 111,108 112,100 114,92
  C 116,84 118,76 119,68
  C 120,60 120,52 119,44
  C 118,36 116,28 116,20
  Z
`;

// ── CityDot component ─────────────────────────────────────────────────────────
const CityDot = ({ city, activeId, onActivate, onDeactivate, visible }: {
  city: typeof cities[0];
  activeId: string | null;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
  visible: boolean;
}) => {
  const isActive = activeId === city.id;
  const isSantiago = city.id === "santiago";
  const dimmed = activeId !== null && !isActive;
  const r = isSantiago ? 7 : 5;

  return (
    <g
      onMouseEnter={() => onActivate(city.id)}
      onMouseLeave={onDeactivate}
      onClick={() => onActivate(isActive ? "" : city.id)}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={city.name}
    >
      {/* Pulse ring — only on active */}
      {isActive && (
        <circle
          cx={city.cx} cy={city.cy} r={r + 8}
          fill="hsl(34 38% 63% / 0.15)"
          stroke="hsl(34 38% 63% / 0.4)"
          strokeWidth="1"
        />
      )}
      {/* Main dot */}
      <circle
        cx={city.cx} cy={city.cy} r={r}
        fill={isActive ? "hsl(34 38% 63%)" : isSantiago ? "hsl(34 38% 50%)" : "hsl(34 38% 63% / 0.7)"}
        stroke="white"
        strokeWidth={isActive ? 1.5 : 1}
        opacity={dimmed ? 0.25 : visible ? 1 : 0}
        style={{ transition: "opacity 0.4s ease, r 0.2s ease" }}
      />
      {/* Label — always show Santiago, show others on hover */}
      {(isSantiago || isActive) && (
        <text
          x={city.cx + r + 5} y={city.cy + 4}
          fontSize={isSantiago ? "8" : "7"}
          fill={isActive ? "hsl(34 38% 40%)" : "hsl(var(--foreground) / 0.5)"}
          fontFamily="monospace"
          letterSpacing="0.05em"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          {city.name.toUpperCase()}
        </text>
      )}
    </g>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const MapaConfianzaSection = () => {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal();
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // CountUp triggers — staggered delays for wow effect
  const c1 = useCountUp(18,   900,  0);
  const c2 = useCountUp(11000, 1100, 150);
  const c3 = useCountUp(16619, 1300, 300);

  // Map reveal on scroll
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setMapVisible(true); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const activeCityData = cities.find(c => c.id === activeCity);

  return (
    <section className="py-24 md:py-36 bg-background border-t border-border overflow-hidden">
      <style>{`
        @keyframes countGlow {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes mapFadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tooltipSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-revealed { animation: countGlow 0.8s cubic-bezier(.16,1,.3,1) forwards; }
        .map-revealed  { animation: mapFadeIn 0.9s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .tooltip-anim  { animation: tooltipSlide 0.2s cubic-bezier(.16,1,.3,1) forwards; }
      `}</style>

      <div className="container">

        {/* ── 1. TEASER — números que impactan ─────────────────────────────── */}
        <div ref={sectionRef} className="reveal mb-20 md:mb-28">

          {/* Eyebrow */}
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent mb-8">
            Chile confía en Clínica Miró
          </p>

          {/* 3 stats — la secuencia de impacto */}
          <div ref={c1.ref} className="space-y-0">

            {/* Stat 1 — 18 años */}
            <div className="stat-revealed border-b border-border py-8 md:py-10 flex items-baseline gap-6 md:gap-10">
              <span className="font-display font-[900] text-[clamp(4rem,12vw,9rem)] leading-none text-foreground tabular-nums">
                {c1.value}
              </span>
              <div>
                <p className="font-display font-bold text-[clamp(1.2rem,3vw,2rem)] text-foreground">años</p>
                <p className="font-body text-base md:text-lg text-muted-foreground mt-1 max-w-sm">
                  construyendo la clínica de implantes de referencia en Santiago.
                </p>
              </div>
            </div>

            {/* Stat 2 — 11.000+ implantes */}
            <div ref={c2.ref} className="stat-revealed border-b border-border py-8 md:py-10 flex items-baseline gap-6 md:gap-10">
              <span className="font-display font-[900] text-[clamp(4rem,12vw,9rem)] leading-none text-accent tabular-nums">
                {fmt(c2.value)}+
              </span>
              <div>
                <p className="font-display font-bold text-[clamp(1.2rem,3vw,2rem)] text-foreground">implantes</p>
                <p className="font-body text-base md:text-lg text-muted-foreground mt-1 max-w-sm">
                  documentados por el Dr. Carlos Montoya. Cada uno, un protocolo.
                </p>
              </div>
            </div>

            {/* Stat 3 — 16.619 pacientes */}
            <div ref={c3.ref} className="stat-revealed py-8 md:py-10 flex items-baseline gap-6 md:gap-10">
              <span className="font-display font-[900] text-[clamp(4rem,12vw,9rem)] leading-none text-foreground tabular-nums">
                {fmt(c3.value)}
              </span>
              <div>
                <p className="font-display font-bold text-[clamp(1.2rem,3vw,2rem)] text-foreground">pacientes atendidos</p>
                <p className="font-body text-base md:text-lg text-muted-foreground mt-1 max-w-sm">
                  desde Arica hasta Punta Arenas. Este es su mapa.
                </p>
              </div>
            </div>

          </div>

          {/* Línea divisoria editorial */}
          <div className="mt-12 h-[1px] bg-foreground origin-left"
            style={{ animation: mapVisible ? "lineGrow 1s cubic-bezier(.16,1,.3,1) forwards" : "none" }}
          />
        </div>

        {/* ── 2. MAPA — título + mapa + tooltip ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-20">

          {/* Columna izquierda — copy + tooltip */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-[900] text-[clamp(1.8rem,4vw,3rem)] leading-[1.05] uppercase tracking-tight text-foreground">
                Vienen de todo Chile.<br />
                <span className="text-accent">Algunos, desde muy lejos.</span>
              </h2>
              <p className="font-body text-base md:text-lg text-muted-foreground mt-5 leading-relaxed">
                Nuestro sistema de preevaluación a distancia — asistido por IA — permite que tu primer viaje a Santiago sea directamente para tratarte, no para una consulta exploratoria.
              </p>
            </div>

            {/* Tooltip de ciudad activa */}
            {activeCityData ? (
              <div key={activeCityData.id} className="tooltip-anim border border-accent/30 bg-accent/5 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-lg text-foreground">{activeCityData.name}</p>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent">{activeCityData.region}</span>
                </div>
                <p className="font-body text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{fmt(activeCityData.patients)}</span> pacientes atendidos
                </p>
                {activeCityData.saving1 > 0 ? (
                  <div className="space-y-1.5 pt-2 border-t border-border">
                    <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent">Ahorro estimado del viaje de evaluación</p>
                    <div className="flex gap-6">
                      <div>
                        <p className="font-display font-bold text-[1.3rem] text-foreground">${fmt(activeCityData.saving1)}</p>
                        <p className="font-body text-xs text-muted-foreground">viajando solo</p>
                      </div>
                      <div>
                        <p className="font-display font-bold text-[1.3rem] text-foreground">${fmt(activeCityData.saving2)}</p>
                        <p className="font-body text-xs text-muted-foreground">viajando de a dos</p>
                      </div>
                    </div>
                    <p className="font-body text-xs text-muted-foreground italic">
                      Pasajes + alojamiento + traslados que ya no necesitas hacer solo para evaluar.
                    </p>
                  </div>
                ) : (
                  <p className="font-body text-sm text-accent font-medium pt-2 border-t border-border">
                    Sede central — Av. Nueva Providencia 2214, Of. 189
                  </p>
                )}
              </div>
            ) : (
              <div className="border border-border p-6 space-y-2">
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">Toca una ciudad en el mapa</p>
                <p className="font-body text-sm text-muted-foreground">
                  Verás cuántos pacientes de esa región nos eligieron y cuánto ahorrarías al evaluar a distancia.
                </p>
              </div>
            )}

            {/* Beneficio alojamiento */}
            <div className="border-l-2 border-accent/40 pl-5 space-y-4">
              <div className="flex items-start gap-3">
                <BedDouble className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-display font-bold text-sm text-foreground">Tratamientos sobre $1.000.000 CLP</p>
                  <p className="font-body text-sm text-muted-foreground">Incluyen 1 noche en departamento para 2 personas, en el mismo edificio de la clínica.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Plane className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-display font-bold text-sm text-foreground">Tratamientos sobre $2.000.000 CLP</p>
                  <p className="font-body text-sm text-muted-foreground">Incluyen 2 noches. Te operas y en 2 minutos estás reposando.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/evaluacion")}
              className="inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-[0.8rem] tracking-[0.1em] uppercase px-8 py-4 hover:bg-accent hover:text-foreground transition-colors duration-200"
            >
              Iniciar preevaluación a distancia <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Columna derecha — Mapa SVG */}
          <div ref={mapRef} className={mapVisible ? "map-revealed" : "opacity-0"}>
            <div className="relative" style={{ maxWidth: 320, margin: "0 auto" }}>
              <svg
                viewBox="0 0 200 800"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "auto" }}
                aria-label="Mapa de Chile con distribución de pacientes"
              >
                {/* Chile silhouette */}
                <path
                  d={CHILE_PATH}
                  fill="hsl(var(--secondary))"
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                />

                {/* City dots */}
                {cities.map((city) => (
                  <CityDot
                    key={city.id}
                    city={city}
                    activeId={activeCity}
                    onActivate={setActiveCity}
                    onDeactivate={() => {}}
                    visible={mapVisible}
                  />
                ))}

                {/* Label bottom */}
                <text x="20" y="790" fontSize="6" fill="hsl(var(--muted-foreground))" fontFamily="monospace" letterSpacing="0.1em">
                  16.619 HISTORIAS CLÍNICAS · CLÍNICA MIRÓ 2008–2026
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── 3. Disclaimer ────────────────────────────────────────────────── */}
        <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-3xl border-l-2 border-border pl-4">
          * Los ahorros estimados corresponden a un viaje de solo evaluación que ya no necesitas hacer gracias a la preevaluación a distancia con IA. Valores referenciales: pasajes + 1 noche de alojamiento estándar + traslados urbanos, según ciudad de origen. Los beneficios de alojamiento aplican en tratamientos con presupuesto aprobado, máximo 2 personas. La preevaluación a distancia no reemplaza la evaluación clínica presencial final.
        </p>

      </div>
    </section>
  );
};

export default MapaConfianzaSection;
