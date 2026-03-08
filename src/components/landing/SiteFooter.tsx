const SiteFooter = () => (
  <footer className="py-12 border-t border-border">
    <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
      <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-mid-gray">
        Av. Nueva Providencia 2214, Of. 189 · Providencia · Santiago
      </span>
      <div className="flex gap-8">
        <a href="tel:+56935572986" className="text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
          +56 9 3557 2986
        </a>
        <a href="mailto:contacto@clinicamiro.cl" className="text-[0.7rem] tracking-[0.12em] uppercase text-mid-gray no-underline hover:text-foreground transition-colors">
          Contacto
        </a>
        <span className="font-mono text-[0.7rem] text-mid-gray">© 2026</span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
