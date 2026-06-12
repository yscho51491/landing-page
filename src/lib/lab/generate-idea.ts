import {
  LAB_IDEA_DETAIL_EXPANSION_PROMPT,
  LAB_IDEA_SYSTEM_PROMPT,
  buildLabIdeaUserPrompt,
} from "@/lib/lab/idea-prompts";
import { isLabProcessDetailedEnough } from "@/lib/lab/idea-quality";
import { parseLabLessonIdea } from "@/lib/lab/parse-idea";
import type { LabLessonIdea } from "@/types/lab";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 4096;

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

async function requestLabIdeaJson(
  openai: OpenAI,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  temperature: number,
): Promise<string> {
  const completion = await callWithRateLimitRetry(() =>
    openai.chat.completions.create({
      model: MODEL,
      temperature,
      max_tokens: MAX_TOKENS,
      response_format: { type: "json_object" },
      messages,
    }),
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OPENAI_EMPTY");
  }
  return content;
}

function parseOrThrow(raw: string): LabLessonIdea {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("OPENAI_PARSE");
  }

  const idea = parseLabLessonIdea(json);
  if (!idea) {
    throw new Error("OPENAI_INVALID_SHAPE");
  }
  return idea;
}

export async function generateLabIdea(
  apiKey: string,
  word1: string,
  word2: string,
): Promise<LabLessonIdea> {
  const openai = new OpenAI({ apiKey });
  const userPrompt = buildLabIdeaUserPrompt(word1, word2);
  const baseMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: LAB_IDEA_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  let raw = await requestLabIdeaJson(openai, baseMessages, 0.85);
  let idea: LabLessonIdea;

  try {
    idea = parseOrThrow(raw);
  } catch {
    raw = await requestLabIdeaJson(
      openai,
      [
        ...baseMessages,
        { role: "assistant", content: raw },
        {
          role: "user",
          content:
            "JSON 스키마가 맞지 않습니다. title, overview, goals, materials, process(title+points), expectedEffects 키를 정확히 지켜 다시 작성해 주세요.",
        },
      ],
      0.5,
    );
    idea = parseOrThrow(raw);
  }

  if (!isLabProcessDetailedEnough(idea)) {
    const expandedRaw = await requestLabIdeaJson(
      openai,
      [
        { role: "system", content: LAB_IDEA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
        { role: "assistant", content: raw },
        { role: "user", content: LAB_IDEA_DETAIL_EXPANSION_PROMPT },
      ],
      0.55,
    );

    try {
      const expanded = parseOrThrow(expandedRaw);
      if (isLabProcessDetailedEnough(expanded)) {
        return expanded;
      }
      idea = expanded;
    } catch (err) {
      console.warn("[lab-generate-idea] detail expansion failed", err);
    }
  }

  return idea;
}
