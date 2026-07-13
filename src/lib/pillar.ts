import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getOpenRouterClient, getOpenRouterModel } from "@/lib/openrouter";

export const PILLARS = ["entertain", "educate", "relate", "trust", "sell"] as const;
export type Pillar = (typeof PILLARS)[number];

const ClassificationSchema = z.object({
  pillars: z.array(z.enum(PILLARS)),
});

const FALLBACK_PILLAR: Pillar = "educate";

export async function classifyPillars(texts: string[]): Promise<Pillar[]> {
  if (texts.length === 0) return [];
  const client = await getOpenRouterClient();
  if (!client) {
    return texts.map(() => FALLBACK_PILLAR);
  }

  const numbered = texts
    .map((text, i) => `${i}: ${text.slice(0, 500).replace(/\n/g, " ")}`)
    .join("\n");

  try {
    const model = await getOpenRouterModel();
    const completion = await client.chat.completions.parse({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You classify social media posts into exactly one content pillar each: " +
            "entertain, educate, relate, trust, or sell. Return one pillar per input, in the same order.",
        },
        { role: "user", content: numbered },
      ],
      response_format: zodResponseFormat(ClassificationSchema, "classification"),
    });

    const parsed = completion.choices[0]?.message.parsed;
    if (!parsed || parsed.pillars.length !== texts.length) {
      return texts.map(() => FALLBACK_PILLAR);
    }
    return parsed.pillars;
  } catch {
    return texts.map(() => FALLBACK_PILLAR);
  }
}
