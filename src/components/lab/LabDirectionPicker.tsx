"use client";

import type { LabLessonDirection } from "@/types/lab";

type LabDirectionPickerProps = {
  words: [string, string];
  directions: LabLessonDirection[];
  onSelect: (direction: LabLessonDirection) => void;
  onBack: () => void;
  disabled?: boolean;
};

const CARD_ACCENTS = [
  "border-amber-300/70 bg-amber-50/80 hover:border-amber-400",
  "border-sky-300/70 bg-sky-50/80 hover:border-sky-400",
  "border-emerald-300/70 bg-emerald-50/80 hover:border-emerald-400",
] as const;

export default function LabDirectionPicker({
  words,
  directions,
  onSelect,
  onBack,
  disabled = false,
}: LabDirectionPickerProps) {
  return (
    <div className="text-left">
      <p className="text-center text-xs font-semibold tracking-wide text-emphasis">
        {words[0]} × {words[1]}
      </p>
      <h2 className="mt-2 text-center text-xl font-bold text-foreground md:text-2xl">
        어떤 수업 방향이 끌리세요?
      </h2>
      <p className="mt-2 text-center text-sm text-muted">
        마음에 드는 방향을 고르면 상세 수업 기획안을 만들어 드려요.
      </p>

      <div className="mt-6 grid gap-3">
        {directions.map((direction, index) => (
          <button
            key={direction.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(direction)}
            className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${CARD_ACCENTS[index % CARD_ACCENTS.length]}`}
          >
            <span className="text-xs font-bold text-muted">방향 {index + 1}</span>
            <p className="mt-1 text-base font-bold text-foreground">{direction.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{direction.intro}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="text-sm font-medium text-muted underline-offset-2 hover:text-foreground hover:underline disabled:opacity-50"
        >
          ← 단어 다시 고르기
        </button>
      </div>
    </div>
  );
}
