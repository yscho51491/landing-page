import MarketingLayout from "@/components/layout/MarketingLayout";
import ProblemSection from "@/components/sections/ProblemSection";
import ServiceIntroSection from "@/components/sections/ServiceIntroSection";
import DeliverablesSection from "@/components/sections/DeliverablesSection";
import TargetAudienceSection from "@/components/sections/TargetAudienceSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import InputExampleSection from "@/components/sections/InputExampleSection";
import GenerationExampleSection from "@/components/sections/GenerationExampleSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HowToUseSection from "@/components/sections/HowToUseSection";
import TrustSection from "@/components/sections/TrustSection";
import FAQSection from "@/components/sections/FAQSection";
import PreRegisterSection from "@/components/sections/PreRegisterSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export default function ServicePage() {
  return (
    <MarketingLayout>
      <ProblemSection />
      <ServiceIntroSection />
      <DeliverablesSection />
      <HowToUseSection />
      <TrustSection />
      <FAQSection />
      <TargetAudienceSection />
      <ComparisonSection />
      <UseCasesSection />
      <InputExampleSection />
      <GenerationExampleSection />
      <BenefitsSection />
      <PreRegisterSection />
      <FinalCTASection />
    </MarketingLayout>
  );
}
