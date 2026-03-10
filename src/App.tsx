import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Evaluacion from "./pages/Evaluacion";
import Empezar from "./pages/Empezar";
import SegundaOpinion from "./pages/SegundaOpinion";
import Costos from "./pages/Costos";
import Gracias from "./pages/Gracias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/evaluacion" element={<Evaluacion />} />
          <Route path="/empezar" element={<Empezar />} />
          <Route path="/segunda-opinion" element={<SegundaOpinion />} />
          <Route path="/costos" element={<Costos />} />
          <Route path="/gracias" element={<Gracias />} />
          <Route path="/pago-exitoso" element={<Gracias />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
