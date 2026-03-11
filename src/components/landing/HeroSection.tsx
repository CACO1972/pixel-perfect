import { useEffect, useRef } from "react";

const stats = [
  { num: "18", label: "Años de experiencia" },
  { num: "11K+", label: "Implantes documentados" },
  { num: "6", label: "Módulos IA activos" },
  { num: "98%", label: "Satisfacción" },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Liquid background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const blobs = [
      { x: 0.3, y: 0.4, r: 250, vx: 0.0003, vy: 0.0002, color: "201, 168, 108" }, // gold
      { x: 0.7, y: 0.6, r: 200, vx: -0.0002, vy: 0.0003, color: "201, 168, 108" },
      { x: 0.5, y: 0.3, r: 300, vx: 0.0001, vy: -0.0002, color: "40, 60, 90" }, // navy
      { x: 0.2, y: 0.7, r: 180, vx: 0.0002, vy: -0.0001, color: "201, 168, 108" },
    ];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const animate = () => {
      t += 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      blobs.forEach((b) => {
        b.x += Math.sin(t * b.vx * 10) * 0.001;
        b.y += Math.cos(t * b.vy * 10) * 0.001;

        const gradient = ctx.createRadialGradient(
          b.x * w, b.y * h, 0,
          b.x * w, b.y * h, b.r
        );
        gradient.addColorStop(0, `rgba(${b.color}, 0.12)`);
        gradient.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x * w, b.y * h, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="reveal min-h-screen flex flex-col justify-center pt-24 relative overflow-hidden">
      {/* Liquid canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ filter: "blur(80px)" }}
      />

      {/* Video background */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-[0.06] grayscale-[0.5]"
        >
          <source src="/videos/teaser.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container relative z-[2]">
        {/* HUMANA.AI badge */}
        <div className="inline-flex items-center gap-2 mb-8 md:mb-12">
          <span className="w-1.5 h-1.5 bg-accent rounded-full pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent">
            Potenciado por HUMANA.AI · 6 módulos activos
          </span>
        </div>

        {/* Stacked Title */}
        <div className="relative mb-6 md:mb-10">
          {/* Background stacked layers */}
          <h1
            aria-hidden="true"
            className="absolute top-0 left-0 font-serif font-light text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] tracking-[-0.01em] text-foreground/[0.04] translate-x-[3px] translate-y-[3px]"
          >
            Tres dentistas,<br />tres diagnósticos.
          </h1>
          <h1
            aria-hidden="true"
            className="absolute top-0 left-0 font-serif font-light text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] tracking-[-0.01em] text-accent/[0.08] -translate-x-[2px] -translate-y-[2px]"
          >
            Tres dentistas,<br />tres diagnósticos.
          </h1>
          {/* Main title */}
          <h1 className="relative font-serif font-light text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] tracking-[-0.01em]">
            Tres dentistas,<br />
            tres <em className="not-italic text-accent">diagnósticos.</em>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-body text-[clamp(1rem,2vw,1.25rem)] font-light text-muted-foreground max-w-[620px] leading-relaxed mb-8 md:mb-12">
          Si entiendes lo que tienes, confías. Aquí el diagnóstico se explica, se escribe y se documenta. Tú decides.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 mb-16 md:mb-20">
          <a
            href="/evaluacion"
            className="inline-block px-8 py-4 bg-accent text-accent-foreground font-display font-bold text-[0.9rem] tracking-[0.06em] uppercase no-underline hover:opacity-90 transition-opacity"
          >
            Evaluar mi caso →
          </a>
          <a
            href="https://ff.healthatom.io/41knMr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border border-border text-foreground font-display font-bold text-[0.9rem] tracking-[0.06em] uppercase no-underline hover:border-accent hover:text-accent transition-colors"
          >
            Agendar hora directa
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 md:gap-16 mt-4 pt-8 border-t border-border">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-[800] text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.02em] leading-none">
                {s.num}
              </div>
              <div className="text-[0.7rem] tracking-[0.15em] uppercase text-muted-foreground mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked bg text (desktop) */}
      <div className="hidden lg:block absolute right-[-2vw] top-1/2 -translate-y-1/2 z-[1] pointer-events-none">
        {["HUMANA", "HUMANA", "HUMANA", "HUMANA"].map((text, i) => (
          <span
            key={i}
            className="block font-display font-[900] text-[clamp(3rem,10vw,9rem)] uppercase leading-[0.85] tracking-[-0.03em] whitespace-nowrap"
            style={{ opacity: 0.04 - i * 0.01 }}
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
