import {
  LAB_DIRECTION_SYSTEM_PROMPT,
  buildLabDirectionUserPrompt,
  parseLabLessonDirections,
} from "@/lib/lab/direction-prompts";
import type { LabLessonDirection } from "@/types/lab";
import OpenAI from "openai";

const MODEL = "gpt-4o-mini";

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
    if (!retryable) throw err;
    await sleep(3000);
    return fn();
  }
}

export async function generateLabDirections(
  apiKey: string,
  word1: string,
  word2: string,
): Promise<LabLessonDirection[]> {
  const openai = new OpenAI({ apiKey });
  const userPrompt = buildLabDirectionUserPrompt(word1, word2);

  const request = () =>
    openai.chat.completions.create({
      model: MODEL,
      temperature: 0.92,
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: LAB_DIRECTION_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

  let completion = await callWithRateLimitRetry(request);
  let content = completion.choices[0]?.message?.content;

  if (!content) throw new Error("OPENAI_EMPTY");

  let parsed: LabLessonDirection[] | null = null;
  try {
    parsed = parseLabLessonDirections(JSON.parse(content));
  } catch {
    parsed = null;
  }

  if (!parsed) {
    completion = await callWithRateLimitRetry(request);
    content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("OPENAI_EMPTY");
    try {
      parsed = parseLabLessonDirections(JSON.parse(content));
    } catch {
      throw new Error("OPENAI_PARSE");
    }
  }

  if (!parsed) throw new Error("OPENAI_INVALID_SHAPE");
  return parsed;
}
