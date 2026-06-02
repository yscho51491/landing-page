"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect } from "react";

const TALLY_EMBED_SRC =
  "https://tally.so/embed/Gx5b6Q?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
const TALLY_WIDGET_SCRIPT = "https://tally.so/widgets/embed.js";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

function loadTallyEmbeds() {
  if (typeof window === "undefined") return;

  if (window.Tally) {
    window.Tally.loadEmbeds();
    return;
  }

  document
    .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
    .forEach((iframe) => {
      const src = iframe.getAttribute("data-tally-src");
      if (src) iframe.src = src;
    });
}

export default function PreRegisterSection() {
  useEffect(() => {
    loadTallyEmbeds();
  }, []);

  return (
    <section id="pre-register" className="relative py-16 md:py-24">
      <div className="absolute inset-0">
        <Image
          src="/images/pre-register-bg.png"
          alt=""
          fill
          className="object-cover opacity-70"
          sizes="100vw"
          priority={false}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#fffdf5]/88 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center text-foreground">
          <p className="text-5xl md:text-6xl" aria-hidden>
            🎁
          </p>
          <h2 className="mt-3 text-2xl leading-snug font-bold md:text-4xl">
            아트티쳐랩의 AI 서비스를
            <br />
            무료체험하세요!
          </h2>
          <div className="mt-6 space-y-3 text-base leading-relaxed text-foreground/90 md:text-lg">
            <p>지금 아트티쳐랩은 베타 서비스 중입니다.</p>
            <p>
              무료 체험에 참여하시고 솔직한 의견을 남겨주세요!
              <br />
              선생님의 의견을 바탕으로 최고의 서비스가 완성됩니다.
            </p>
            <ul className="mx-auto max-w-lg space-y-2 text-left text-sm leading-relaxed md:text-base">
              <li>
                * 참여 신청을 주시면 선정된 분들께 개별 연락을 드려요.
              </li>
              <li>
                * 참여 신청만 해주셔도 정식 서비스 오픈 시
                <br className="hidden sm:block" />
                1달 무료 체험 쿠폰을 드려요.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white/95 px-5 py-8 shadow-xl backdrop-blur-sm md:px-8 md:py-10">
          <iframe
            data-tally-src={TALLY_EMBED_SRC}
            loading="lazy"
            width="100%"
            height="1200"
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
            title="아트티쳐랩 베타 서비스 신청"
            className="min-h-[1200px] w-full border-0"
            style={{ minHeight: "1200px" }}
          />
        </div>
      </div>

      <Script
        src={TALLY_WIDGET_SCRIPT}
        strategy="lazyOnload"
        onLoad={loadTallyEmbeds}
      />
    </section>
  );
}
