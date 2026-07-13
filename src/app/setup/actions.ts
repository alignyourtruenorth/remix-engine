"use server";

import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { redirect } from "next/navigation";

export async function saveApiKeys(formData: FormData) {
  const openrouterApiKey = String(formData.get("openrouterApiKey") ?? "").trim();
  const openrouterModel = String(formData.get("openrouterModel") ?? "").trim();
  const ayrshareApiKey = String(formData.get("ayrshareApiKey") ?? "").trim();

  const existing = await getSettings();
  const data = {
    ...(openrouterApiKey && { openrouterApiKey }),
    ...(openrouterModel && { openrouterModel }),
    ...(ayrshareApiKey && { ayrshareApiKey }),
  };

  if (Object.keys(data).length > 0) {
    if (existing) {
      await prisma.settings.update({ where: { id: existing.id }, data });
    } else {
      await prisma.settings.create({ data });
    }
  }

  redirect("/setup?saved=1");
}
