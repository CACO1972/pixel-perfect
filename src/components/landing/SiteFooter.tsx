const SiteFooter = () => (
  <footer className="py-12 border-t border-border">
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-serif font-light text-[1.1rem] text-foreground block mb-1">
            Clínica Miró<span className="text-accent">.</span>
          </span>
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent/70">
            Potenciada por HUMANA.AI
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-mid-gray">
            Av. Nueva Providencia 2214, Of. 189 · Providencia
          </span>
          <a href="https://wa.me/56935572986" target="_blank" rel="noopener noreferrer" className="text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
            +56 9 3557 2986
          </a>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-mono text-[0.7rem] text-mid-gray">
          Clínica Miró · 18 años de experiencia · Potenciada por HUMANA.AI
        </span>
        <span className="font-mono text-[0.7rem] text-mid-gray">© 2026 Clínica Miró</span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
