import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import ServiceIntroSection from "@/components/sections/ServiceIntroSection";
import InputExampleSection from "@/components/sections/InputExampleSection";
import DeliverablesSection from "@/components/sections/DeliverablesSection";
import TargetAudienceSection from "@/components/sections/TargetAudienceSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import GenerationExampleSection from "@/components/sections/GenerationExampleSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HowToUseSection from "@/components/sections/HowToUseSection";
import TrustSection from "@/components/sections/TrustSection";
import PreRegisterSection from "@/components/sections/PreRegisterSection";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <ServiceIntroSection />
        <InputExampleSection />
        <DeliverablesSection />
        <TargetAudienceSection />
        <ComparisonSection />
        <UseCasesSection />
        <GenerationExampleSection />
        <BenefitsSection />
        <HowToUseSection />
        <TrustSection />
        <PreRegisterSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
