"use client";

import { useState } from "react";

const PILLARS = [
  { key: "pillarEntertain", label: "Entertain" },
  { key: "pillarEducate", label: "Educate" },
  { key: "pillarRelate", label: "Relate" },
  { key: "pillarTrust", label: "Trust" },
  { key: "pillarSell", label: "Sell" },
] as const;

export default function PillarSplit({
  defaults,
}: {
  defaults: Record<(typeof PILLARS)[number]["key"], number>;
}) {
  const [values, setValues] = useState(defaults);
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);

  return (
    <div>
      <div className="grid grid-cols-5 gap-3">
        {PILLARS.map((p) => (
          <label key={p.key} className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">{p.label}</span>
            <input
              type="number"
              name={p.key}
              min={0}
              max={100}
              value={values[p.key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [p.key]: Number(e.target.value) }))
              }
              className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
        ))}
      </div>
      <p
        className={`mt-2 text-sm ${
          total === 100
            ? "text-zinc-500 dark:text-zinc-400"
            : "text-amber-600 dark:text-amber-500"
        }`}
      >
        Total: {total}%{total !== 100 && " — should add up to 100%"}
      </p>
    </div>
  );
}
