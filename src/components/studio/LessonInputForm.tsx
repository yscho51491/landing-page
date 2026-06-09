"use client";

import type { LessonInput } from "@/types/lesson";
import { useState } from "react";

const AUDIENCE_PRESETS = [
  "유아 (2~4세)",
  "유치원 (5~7세)",
  "초등 1~2학년",
  "초등 3~4학년",
  "초등 5~6학년",
  "청소년",
  "성인",
  "시니어",
] as const;

const AUDIENCE_CUSTOM_VALUE = "__audience_custom__";

const DURATION_PRESETS = ["40분", "45분", "60분", "90분"] as const;
const DURATION_CUSTOM_VALUE = "__duration_custom__";

const inputClassName =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none ring-emphasis/30 transition-shadow focus:ring-2 disabled:opacity-60";

type LessonInputFormProps = {
  onSubmit: (input: LessonInput) => void | Promise<void>;
  isSubmitting: boolean;
};

export default function LessonInputForm({
  onSubmit,
  isSubmitting,
}: LessonInputFormProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [audienceSelect, setAudienceSelect] = useState<string>("초등 3~4학년");
  const [audienceCustom, setAudienceCustom] = useState("");
  const [durationSelect, setDurationSelect] = useState<string>("45분");
  const [durationCustom, setDurationCustom] = useState("");

  const isAudienceCustom = audienceSelect === AUDIENCE_CUSTOM_VALUE;
  const isDurationCustom = durationSelect === DURATION_CUSTOM_VALUE;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    const form = new FormData(e.currentTarget);
    const topic = String(form.get("topic") ?? "").trim();
    const requirements = String(form.get("requirements") ?? "").trim();

    const audience = isAudienceCustom
      ? audienceCustom.trim()
      : audienceSelect.trim();

    const duration = isDurationCustom
      ? durationCustom.trim()
      : durationSelect.trim();

    if (!topic) {
      setValidationError("수업 주제를 입력해 주세요.");
      return;
    }
    if (!audience) {
      setValidationError(
        isAudienceCustom
          ? "수업 대상을 직접 입력해 주세요."
          : "수업 대상을 선택해 주세요.",
      );
      return;
    }
    if (!duration) {
      setValidationError(
        isDurationCustom
          ? "수업 시간을 직접 입력해 주세요."
          : "수업 시간을 선택하거나 입력해 주세요.",
      );
      return;
    }

    try {
      await onSubmit({ topic, audience, duration, requirements });
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : "요청 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg"
    >
      <div className="bg-primary px-6 py-4">
        <h2 className="font-semibold text-primary-foreground">수업 정보 입력</h2>
        <p className="mt-1 text-sm text-primary-foreground/80">
          주제와 대상만 정확히 적어도 1차 자료(계획서·대본)를 만들 수 있어요.
        </p>
      </div>

      <div className="space-y-5 p-6">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            수업 주제 <span className="text-emphasis">*</span>
          </span>
          <input
            name="topic"
            type="text"
            required
            placeholder="예: 여름 수박, 호국보훈, 자화상"
            className={inputClassName}
            disabled={isSubmitting}
          />
        </label>

        <div className="block">
          <span className="text-sm font-semibold text-foreground">
            수업 대상 <span className="text-emphasis">*</span>
          </span>
          <select
            name="audience"
            value={audienceSelect}
            onChange={(e) => setAudienceSelect(e.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
          >
            {AUDIENCE_PRESETS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value={AUDIENCE_CUSTOM_VALUE}>그 외 : 직접 입력</option>
          </select>
          {isAudienceCustom && (
            <input
              type="text"
              name="audienceCustom"
              value={audienceCustom}
              onChange={(e) => setAudienceCustom(e.target.value)}
              placeholder="예: 초등 방과후 미술반, 성인 취미반"
              className={inputClassName}
              disabled={isSubmitting}
              aria-label="수업 대상 직접 입력"
            />
          )}
        </div>

        <div className="block">
          <span className="text-sm font-semibold text-foreground">
            수업 시간 <span className="text-emphasis">*</span>
          </span>
          <select
            name="duration"
            value={durationSelect}
            onChange={(e) => setDurationSelect(e.target.value)}
            className={inputClassName}
            disabled={isSubmitting}
          >
            {DURATION_PRESETS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value={DURATION_CUSTOM_VALUE}>직접 입력</option>
          </select>
          {isDurationCustom && (
            <input
              type="text"
              name="durationCustom"
              value={durationCustom}
              onChange={(e) => setDurationCustom(e.target.value)}
              placeholder="예: 50분, 1시간 30분"
              className={inputClassName}
              disabled={isSubmitting}
              aria-label="수업 시간 직접 입력"
            />
          )}
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            필수 반영사항 <span className="font-normal text-muted">(선택)</span>
          </span>
          <textarea
            name="requirements"
            rows={3}
            placeholder="예: 피난민의 모습, 평화의 메시지, 친환경 재활용 소재 사용"
            className={`${inputClassName} resize-y`}
            disabled={isSubmitting}
          />
        </label>
      </div>

      {validationError && (
        <p className="mx-6 mb-0 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {validationError}
        </p>
      )}

      <div className="border-t border-border bg-surface-alt px-6 py-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-emphasis px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "수업자료 생성 중..." : "수업자료 생성하기"}
        </button>
      </div>
    </form>
  );
}
