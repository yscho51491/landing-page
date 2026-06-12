"use client";

import MyLessonDetail from "@/components/my/MyLessonDetail";
import { downloadLabLessonDocx } from "@/lib/export/export-lab-lesson-docx";
import type { MyLabLesson } from "@/lib/my/get-my-lab-lessons";
import Image from "next/image";
import { useState } from "react";

type Tab = "lessons" | "artworks";

type MyPageContentProps = {
  lessons: MyLabLesson[];
  userEmail?: string | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyPageContent({
  lessons,
  userEmail,
}: MyPageContentProps) {
  const [tab, setTab] = useState<Tab>("lessons");
  const [selected, setSelected] = useState<MyLabLesson | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const artworks = lessons.filter((lesson) => lesson.coverImageUrl);

  const handleExport = async (lesson: MyLabLesson) => {
    setExportingId(lesson.id);
    try {
      await downloadLabLessonDocx(lesson.idea, lesson.words);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
        마이페이지
      </h1>
      <p className="mt-2 text-sm text-muted">
        실험실에서 만든 수업과 완성작을 모아볼 수 있어요.
      </p>

      {userEmail && (
        <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold text-foreground">내 추천인 ID</p>
          <p className="mt-1 text-sm font-medium text-primary">{userEmail}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            친구가 가입할 때 이 이메일을 추천인 ID로 입력하면, 둘 다
            아트랩코인 5개를 받아요.
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-2 rounded-full border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => setTab("lessons")}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
            tab === "lessons"
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          내 수업 ({lessons.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("artworks")}
          className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
            tab === "artworks"
              ? "bg-primary text-primary-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          내 완성작 ({artworks.length})
        </button>
      </div>

      {tab === "lessons" && (
        <div className="mt-6 space-y-3">
          {lessons.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
              아직 저장된 수업이 없어요.{" "}
              <a href="/lab" className="font-semibold text-primary underline">
                실험실
              </a>
              에서 아이디어를 만들어 보세요.
            </p>
          ) : (
            lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setSelected(lesson)}
                    className="text-left transition-opacity hover:opacity-80"
                  >
                    <p className="text-xs font-semibold text-emphasis">
                      {lesson.words[0]} × {lesson.words[1]}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-foreground">
                      {lesson.idea.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(lesson.createdAt)}
                      {lesson.coverImageUrl ? " · 완성작 있음" : ""}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleExport(lesson)}
                    disabled={exportingId === lesson.id}
                    className="shrink-0 rounded-full border-2 border-primary bg-surface px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                  >
                    {exportingId === lesson.id ? "저장 중..." : "Word 저장"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "artworks" && (
        <div className="mt-6">
          {artworks.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
              아직 완성작이 없어요. 수업 아이디어에서{" "}
              <strong>완성작 미리보기</strong>를 생성해 보세요.
            </p>
          ) : (
            <div className="columns-2 gap-3 sm:columns-3 [column-fill:_balance]">
              {artworks.map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelected(lesson)}
                  className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-surface transition-transform duration-200 [break-inside:avoid] hover:scale-[1.015]"
                >
                  <Image
                    src={lesson.coverImageUrl!}
                    alt={`${lesson.idea.title} 완성작`}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 50vw, 33vw"
                    unoptimized
                    className="h-auto w-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute right-0 bottom-0 left-0 px-3 py-2 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {lesson.idea.title}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="text-sm font-semibold text-foreground">수업 상세</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleExport(selected)}
                  disabled={exportingId === selected.id}
                  className="rounded-full border border-primary px-4 py-1.5 text-xs font-bold text-foreground hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                >
                  Word 저장
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-foreground"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-5 py-6">
              {selected.coverImageUrl && (
                <div className="mb-6 overflow-hidden rounded-xl border border-border">
                  <Image
                    src={selected.coverImageUrl}
                    alt={`${selected.idea.title} 완성작`}
                    width={1024}
                    height={1536}
                    unoptimized
                    className="mx-auto h-auto w-full max-w-sm"
                  />
                </div>
              )}
              <MyLessonDetail lesson={selected} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
