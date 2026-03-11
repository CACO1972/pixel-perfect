import SiteHeader from "@/components/landing/SiteHeader";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import RoutesSection from "@/components/landing/RoutesSection";
import ExplainerSection from "@/components/landing/ExplainerSection";
import HumanaSection from "@/components/landing/HumanaSection";
import QuoteSection from "@/components/landing/QuoteSection";
import ProgramsSection from "@/components/landing/ProgramsSection";
import MapaConfianzaSection from "@/components/landing/MapaConfianzaSection";
import SiteFooter from "@/components/landing/SiteFooter";

const Index = () => {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <PainSection />
      <RoutesSection />
      <ExplainerSection />
      <HumanaSection />
      <QuoteSection />
      <ProgramsSection />
      <MapaConfianzaSection />
      <SiteFooter />
    </>
  );
};

export default Index;
