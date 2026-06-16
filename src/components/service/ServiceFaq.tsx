"use client";

import { SERVICE_FAQ } from "@/data/service-page-content";
import { useState } from "react";

export default function ServiceFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {SERVICE_FAQ.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-bold text-foreground md:text-base">
                Q. {item.q}
              </span>
              <span className="shrink-0 text-lg text-muted" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
