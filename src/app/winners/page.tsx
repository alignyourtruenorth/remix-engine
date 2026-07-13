import { prisma } from "@/lib/prisma";
import { syncPosts } from "./actions";

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export default async function WinnersPage({
  searchParams,
}: {
  searchParams: Promise<{ synced?: string; error?: string }>;
}) {
  const { synced, error } = await searchParams;
  const posts = await prisma.sourcePost.findMany({
    orderBy: { engagementRate: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Winners</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Your synced posts, ranked by engagement rate relative to your own average.
          </p>
        </div>
        <form action={syncPosts}>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Sync
          </button>
        </form>
      </div>

      {synced === "1" && (
        <div className="mt-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
          Synced {posts.length} posts.
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
          Sync failed: {error}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="mt-8 text-zinc-500 dark:text-zinc-400">
          No posts yet. Click Sync to pull your history from Ayrshare.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-4">Rate</th>
                <th className="py-2 pr-4">Platform</th>
                <th className="py-2 pr-4">Pillar</th>
                <th className="py-2 pr-4">Posted</th>
                <th className="py-2 pr-4">Likes</th>
                <th className="py-2 pr-4">Comments</th>
                <th className="py-2 pr-4">Shares</th>
                <th className="py-2 pr-4">Views</th>
                <th className="py-2">Text</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-zinc-100 dark:border-zinc-900"
                >
                  <td className="py-2 pr-4 font-medium">
                    {post.engagementRate.toFixed(2)}x
                  </td>
                  <td className="py-2 pr-4">{PLATFORM_LABEL[post.platform] ?? post.platform}</td>
                  <td className="py-2 pr-4 capitalize">{post.pillar}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {post.postedAt.toISOString().slice(0, 10)}
                  </td>
                  <td className="py-2 pr-4">{post.likes}</td>
                  <td className="py-2 pr-4">{post.comments}</td>
                  <td className="py-2 pr-4">{post.shares}</td>
                  <td className="py-2 pr-4">{post.views ?? "—"}</td>
                  <td className="max-w-md truncate py-2">{post.rawText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
