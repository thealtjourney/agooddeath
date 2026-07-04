"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/leaderboard", label: "Register" },
  { href: "/badges", label: "Badges" },
];

/** Persistent top navigation, shown on the landing and all content pages. */
export function NavBar() {
  const path = usePathname();
  return (
    <nav className="border-b border-ink/20 bg-parchment-dark/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="font-black text-lg leading-none text-ink hover:text-rubric">
          A&nbsp;Good&nbsp;Death
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`font-body text-[12px] uppercase tracking-widest sm:text-[13px] ${
                  active ? "text-rubric" : "text-ink-faded hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
