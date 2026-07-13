"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/setup", label: "Setup" },
  { href: "/profile", label: "Profile" },
  { href: "/winners", label: "Winners" },
  { href: "/drafts", label: "Drafts" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-4">
        <span className="font-semibold tracking-tight">Remix Engine</span>
        <div className="flex gap-4">
          {LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "font-medium text-zinc-950 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
