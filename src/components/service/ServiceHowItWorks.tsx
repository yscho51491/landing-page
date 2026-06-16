"use client";

import { SERVICE_HOW_IT_WORKS } from "@/data/service-page-content";
import Image from "next/image";
import { useEffect, useState } from "react";

function useDemoPhase(stepCount: number, durationMs: number) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev + 1) % stepCount);
    }, durationMs);
    return () => clearInterval(timer);
  }, [stepCount, durationMs]);

  return phase;
}

function DemoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[280px] w-full items-center justify-center p-4 sm:h-[300px] sm:p-5">
      <div className="flex h-full w-full max-w-[240px] flex-col rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function IdeaGenerateDemo() {
  const phase = useDemoPhase(3, 3200);
  const sections = ["📌 수업 개요", "🎯 학습 목표", "🧰 준비물", "⏳ 수업 과정", "✨ 기대 효과"];

  return (
    <DemoCard>
      {phase === 0 && (
        <div key="input" className="service-demo-fade-in flex h-full flex-col justify-center space-y-3">
          <p className="text-center text-[10px] font-semibold text-emphasis">
            우주 × 로봇
          </p>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg border border-border bg-surface-alt/50 px-2 py-2 text-center text-xs font-semibold text-foreground">
              우주
            </div>
            <div className="flex-1 rounded-lg border border-border bg-surface-alt/50 px-2 py-2 text-center text-xs font-semibold text-foreground">
              로봇
            </div>
          </div>
          <div className="rounded-full bg-primary py-2 text-center text-[11px] font-bold text-primary-foreground">
            수업 아이디어 생성
          </div>
        </div>
      )}

      {phase === 1 && (
        <div key="loading" className="service-demo-fade-in flex h-full flex-col items-center justify-center gap-3">
          <div className="service-demo-spin h-8 w-8 rounded-full border-[3px] border-primary/20 border-t-primary" />
          <p className="text-xs font-medium text-muted">수업 계획서 작성 중…</p>
        </div>
      )}

      {phase === 2 && (
        <div key="result" className="service-demo-fade-in flex h-full flex-col justify-center space-y-1">
          <p className="text-[11px] font-bold text-foreground">우주 로봇 미술 수업</p>
          {sections.map((label, i) => (
            <div
              key={label}
              className="service-demo-slide-in rounded-md bg-surface-alt/70 px-2 py-0.5 text-[10px] text-muted"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </DemoCard>
  );
}

function ArtworkGenerateDemo() {
  const phase = useDemoPhase(3, 3200);

  return (
    <DemoCard>
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-surface-alt/40">
        {phase === 0 && (
          <div
            key="prompt"
            className="service-demo-fade-in absolute inset-0 flex flex-col items-center justify-center gap-2 p-3"
          >
            <p className="text-[11px] font-bold text-foreground">우주 로봇 미술 수업</p>
            <p className="text-[10px] text-muted">완성작 예시 이미지 생성</p>
            <div className="mt-1 w-full rounded-full bg-primary py-2 text-center text-[11px] font-bold text-primary-foreground">
              미리보기 생성
            </div>
          </div>
        )}

        {phase === 1 && (
          <div key="loading" className="service-demo-fade-in absolute inset-0">
            <div className="service-demo-shimmer h-full w-full bg-white/30" />
            <p className="absolute inset-x-0 bottom-3 text-center text-[10px] font-medium text-muted">
              AI가 예시작을 그리는 중…
            </p>
          </div>
        )}

        {phase === 2 && (
          <div key="artwork" className="service-demo-pop absolute inset-0">
            <Image
              src="/images/lab/lab-robot.png"
              alt="로봇 수업 완성작 예시"
              fill
              unoptimized
              sizes="240px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </DemoCard>
  );
}

function WordExportDemo() {
  const phase = useDemoPhase(3, 3200);
  const lines = ["수업 개요", "학습 목표", "준비물", "수업 과정", "기대 효과"];

  return (
    <DemoCard>
      {phase === 0 && (
        <div key="plan" className="service-demo-fade-in flex h-full flex-col justify-center space-y-1">
          <p className="mb-1 text-[11px] font-bold text-foreground">수업 계획서</p>
          {lines.map((line, i) => (
            <div
              key={line}
              className="service-demo-slide-in rounded bg-surface-alt/60 px-2 py-0.5 text-[10px] text-muted"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              ✓ {line}
            </div>
          ))}
        </div>
      )}

      {phase === 1 && (
        <div key="export" className="service-demo-fade-in flex h-full flex-col items-center justify-center gap-2">
          <div className="service-demo-spin h-7 w-7 rounded-full border-[3px] border-primary/20 border-t-primary" />
          <p className="text-[10px] font-medium text-muted">Word 파일로 저장 중…</p>
        </div>
      )}

      {phase === 2 && (
        <div key="doc" className="service-demo-doc-drop flex h-full flex-col items-center justify-center gap-2">
          <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-[#2B579A] text-2xl text-white shadow-md">
            W
          </div>
          <p className="text-center text-[11px] font-bold text-foreground">
            우주_로봇_수업.docx
          </p>
          <p className="rounded-full bg-emphasis/15 px-3 py-1 text-[10px] font-semibold text-emphasis">
            ✓ 저장 완료
          </p>
        </div>
      )}
    </DemoCard>
  );
}

const DEMO_MAP = {
  idea: IdeaGenerateDemo,
  artwork: ArtworkGenerateDemo,
  word: WordExportDemo,
} as const;

export default function ServiceHowItWorks() {
  return (
    <section className="bg-surface px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              아트티쳐랩과 함께라면
              <br />
              수업이 쉬워집니다.
            </h2>
          </div>

          <div className="space-y-24 md:space-y-32">
            {SERVICE_HOW_IT_WORKS.map((item) => {
              const Demo = DEMO_MAP[item.animation];

              return (
                <article
                  key={item.title}
                  className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8"
                >
                  <div
                    className="h-[280px] w-full shrink-0 overflow-hidden rounded-3xl sm:h-[300px] sm:w-[280px] md:w-[300px]"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <Demo />
                  </div>

                  <div className="flex-1 sm:pt-4">
                    <h3 className="text-xl font-bold text-foreground md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                      {item.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
