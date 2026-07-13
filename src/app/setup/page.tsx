import { prisma } from "@/lib/prisma";
import { maskKey } from "@/lib/settings";
import { listStructuredOutputModels, DEFAULT_MODEL } from "@/lib/openrouter";
import { saveApiKeys } from "./actions";

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900";

function StepBadge({ done }: { done: boolean }) {
  return (
    <span
      className={
        done
          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-300"
          : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
      }
    >
      {done ? "Connected" : "Not connected"}
    </span>
  );
}

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await prisma.settings.findFirst();
  const profile = await prisma.profile.findFirst();
  const models = await listStructuredOutputModels();

  const openrouterMasked = maskKey(settings?.openrouterApiKey);
  const ayrshareMasked = maskKey(settings?.ayrshareApiKey);
  const selectedModel = settings?.openrouterModel ?? DEFAULT_MODEL;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Setup</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Connect your accounts to start pulling posts and generating drafts.
        Your keys are stored locally on this machine only.
      </p>

      {saved === "1" && (
        <div className="mt-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
          Saved.
        </div>
      )}

      <form action={saveApiKeys} className="mt-6 flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2">
            <h2 className="font-medium">1. OpenRouter API key</h2>
            <StepBadge done={!!openrouterMasked} />
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Powers draft generation — OpenRouter gives you access to Claude,
            GPT, Gemini, and more through one key, and you pick which model to
            use below. Sign up and grab a key at{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              openrouter.ai/keys
            </a>{" "}
            — you&apos;ll need to add credits (prepaid, pay-as-you-go) before
            it can make requests.
          </p>
          <input
            type="password"
            name="openrouterApiKey"
            placeholder={openrouterMasked ?? "sk-or-v1-..."}
            className={`mt-2 ${inputClass}`}
            autoComplete="off"
          />

          <label className="mt-4 flex flex-col gap-1">
            <span className="text-sm font-medium">Model</span>
            <select
              name="openrouterModel"
              defaultValue={selectedModel}
              className={inputClass}
            >
              {!models.some((m) => m.id === selectedModel) && (
                <option value={selectedModel}>{selectedModel}</option>
              )}
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id})
                </option>
              ))}
            </select>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Only models that support structured output are listed. Pricier
              models generally write better drafts, but any of these will
              work.
            </span>
          </label>
        </section>

        <section>
          <div className="flex items-center gap-2">
            <h2 className="font-medium">2. Ayrshare API key</h2>
            <StepBadge done={!!ayrshareMasked} />
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Pulls your post history and publishes approved drafts. Sign up at{" "}
            <a
              href="https://www.ayrshare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              ayrshare.com
            </a>{" "}
            (you&apos;ll need at least their Launch plan — the History API
            required for the Winners page isn&apos;t on the cheapest tier).
            In their dashboard, link your Instagram (Business/Creator
            account), Facebook Page (not a personal profile), and LinkedIn —
            then paste your API key below.
          </p>
          <input
            type="password"
            name="ayrshareApiKey"
            placeholder={ayrshareMasked ?? "Your Ayrshare API key"}
            className={`mt-2 ${inputClass}`}
            autoComplete="off"
          />
        </section>

        <button
          type="submit"
          className="w-fit rounded-md bg-zinc-900 px-5 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Save
        </button>
      </form>

      <section className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">3. Your Profile</h2>
          <StepBadge done={!!profile} />
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your niche, voice, and offers — this feeds every generated draft so
          it sounds like you, not generic AI.
        </p>
        <a
          href="/profile"
          className="mt-3 inline-block w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Go to Profile →
        </a>
      </section>
    </div>
  );
}
