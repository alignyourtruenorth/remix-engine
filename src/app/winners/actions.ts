"use server";

import { prisma } from "@/lib/prisma";
import { getHistory, getPostAnalytics, extractStats } from "@/lib/ayrshare";
import { classifyPillars } from "@/lib/pillar";
import { redirect } from "next/navigation";

const SUPPORTED_PLATFORMS = ["instagram", "facebook", "linkedin"];

type PendingRow = {
  platform: string;
  externalId: string;
  ayrsharePostId: string;
  rawText: string;
  mediaType: string;
  postedAt: Date;
  likes: number;
  comments: number;
  shares: number;
  views: number | undefined;
};

export async function syncPosts() {
  let rows: PendingRow[];
  try {
    const history = await getHistory();
    rows = [];

    for (const post of history) {
      const platforms = post.platforms.filter((p) => SUPPORTED_PLATFORMS.includes(p));
      if (platforms.length === 0) continue;

      const analytics = await getPostAnalytics(post.id, platforms);
      const mediaType = post.postIds.some((p) => p.isVideo)
        ? "video"
        : (post.mediaUrls?.length ?? 0) > 0
          ? "image"
          : "text";

      for (const platform of platforms) {
        const postId = post.postIds.find((p) => p.platform === platform);
        if (!postId) continue;
        const platformAnalytics = analytics[platform]?.analytics ?? {};
        const stats = extractStats(platform, platformAnalytics);

        rows.push({
          platform,
          externalId: postId.id,
          ayrsharePostId: post.id,
          rawText: post.post,
          mediaType,
          postedAt: new Date(post.created),
          ...stats,
        });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    redirect(`/winners?error=${encodeURIComponent(message)}`);
  }

  const uniqueByAyrshareId = new Map<string, string>();
  for (const row of rows) uniqueByAyrshareId.set(row.ayrsharePostId, row.rawText);
  const ayrshareIds = [...uniqueByAyrshareId.keys()];
  const pillars = await classifyPillars([...uniqueByAyrshareId.values()]);
  const pillarByAyrshareId = new Map(ayrshareIds.map((id, i) => [id, pillars[i]]));

  for (const row of rows) {
    await prisma.sourcePost.upsert({
      where: { platform_externalId: { platform: row.platform, externalId: row.externalId } },
      update: {
        rawText: row.rawText,
        mediaType: row.mediaType,
        postedAt: row.postedAt,
        likes: row.likes,
        comments: row.comments,
        shares: row.shares,
        views: row.views,
      },
      create: {
        platform: row.platform,
        externalId: row.externalId,
        rawText: row.rawText,
        mediaType: row.mediaType,
        postedAt: row.postedAt,
        likes: row.likes,
        comments: row.comments,
        shares: row.shares,
        views: row.views,
        pillar: pillarByAyrshareId.get(row.ayrsharePostId) ?? "educate",
        engagementRate: 0,
      },
    });
  }

  for (const platform of SUPPORTED_PLATFORMS) {
    const posts = await prisma.sourcePost.findMany({ where: { platform } });
    if (posts.length === 0) continue;
    const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
    const avgEngagement = Math.max(totalEngagement / posts.length, 1);

    for (const p of posts) {
      const engagement = p.likes + p.comments + p.shares;
      await prisma.sourcePost.update({
        where: { id: p.id },
        data: { engagementRate: engagement / avgEngagement },
      });
    }
  }

  redirect("/winners?synced=1");
}
