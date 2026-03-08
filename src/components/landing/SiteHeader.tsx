import { useState, useEffect } from "react";

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-4 bg-background/92 backdrop-blur-xl border-b border-border/40"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="font-display font-[800] text-[1.1rem] tracking-[0.08em] uppercase text-foreground no-underline">
          Clínica Miró<span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#humana-tour" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            HUMANA.AI
          </a>
          <a href="#programs" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            Programas
          </a>
          <a href="/evaluacion" className="text-[0.75rem] tracking-[0.12em] uppercase px-6 py-2.5 bg-foreground text-background no-underline hover:bg-dark-gray hover:-translate-y-px transition-all">
            Comenzar evaluación →
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-5 h-px bg-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
          <span className={`block w-5 h-px bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 py-6 px-6 flex flex-col gap-4">
          <a href="#humana-tour" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline">HUMANA.AI</a>
          <a href="#programs" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline">Programas</a>
          <a href="/evaluacion" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase px-6 py-3 bg-foreground text-background no-underline text-center">Comenzar evaluación →</a>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
