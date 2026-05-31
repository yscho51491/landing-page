import Section, { SectionHeader } from "@/components/ui/Section";
import ServiceIntroDemo from "@/components/sections/ServiceIntroDemo";

export default function ServiceIntroSection() {
  return (
    <Section id="service" alt>
      <SectionHeader
        emoji="⚡"
        title="주제만 입력하면, 수업 전체가 완성됩니다."
        subtitle="아트티쳐랩은 미술 수업을 빠르게 기획하고 실행할 수 있도록 돕는 AI 기반 수업자료 생성 서비스입니다."
      />

      <ServiceIntroDemo />
    </Section>
  );
}
