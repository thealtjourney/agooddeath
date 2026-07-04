"use client";

import type { JSX } from "react";

/**
 * Woodcut-style line-art icons for every build choice (trade / village / lord /
 * item) and gacha item, plus a peasant figure. Same visual language as the
 * death-cause icons: viewBox 64, currentColor stroke, minimal fills.
 * These are placeholders for a commissioned/public-domain woodcut set (spec §8).
 */
export function ChoiceIcon({
  id,
  className,
  strokeWidth = 2.1,
}: {
  id: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[id] ?? ICONS._fallback}
    </svg>
  );
}

const dot = (cx: number, cy: number, r = 1.4) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

const ICONS: Record<string, JSX.Element> = {
  _fallback: (
    <>
      <path d="M32 10l18 8v14c0 12-8 20-18 24-10-4-18-12-18-24V18z" />
    </>
  ),

  peasant: (
    <>
      <path d="M32 12c-5 0-8 4-8 8 0 3 1 5 3 7l-9 6v19h28V41l-9-6c2-2 3-4 3-7 0-4-3-8-8-8z" />
      <path d="M24 20c2 3 14 3 16 0" />
      <path d="M20 52v-8M44 52v-8" />
    </>
  ),

  /* ---- Trades ---- */
  blacksmith: (
    <>
      <path d="M14 38h22l-3-6h-7v-4h-9v4h-6z" />
      <path d="M22 38v8h12v-8" />
      <path d="M40 16l10 10M46 12l6 6-12 12-6-6z" />
    </>
  ),
  miller: (
    <>
      <path d="M24 52h16l-4-24h-8z" />
      {dot(32, 24, 2.5)}
      <path d="M32 24 20 14M32 24 44 14M32 24 20 34M32 24 44 34" />
    </>
  ),
  swineherd: (
    <>
      <circle cx="32" cy="35" r="15" />
      <ellipse cx="32" cy="39" rx="7" ry="5" />
      {dot(29, 39, 1.3)}
      {dot(35, 39, 1.3)}
      <path d="M20 23l5 5M44 23l-5 5" />
    </>
  ),
  midwife: (
    <>
      <ellipse cx="32" cy="36" rx="12" ry="15" />
      <circle cx="32" cy="24" r="6" />
      <path d="M22 34h20M22 41h20M24 48h16" />
    </>
  ),
  poacher: (
    <>
      <path d="M26 50c-5 0-9-4-9-10s4-9 9-9 9 3 9 9" />
      <path d="M30 32c-3-8-2-16 1-19M35 32c1-8 3-13 6-15" />
      {dot(24, 40, 1.3)}
    </>
  ),
  gravedigger: (
    <>
      <path d="M40 12l12 12M47 19L27 39l-6-2-1-5z" />
      <path d="M10 52c6-9 16-9 22 0" />
      <path d="M20 46v-9M15 41h10" />
    </>
  ),
  alewife: (
    <>
      <path d="M22 24h16v22a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" />
      <path d="M38 28h6a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-6" />
      <path d="M22 24c0-5 4-8 8-8s8 3 8 8" />
    </>
  ),
  shepherd: (
    <>
      <path d="M16 38c0-6 5-9 11-9s11 3 11 9-5 9-11 9-11-3-11-9z" />
      <path d="M38 36c3-2 7 0 7 4M20 47v4M30 47v4" />
      <path d="M50 14v32M50 14c5 0 8 3 8 8" />
    </>
  ),
  carpenter: (
    <>
      <path d="M12 42l30-16 4 7-30 16z" />
      <path d="M12 42l4 3 2-4 5 3 2-4 5 3 2-4 5 3" />
    </>
  ),
  fool: (
    <>
      <path d="M20 42c-5-13 0-26 12-26s17 13 12 26z" />
      <path d="M18 42h28" />
      <circle cx="15" cy="22" r="3" />
      <circle cx="32" cy="12" r="3" />
      <circle cx="49" cy="22" r="3" />
      <path d="M18 20l-2-3M32 16v-3M46 20l2-3" />
    </>
  ),

  /* ---- Villages ---- */
  coastal: (
    <>
      <path d="M14 38h36l-5 9H19z" />
      <path d="M32 38V16l13 9-13 4" />
      <path d="M10 52c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
    </>
  ),
  forest: (
    <>
      <path d="M22 50V22l-9 14h6l-7 10h20l-7-10h6z" />
      <path d="M42 50V30l-6 9h4l-5 7h14l-5-7h4z" />
    </>
  ),
  castle: (
    <>
      <path d="M16 52V26h32v26M16 26v-6h5v4h6v-4h6v4h6v-4h5v6" />
      <path d="M28 52V40a4 4 0 0 1 8 0v12" />
    </>
  ),
  fen: (
    <>
      <path d="M22 48V22M30 48V18M38 48V24" />
      <rect x="19.5" y="14" width="5" height="9" rx="2.5" />
      <rect x="27.5" y="10" width="5" height="9" rx="2.5" />
      <rect x="35.5" y="16" width="5" height="9" rx="2.5" />
      <path d="M12 52c5-3 10-3 15 0s10 3 15 0" />
    </>
  ),
  market: (
    <>
      <path d="M32 14v36M18 50h28" />
      <path d="M18 22h28" />
      <circle cx="32" cy="14" r="2.5" />
      <path d="M18 22l-5 9h10zM46 22l-5 9h10z" />
    </>
  ),
  upland: (
    <>
      <path d="M8 48l15-24 10 15 6-9 17 18z" />
      <path d="M23 24l4 6M46 30l3 5" />
    </>
  ),

  /* ---- Lords ---- */
  pious: (
    <>
      <path d="M32 12c-7 11-11 15-11 28h22c0-13-4-17-11-28z" />
      <path d="M21 40h22M32 20v10M27 25h10" />
    </>
  ),
  cruel: (
    <>
      <path d="M28 12v42" />
      <path d="M28 16c9-5 18-1 20 9-7-3-14-3-20 3z" />
    </>
  ),
  crusade: (
    <>
      <path d="M20 12v42" />
      <path d="M20 14h24l-7 9 7 9H20" />
      <path d="M30 18v11M25 23h10" />
    </>
  ),
  child: (
    <>
      <path d="M16 42h32l3-20-10 9-9-14-9 14-10-9z" />
      {dot(32, 30, 1.6)}
      {dot(24, 33, 1.4)}
      {dot(40, 33, 1.4)}
    </>
  ),
  dying: (
    <>
      <path d="M20 12h24M20 52h24" />
      <path d="M22 12c0 11 20 18 20 20s-20 9-20 20M42 12c0 11-20 18-20 20s20 9 20 20" />
    </>
  ),
  wealthy: (
    <>
      <path d="M23 28c-5 6-7 15-4 20 3 5 25 5 28 0 3-5 1-14-4-20z" />
      <path d="M25 28l4-7h6l4 7" />
      <circle cx="32" cy="40" r="5" />
      <path d="M32 37v6" />
    </>
  ),

  /* ---- Items ---- */
  boots: (
    <>
      <path d="M24 14v22l-7 5v9h22v-5c0-7-7-7-7-15V14z" />
      <path d="M17 46h22" />
    </>
  ),
  knife: (
    <>
      <path d="M16 48l26-26 3 3-24 27z" />
      <path d="M40 24l6-6 4 4-6 6" />
    </>
  ),
  chicken: (
    <>
      <path d="M25 48c-5 0-9-4-9-10s4-11 11-11c2-6 11-6 13 1 4 0 6 4 3 8" />
      <path d="M39 22l5-5M42 30h7" />
      <path d="M24 48v4M32 49v4" />
      {dot(30, 30, 1.3)}
    </>
  ),
  cloak: (
    <>
      <path d="M32 14c-8 0-13 6-13 6l-5 30h36l-5-30s-5-6-13-6z" />
      <path d="M22 20c3-5 17-5 20 0M32 20v30" />
    </>
  ),
  horseshoe: (
    <>
      <path d="M20 46c-5-9-4-22 4-28s21-2 20 11c0 6-2 12-4 17" />
      {dot(22, 44, 1.3)}
      {dot(42, 44, 1.3)}
      {dot(20, 34, 1.3)}
    </>
  ),
  bucket: (
    <>
      <path d="M18 28h28l-4 24H22z" />
      <path d="M20 28c0-8 24-8 24 0" />
      <path d="M14 28h36" />
    </>
  ),
  salt: (
    <>
      <path d="M12 50h40L32 22z" />
      <path d="M32 22V12M26 16l-3-3M38 16l3-3" />
      {dot(28, 44, 1.3)}
      {dot(36, 44, 1.3)}
      {dot(32, 38, 1.3)}
    </>
  ),
  dog: (
    <>
      <path d="M16 46V30l5-5 4 5h11l4-5 5 5v16" />
      <ellipse cx="46" cy="26" rx="6" ry="5" />
      <path d="M46 18v6M20 46v4M40 46v4" />
      {dot(47, 25, 1.2)}
    </>
  ),

  /* ---- Gacha ---- */
  turnip: (
    <>
      <path d="M32 24c-9 0-13 7-13 13s6 11 13 11 13-4 13-11-4-13-13-13z" />
      <path d="M28 24c0-6 2-10 4-12M36 24c0-6-2-10-4-12" />
    </>
  ),
  turnip2: (
    <>
      <path d="M32 26c-8 0-12 6-12 12s5 10 12 10 12-3 12-10-4-12-12-12z" />
      <path d="M28 26c0-5 2-9 4-11M36 26c0-5-2-9-4-11" />
      <path d="M46 16l1.5 3 3 .5-2.5 2 .5 3-2.5-1.5L43 27l.5-3L41 22l3-.5z" />
    </>
  ),
  spoon: (
    <>
      <ellipse cx="38" cy="20" rx="8" ry="10" />
      <path d="M34 29 20 50" />
    </>
  ),
  candle: (
    <>
      <path d="M26 28h12v22H26z" />
      <path d="M22 50h20" />
      <path d="M32 28v-4" />
      <path d="M32 24c0-5-4-5-4-9 5 2 7 5 7 9a3 3 0 0 1-3 3z" />
    </>
  ),
  goose: (
    <>
      <path d="M42 20c-6 0-10 4-10 10 0 9-9 8-9 17h25c0-6-2-10-6-13 4-2 4-8 0-11" />
      <path d="M44 22l5-3M23 47c-3 3-3 5-3 5" />
      {dot(40, 24, 1.3)}
    </>
  ),
  barrel: (
    <>
      <path d="M20 18h24c4 8 4 20 0 28H20c-4-8-4-20 0-28z" />
      <path d="M17 26h30M17 38h30M32 18v28" />
    </>
  ),
  donkey: (
    <>
      <path d="M20 48V32l6-7 4 5h9l6-9v27" />
      <path d="M45 21l2-9M50 22l4-8" />
      <path d="M22 48v3M42 48v3" />
      {dot(30, 30, 1.3)}
    </>
  ),
  monk: (
    <>
      <path d="M32 12c-8 0-12 8-12 15 0 4 2 7 4 9l-4 14h24l-4-14c2-2 4-5 4-9 0-7-4-15-12-15z" />
      <circle cx="32" cy="27" r="6" />
      <path d="M32 40v10" />
    </>
  ),
  longbow: (
    <>
      <path d="M22 12c13 8 13 32 0 40" />
      <path d="M22 12v40" />
      <path d="M18 32h30M43 27l7 5-7 5" />
    </>
  ),
  deed: (
    <>
      <path d="M22 18h18a4 4 0 0 1 4 4v22H26a4 4 0 0 1-4-4z" />
      <path d="M40 18a4 4 0 0 1 4 4M22 44a4 4 0 0 0 4-4V22" />
      <path d="M28 28h10M28 34h10" />
      <circle cx="34" cy="46" r="3" />
    </>
  ),
  finesword: (
    <>
      <path d="M32 10v32M24 42h16M28 42v6h8v-6M32 48v6" />
      <path d="M44 16l1.5 3.5 3.5 1-3.5 1L44 25l-1.5-3.5L39 20.5l3.5-1z" />
    </>
  ),
  bezoar: (
    <>
      <circle cx="32" cy="34" r="15" />
      <path d="M24 30c3 5 9 6 14 2M22 39c5 3 12 0 14-5" />
    </>
  ),
  pardon: (
    <>
      <path d="M22 24h20v24H22z" />
      <path d="M24 24l2-9 6 6 6-6 2 9" />
      <path d="M28 32h8M28 38h8" />
      <circle cx="32" cy="47" r="3" />
    </>
  ),
  indulgence: (
    <>
      <path d="M24 22h16v26H24z" />
      <path d="M32 27v9M28 31h8" />
      <path d="M20 16l-4-4M44 16l4-4M32 12V7M14 24H9M55 24h-5" />
    </>
  ),
};
