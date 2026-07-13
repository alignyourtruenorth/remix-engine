import { getAyrshareApiKey } from "@/lib/settings";

const BASE_URL = "https://api.ayrshare.com/api";

async function authHeaders() {
  const key = await getAyrshareApiKey();
  if (!key) throw new Error("Ayrshare API key is not set. Add it on the Setup page.");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export type AyrsharePostId = {
  platform: string;
  id: string;
  status: string;
  postUrl?: string;
  isVideo?: boolean;
};

export type AyrshareHistoryPost = {
  id: string;
  post: string;
  platforms: string[];
  status: string;
  created: string;
  postIds: AyrsharePostId[];
  mediaUrls?: string[];
};

export async function getHistory(): Promise<AyrshareHistoryPost[]> {
  const res = await fetch(`${BASE_URL}/history?lastDays=0&status=success&limit=1000`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Ayrshare history request failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.history ?? [];
}

export type PlatformAnalytics = Record<string, number | undefined>;

export type PostAnalyticsResponse = Record<
  string,
  { analytics?: PlatformAnalytics } | undefined
>;

export async function getPostAnalytics(
  ayrsharePostId: string,
  platforms: string[],
): Promise<PostAnalyticsResponse> {
  const res = await fetch(`${BASE_URL}/analytics/post`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ id: ayrsharePostId, platforms }),
  });
  if (!res.ok) {
    throw new Error(`Ayrshare analytics request failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export function extractStats(platform: string, analytics: PlatformAnalytics) {
  switch (platform) {
    case "instagram":
      return {
        likes: analytics.likeCount ?? 0,
        comments: analytics.commentsCount ?? 0,
        shares: analytics.sharesCount ?? 0,
        views: analytics.viewsCount,
      };
    case "facebook":
      return {
        likes: analytics.likeCount ?? 0,
        comments: analytics.commentsCount ?? 0,
        shares: analytics.sharesCount ?? 0,
        views: analytics.mediaView,
      };
    case "linkedin":
      return {
        likes: analytics.likeCount ?? 0,
        comments: analytics.commentCount ?? 0,
        shares: analytics.shareCount ?? 0,
        views: analytics.impressionCount,
      };
    default:
      return { likes: 0, comments: 0, shares: 0, views: undefined as number | undefined };
  }
}
