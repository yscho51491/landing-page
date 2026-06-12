"use client";

import { useState } from "react";
import Section, { SectionHeader } from "@/components/ui/Section";

const faqs = [
  {
    question: "미술을 전공하지 않아도 사용할 수 있나요?",
    answer:
      "네. 교사대본과 단계별 활동 설명이 함께 제공되어 처음 진행하는 수업도 쉽게 준비할 수 있습니다.",
  },
  {
    question: "유치원 아이들에게도 맞는 자료가 나오나요?",
    answer:
      "네. 대상 연령을 입력하면 해당 연령이 이해할 수 있는 언어와 활동 수준으로 구성됩니다.",
  },
{
    question: "도안이나 활동지도 받을 수 있나요?",
    answer: "네. 수업에 필요한 활동지와 도안을 함께 제공합니다.",
  },
  {
    question: "제가 원하는 내용을 꼭 넣을 수 있나요?",
    answer:
      "네. 필수 반영사항에 원하는 요소를 입력하면 해당 내용을 우선 반영해 수업을 구성합니다.",
  },
  {
    question: "공방 클래스나 키즈 원데이 클래스에도 사용할 수 있나요?",
    answer:
      "네. 학교 수업뿐 아니라 공방, 키즈 클래스, 방과후 수업, 미술학원 특강에도 활용할 수 있습니다.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" alt>
      <SectionHeader emoji="❓" title="자주 묻는 질문" />

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((item, index) => (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-foreground md:text-base">
                Q. {item.question}
              </span>
              <span className="shrink-0 text-emphasis">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="border-t border-border px-5 py-4">
                <p className="text-sm leading-relaxed text-muted md:text-base">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="mailto:official@artteacherlab.com"
          className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          그 외 문의하기
        </a>
      </div>
    </Section>
  );
}
