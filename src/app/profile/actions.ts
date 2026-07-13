"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function toInt(value: FormDataEntryValue | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

export async function saveProfile(formData: FormData) {
  const data = {
    niche: String(formData.get("niche") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    voiceNotes: String(formData.get("voiceNotes") ?? ""),
    signaturePhrases: String(formData.get("signaturePhrases") ?? ""),
    neverUsePhrases: String(formData.get("neverUsePhrases") ?? ""),
    offers: String(formData.get("offers") ?? ""),
    pillarEntertain: toInt(formData.get("pillarEntertain")),
    pillarEducate: toInt(formData.get("pillarEducate")),
    pillarRelate: toInt(formData.get("pillarRelate")),
    pillarTrust: toInt(formData.get("pillarTrust")),
    pillarSell: toInt(formData.get("pillarSell")),
  };

  const existing = await prisma.profile.findFirst();

  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.profile.create({ data });
  }

  redirect("/profile?saved=1");
}
