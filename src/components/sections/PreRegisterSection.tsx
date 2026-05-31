"use client";

import { FormEvent, useState } from "react";

export default function PreRegisterSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="pre-register"
      className="bg-gradient-to-br from-primary to-primary-dark py-16 md:py-24"
    >
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold md:text-4xl">
            🎁 아트티쳐랩의 AI 서비스를 무료체험 하세요.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg">
            현재 아트티쳐랩은 선생님들의 실제 수업 준비를 돕기 위해
            <br />
            베타 서비스 중입니다.
            <br />
            베타 서비스에 참여하시고 오피셜 서비스 특별 혜택도 받아보세요! 🚀
          </p>
        </div>

        {submitted ? (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-xl">
            <p className="text-2xl">🎉</p>
            <p className="mt-4 text-lg font-bold text-foreground">
              신청이 완료되었습니다!
            </p>
            <p className="mt-2 text-sm text-muted">
              베타 서비스 오픈 시 입력하신 이메일로 안내드리겠습니다.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 rounded-2xl bg-white p-6 shadow-xl md:p-8"
          >
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="홍길동"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="teacher@example.com"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="job" className="mb-1 block text-sm font-medium text-foreground">
                직업/운영 형태
              </label>
              <input
                id="job"
                name="job"
                type="text"
                required
                placeholder="예: 유치원 교사, 초등교사, 미술학원, 방과후 강사, 공방 운영자 등"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="target" className="mb-1 block text-sm font-medium text-foreground">
                자주 준비하는 수업 대상
              </label>
              <input
                id="target"
                name="target"
                type="text"
                required
                placeholder="예: 유아, 초등 저학년, 초등 고학년"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="material" className="mb-1 block text-sm font-medium text-foreground">
                가장 필요한 자료 유형
              </label>
              <input
                id="material"
                name="material"
                type="text"
                required
                placeholder="예: 수업계획서, 도안, PPT, 활동지, 예시작품 이미지"
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-primary py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              베타 서비스 신청하기
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
