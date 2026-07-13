import { prisma } from "@/lib/prisma";

export async function getSettings() {
  return prisma.settings.findFirst();
}

export async function getOpenRouterApiKey(): Promise<string | undefined> {
  const settings = await getSettings();
  return settings?.openrouterApiKey ?? process.env.OPENROUTER_API_KEY ?? undefined;
}

export async function getOpenRouterModel(): Promise<string> {
  const settings = await getSettings();
  return settings?.openrouterModel ?? "anthropic/claude-sonnet-5";
}

export async function getAyrshareApiKey(): Promise<string | undefined> {
  const settings = await getSettings();
  return settings?.ayrshareApiKey ?? process.env.AYRSHARE_API_KEY ?? undefined;
}

export function maskKey(key: string | null | undefined): string | null {
  if (!key) return null;
  return `••••••••${key.slice(-4)}`;
}
