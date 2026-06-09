import {
  LESSON_EXPANSION_SYSTEM_PROMPT,
  LESSON_GENERATION_SYSTEM_PROMPT,
  buildLessonExpansionUserPrompt,
  buildLessonGenerationUserPrompt,
} from "@/lib/lesson/prompts";
import {
  MIN_LESSON_PLAN_CHARS,
  MIN_TEACHER_SCRIPT_CHARS,
  measureLessonTextLengths,
} from "@/lib/lesson/lesson-text-length";
import * as lessonParse from "@/lib/lesson/parse-output";
import type { LessonInput, LessonResult } from "@/types/lesson";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";
const GENERATION_MAX_TOKENS = 16384;
const EXPANSION_MAX_TOKENS = 16384;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callWithRateLimitRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const retryable =
      err instanceof OpenAI.APIError &&
      err.status === 429 &&
      err.code !== "insufficient_quota";
    if (!retryable) {
      throw err;
    }
    await sleep(3000);
    return fn();
  }
}

async function requestLessonJson(
  openai: OpenAI,
  system: string,
  user: string,
  maxTokens: number,
  temperature: number,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OPENAI_EMPTY");
  }
  return content;
}

function parseLessonJson(raw: string): LessonResult {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("OPENAI_PARSE");
  }

  const parsed = lessonParse.parseLessonResult(json);
  if (!parsed) {
    throw new Error("OPENAI_INVALID_SHAPE");
  }
  return parsed;
}

function warnIfStillShort(result: LessonResult, stage: string): void {
  const lengths = measureLessonTextLengths(result);
  if (lengths.lessonPlanShort) {
    console.warn(
      `[generate-lesson] ${stage}: lessonPlan still short (${lengths.lessonPlanLength}/${MIN_LESSON_PLAN_CHARS} chars)`,
    );
  }
  if (lengths.teacherScriptShort) {
    console.warn(
      `[generate-lesson] ${stage}: teacherScript still short (${lengths.teacherScriptLength}/${MIN_TEACHER_SCRIPT_CHARS} chars)`,
    );
  }
}

export async function generateLessonText(
  input: LessonInput,
  apiKey: string,
): Promise<LessonResult> {
  const openai = new OpenAI({ apiKey });

  const initialRaw = await callWithRateLimitRetry(() =>
    requestLessonJson(
      openai,
      LESSON_GENERATION_SYSTEM_PROMPT,
      buildLessonGenerationUserPrompt(input),
      GENERATION_MAX_TOKENS,
      0.7,
    ),
  );

  let result = parseLessonJson(initialRaw);
  let lengths = measureLessonTextLengths(result);

  if (lengths.needsExpansion) {
    const expansionRaw = await callWithRateLimitRetry(() =>
      requestLessonJson(
        openai,
        LESSON_EXPANSION_SYSTEM_PROMPT,
        buildLessonExpansionUserPrompt(
          input,
          result,
          lengths.lessonPlanLength,
          lengths.teacherScriptLength,
          lengths.lessonPlanShort,
          lengths.teacherScriptShort,
        ),
        EXPANSION_MAX_TOKENS,
        0.5,
      ),
    );

    try {
      result = parseLessonJson(expansionRaw);
      lengths = measureLessonTextLengths(result);
    } catch (err) {
      console.warn(
        "[generate-lesson] expansion parse failed, using initial result",
        err,
      );
      lengths = measureLessonTextLengths(result);
    }

    if (lengths.needsExpansion) {
      warnIfStillShort(result, "after expansion");
    }
  }

  return result;
}
