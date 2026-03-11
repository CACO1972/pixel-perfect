import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";

// ── Main pages ────────────────────────────────────────────────────────────────
const Index         = lazy(() => import("./pages/Index"));
const Evaluacion    = lazy(() => import("./pages/Evaluacion"));
const Empezar       = lazy(() => import("./pages/Empezar"));
const SegundaOpinion = lazy(() => import("./pages/SegundaOpinion"));
const Costos        = lazy(() => import("./pages/Costos"));
const Gracias       = lazy(() => import("./pages/Gracias"));
const NotFound      = lazy(() => import("./pages/NotFound"));

// ── Portal Paciente ────────────────────────────────────────────────────────────
const PacienteDashboard  = lazy(() => import("./pages/paciente/Dashboard"));
const PacienteMisCitas   = lazy(() => import("./pages/paciente/MisCitas"));
const PacienteAsesor     = lazy(() => import("./pages/paciente/AsesorVirtual"));
const PacientePerfil     = lazy(() => import("./pages/paciente/MiPerfil"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1, refetchOnWindowFocus: false },
  },
});

const Loader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", color: "hsl(var(--accent))", animation: "pulse 1.5s ease-in-out infinite" }}>
      CARGANDO…
    </span>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Landing */}
            <Route path="/"                element={<Index />} />
            <Route path="/evaluacion"      element={<Evaluacion />} />
            <Route path="/empezar"         element={<Empezar />} />
            <Route path="/segunda-opinion" element={<SegundaOpinion />} />
            <Route path="/costos"          element={<Costos />} />
            <Route path="/gracias"         element={<Gracias />} />
            <Route path="/pago-exitoso"    element={<Gracias />} />

            {/* Portal Paciente */}
            <Route path="/paciente"          element={<PacienteDashboard />} />
            <Route path="/paciente/citas"    element={<PacienteMisCitas />} />
            <Route path="/paciente/asesor"   element={<PacienteAsesor />} />
            <Route path="/paciente/perfil"   element={<PacientePerfil />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
