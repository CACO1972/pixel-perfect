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
        <a href="/" className="font-serif font-light text-[1.3rem] tracking-[0.04em] text-foreground no-underline">
          Clínica Miró<span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/evaluacion" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            Evaluación
          </a>
          <a href="#humana" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            HUMANA.AI
          </a>
          <a href="#programs" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            Nosotros
          </a>
          <a href="https://wa.me/56974157966" target="_blank" rel="noopener noreferrer" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            Contacto
          </a>
          <a href="/paciente" className="text-[0.8rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Mi Portal
          </a>
          <a href="/evaluacion" className="text-[0.75rem] tracking-[0.12em] uppercase px-6 py-2.5 bg-accent text-accent-foreground no-underline hover:opacity-90 hover:-translate-y-px transition-all">
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
          <a href="/evaluacion" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline">Evaluación</a>
          <a href="#humana" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline">HUMANA.AI</a>
          <a href="#programs" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline">Nosotros</a>
          <a href="https://wa.me/56974157966" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline">Contacto</a>
          <a href="/paciente" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-mid-gray no-underline flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Mi Portal
          </a>
          <a href="/evaluacion" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase px-6 py-3 bg-accent text-accent-foreground no-underline text-center">Comenzar evaluación →</a>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
