import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import logoFull from "@/assets/logo-full.png";
import logoIcon from "@/assets/logo-icon.png";

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-background/92 backdrop-blur-xl border-b border-border/40"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="no-underline flex items-center">
          {/* Icon on mobile, full logo on desktop */}
          <img src={logoIcon} alt="Clínica Miró" className="h-8 md:hidden" />
          <img src={logoFull} alt="Clínica Miró · Odontología Predictiva" className="hidden md:block h-10" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#routes" className="text-[0.8rem] tracking-[0.12em] uppercase text-muted-foreground no-underline hover:text-foreground transition-colors">
            Rutas
          </a>
          <a href="#humana" className="text-[0.8rem] tracking-[0.12em] uppercase text-muted-foreground no-underline hover:text-foreground transition-colors">
            HUMANA.AI
          </a>
          <a href="#programs" className="text-[0.8rem] tracking-[0.12em] uppercase text-muted-foreground no-underline hover:text-foreground transition-colors">
            Nosotros
          </a>
          <a href="https://wa.me/56974157966" target="_blank" rel="noopener noreferrer" className="text-[0.8rem] tracking-[0.12em] uppercase text-muted-foreground no-underline hover:text-foreground transition-colors">
            Contacto
          </a>
          <a href="/evaluacion?origen=regiones" className="text-[0.8rem] tracking-[0.12em] uppercase text-muted-foreground no-underline hover:text-foreground transition-colors">
            Regiones
          </a>
          <a href="/paciente" className="text-[0.8rem] tracking-[0.12em] uppercase text-muted-foreground no-underline hover:text-foreground transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Mi Portal
          </a>
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" /></svg>
            )}
          </button>
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
          <a href="#routes" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground no-underline">Rutas</a>
          <a href="#humana" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground no-underline">HUMANA.AI</a>
          <a href="#programs" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground no-underline">Nosotros</a>
          <a href="https://wa.me/56974157966" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground no-underline">Contacto</a>
          <a href="/evaluacion?origen=regiones" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground no-underline">Regiones</a>
          <a href="/paciente" onClick={() => setMobileOpen(false)} className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground no-underline flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Mi Portal
          </a>
          <button
            onClick={() => { toggleTheme(); setMobileOpen(false); }}
            className="text-[0.85rem] tracking-[0.1em] uppercase text-muted-foreground flex items-center gap-2"
          >
            {theme === "dark" ? (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>Modo Día</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" /></svg>Modo Noche</>
            )}
          </button>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
