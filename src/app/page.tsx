import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const settings = await prisma.settings.findFirst();
  const ready = settings?.openrouterApiKey && settings?.ayrshareApiKey;
  redirect(ready ? "/profile" : "/setup");
}
