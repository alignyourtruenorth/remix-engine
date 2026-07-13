import OpenAI from "openai";
import { getOpenRouterApiKey, getOpenRouterModel } from "@/lib/settings";

export const DEFAULT_MODEL = "anthropic/claude-sonnet-5";

export async function getOpenRouterClient(): Promise<OpenAI | null> {
  const apiKey = await getOpenRouterApiKey();
  if (!apiKey) return null;
  return new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey });
}

export { getOpenRouterModel };

export type OpenRouterModelOption = {
  id: string;
  name: string;
};

export async function listStructuredOutputModels(): Promise<OpenRouterModelOption[]> {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();

  type RawModel = {
    id: string;
    name: string;
    supported_parameters?: string[];
    architecture?: { output_modalities?: string[] };
  };

  return (data.data as RawModel[])
    .filter(
      (m) =>
        m.supported_parameters?.includes("structured_outputs") &&
        m.architecture?.output_modalities?.includes("text"),
    )
    .map((m) => ({ id: m.id, name: m.name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
