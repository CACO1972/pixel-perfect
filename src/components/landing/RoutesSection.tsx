import { useScrollReveal } from "@/hooks/useScrollReveal";

const routes = [
  { num: "01", title: "Reservar mi evaluación", desc: "Evaluación completa con IA. Diagnóstico claro y plan de tratamiento personalizado." },
  { num: "02", title: "Explorar HUMANA.AI", desc: "Tour interactivo por nuestro ecosistema de inteligencia artificial dental." },
  { num: "03", title: "Segunda opinión", desc: "Compara diagnósticos y presupuestos con evidencia científica objetiva." },
  { num: "04", title: "Soy de regiones o internacional", desc: "Pre-evaluación remota completa antes de viajar a Santiago." },
];

const RoutesSection = () => {
  const headerRef = useScrollReveal();

  return (
    <section className="py-24 md:py-40">
      <div className="container">
        <div ref={headerRef} className="reveal mb-12 md:mb-20">
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent mb-3">Tu camino</p>
          <h2 className="font-display font-[900] text-[clamp(2rem,5vw,4rem)] uppercase tracking-[-0.02em] leading-[0.95]">
            Elige tu<br />ruta.
          </h2>
        </div>

        <div className="border-t border-border">
          {routes.map((route) => (
              <RouteItem key={route.num} route={route} />
          ))}
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent group-hover:w-[3px] transition-all duration-500" />
                <div className="flex items-baseline gap-4 md:gap-10">
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-accent font-semibold min-w-[2rem]">
                    {route.num}
                  </span>
                  <span className="font-bold text-[clamp(1.2rem,2.5vw,2rem)] tracking-[-0.01em] group-hover:text-accent transition-colors">
                    {route.title}
                  </span>
                </div>
                <span className="hidden md:block text-[0.85rem] text-mid-gray max-w-[300px] text-right leading-relaxed">
                  {route.desc}
                </span>
                <svg className="w-5 h-5 text-mid-gray group-hover:text-accent group-hover:translate-x-1 transition-all ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoutesSection;
