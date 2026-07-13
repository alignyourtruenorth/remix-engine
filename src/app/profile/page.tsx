import { prisma } from "@/lib/prisma";
import { saveProfile } from "./actions";
import PillarSplit from "@/components/PillarSplit";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const profile = await prisma.profile.findFirst();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        This feeds every generation prompt, so the more specific, the more
        drafts will sound like you instead of generic AI.
      </p>

      {saved === "1" && (
        <div className="mt-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
          Profile saved.
        </div>
      )}

      <form action={saveProfile} className="mt-6 flex flex-col gap-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Niche</span>
          <input
            type="text"
            name="niche"
            defaultValue={profile?.niche}
            placeholder="e.g. helping chiropractors build online authority"
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Audience</span>
          <textarea
            name="audience"
            defaultValue={profile?.audience}
            placeholder="Who you're talking to — role, pain points, stage of business"
            rows={3}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Voice &amp; tone notes</span>
          <textarea
            name="voiceNotes"
            defaultValue={profile?.voiceNotes}
            placeholder="How you sound — direct, warm, no-BS, funny, formal..."
            rows={3}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Signature phrases</span>
          <textarea
            name="signaturePhrases"
            defaultValue={profile?.signaturePhrases}
            placeholder="One per line — phrases or turns of phrase you actually use"
            rows={3}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Phrases to never use</span>
          <textarea
            name="neverUsePhrases"
            defaultValue={profile?.neverUsePhrases}
            placeholder="One per line — words/phrases that don't sound like you or your brand"
            rows={3}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Main offers / products</span>
          <textarea
            name="offers"
            defaultValue={profile?.offers}
            placeholder="What you're ultimately selling or driving toward"
            rows={3}
            className={inputClass}
          />
        </label>

        <div>
          <span className="text-sm font-medium">
            Target content split (entertain / educate / relate / trust / sell)
          </span>
          <div className="mt-2">
            <PillarSplit
              defaults={{
                pillarEntertain: profile?.pillarEntertain ?? 20,
                pillarEducate: profile?.pillarEducate ?? 20,
                pillarRelate: profile?.pillarRelate ?? 20,
                pillarTrust: profile?.pillarTrust ?? 20,
                pillarSell: profile?.pillarSell ?? 20,
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-fit rounded-md bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
