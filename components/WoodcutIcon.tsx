"use client";

/**
 * Placeholder woodcut icons — stylised line-art keyed to death category.
 * The launch set is ~30 commissioned/public-domain woodcuts (spec §8); these
 * stand in and prove the mapping. All use currentColor for ink/gilt theming.
 */
function iconKey(causeId: string): string {
  const id = causeId;
  if (id.includes("hay_cart")) return "cart";
  if (id.includes("donkey")) return "hoof";
  if (id.includes("lightning")) return "bolt";
  if (id.includes("witch")) return "flame";
  if (id.includes("poaching")) return "noose";
  if (id.includes("conscript") || id.includes("raid")) return "sword";
  if (id.includes("famine")) return "wheat";
  if (id.includes("pestilence") || id.includes("sweating") || id.includes("flux") || id.includes("ague"))
    return "skull";
  if (id.includes("old_age")) return "sun";
  return "bed";
}

export function WoodcutIcon({
  category,
  good,
  className,
}: {
  category: string;
  good?: boolean;
  className?: string;
}) {
  const key = good ? "sun" : iconKey(category);
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[key] ?? PATHS.bed}
    </svg>
  );
}

const PATHS: Record<string, JSX.Element> = {
  skull: (
    <>
      <path d="M32 8c-11 0-19 8-19 19 0 6 3 10 6 13v8h26v-8c3-3 6-7 6-13 0-11-8-19-19-19Z" />
      <circle cx="24" cy="28" r="4" fill="currentColor" />
      <circle cx="40" cy="28" r="4" fill="currentColor" />
      <path d="M32 34v6M26 48v6M32 48v6M38 48v6" />
    </>
  ),
  bed: (
    <>
      <path d="M8 40V24M8 32h40a8 8 0 0 1 8 8v8M8 48v-8M56 48v-4" />
      <path d="M16 32v-6a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v6" />
    </>
  ),
  sun: (
    <>
      <circle cx="32" cy="32" r="12" />
      <path d="M32 6v8M32 50v8M6 32h8M50 32h8M14 14l6 6M44 44l6 6M50 14l-6 6M20 44l-6 6" />
    </>
  ),
  cart: (
    <>
      <path d="M10 40h32l6-16H16l-6 16Z" />
      <circle cx="20" cy="50" r="5" />
      <circle cx="40" cy="50" r="5" />
      <path d="M42 40l10-4" />
    </>
  ),
  hoof: (
    <>
      <path d="M22 12c-6 6-8 16-6 26 1 6 5 10 10 10s9-4 10-10c2-10 0-20-6-26" />
      <path d="M24 44h12" />
    </>
  ),
  bolt: <path d="M36 6 16 36h12l-4 22 24-34H34l6-18H36Z" fill="currentColor" />,
  flame: (
    <>
      <path d="M32 8c2 8-8 12-8 22a8 8 0 0 0 16 0c0-4-2-6-2-6 4 2 6 6 6 12a12 12 0 0 1-24 0C20 24 30 20 32 8Z" />
      <path d="M14 56h36" />
    </>
  ),
  noose: (
    <>
      <path d="M32 8v6M32 14a10 10 0 0 1 0 20 10 10 0 0 1 0-20Z" />
      <path d="M32 34v14M26 48h12" />
      <path d="M20 8h24" />
    </>
  ),
  sword: (
    <>
      <path d="M14 50 44 20M44 20l6-6-2 8-8 2-2-4Z" />
      <path d="M12 44l8 8M16 40l-6 6 4 4 6-6" />
    </>
  ),
  wheat: (
    <>
      <path d="M32 56V20" />
      <path d="M32 20c-4-4-4-10 0-14 4 4 4 10 0 14Z" />
      <path d="M32 30c-4-2-9 0-11 4 4 2 9 0 11-4ZM32 30c4-2 9 0 11 4-4 2-9 0-11-4ZM32 42c-4-2-9 0-11 4 4 2 9 0 11-4ZM32 42c4-2 9 0 11 4-4 2-9 0-11-4Z" />
    </>
  ),
};
