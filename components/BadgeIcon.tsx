"use client";

import type { JSX } from "react";

/** Woodcut-style glyphs for badges. Same line language as the choice icons. */
export function BadgeIcon({
  icon,
  className,
  strokeWidth = 2.2,
}: {
  icon: string;
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
      {GLYPHS[icon] ?? GLYPHS.laurel}
    </svg>
  );
}

const dot = (cx: number, cy: number, r = 1.4) => (
  <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

const GLYPHS: Record<string, JSX.Element> = {
  hourglass: (
    <>
      <path d="M20 12h24M20 52h24" />
      <path d="M22 12c0 11 20 18 20 20s-20 9-20 20M42 12c0 11-20 18-20 20s20 9 20 20" />
    </>
  ),
  pig: (
    <>
      <circle cx="32" cy="35" r="15" />
      <ellipse cx="32" cy="39" rx="7" ry="5" />
      {dot(29, 39, 1.3)}
      {dot(35, 39, 1.3)}
      <path d="M20 23l5 5M44 23l-5 5" />
    </>
  ),
  alone: (
    <>
      <path d="M18 52V30a14 14 0 0 1 28 0v22z" />
      <path d="M32 28v12M26 33h12" />
      <path d="M12 52h40" />
    </>
  ),
  candle: (
    <>
      <path d="M26 28h12v22H26z" />
      <path d="M22 50h20" />
      <path d="M32 24c0-5-4-5-4-9 5 2 7 5 7 9a3 3 0 0 1-3 3z" />
    </>
  ),
  plague: (
    <>
      <circle cx="32" cy="32" r="18" />
      <path d="M32 20v24M20 32h24" />
    </>
  ),
  eye: (
    <>
      <path d="M10 32c8-13 36-13 44 0-8 13-36 13-44 0z" />
      <circle cx="32" cy="32" r="6" />
      {dot(32, 32, 1.6)}
    </>
  ),
  ring: (
    <>
      <circle cx="32" cy="39" r="11" />
      <path d="M24 28l8-10 8 10-8 6z" />
    </>
  ),
  cradle: (
    <>
      <path d="M16 30h32v10a9 9 0 0 1-9 9H25a9 9 0 0 1-9-9z" />
      <path d="M14 30c6-6 34-6 36 0" />
      <path d="M28 24l4-8 4 8" />
      <path d="M20 49l-3 5M44 49l3 5" />
    </>
  ),
  sword: (
    <>
      <path d="M32 10v32M24 42h16M28 42v6h8v-6M32 48v6" />
    </>
  ),
  bones: (
    <>
      <path d="M20 20l24 24M44 20L20 44" />
      <circle cx="17" cy="17" r="3.5" />
      <circle cx="24" cy="19" r="3.5" />
      <circle cx="47" cy="17" r="3.5" />
      <circle cx="40" cy="19" r="3.5" />
      <circle cx="17" cy="47" r="3.5" />
      <circle cx="24" cy="45" r="3.5" />
      <circle cx="47" cy="47" r="3.5" />
      <circle cx="40" cy="45" r="3.5" />
    </>
  ),
  witch: (
    <>
      <path d="M32 8c2 8-8 12-8 22a8 8 0 0 0 16 0c0-4-2-6-2-6 4 2 6 6 6 12a12 12 0 0 1-24 0C20 24 30 20 32 8Z" />
      <path d="M14 56h36" />
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
  bolt: <path d="M36 6 16 36h12l-4 22 24-34H34l6-18H36Z" fill="currentColor" stroke="none" />,
  noose: (
    <>
      <path d="M32 8v6M32 14a10 10 0 0 1 0 20 10 10 0 0 1 0-20Z" />
      <path d="M32 34v14M26 48h12" />
      <path d="M20 8h24" />
    </>
  ),
  indulgence: (
    <>
      <path d="M24 22h16v26H24z" />
      <path d="M32 27v9M28 31h8" />
      <path d="M20 16l-4-4M44 16l4-4M32 12V7M14 24H9M55 24h-5" />
    </>
  ),
  laurel: (
    <>
      <path d="M32 54V22" />
      <path d="M24 14c-11 8-11 30 8 38M40 14c11 8 11 30-8 38" />
      <path d="M22 22l4 2M20 30l5 1M22 38l5-1M42 22l-4 2M44 30l-5 1M42 38l-5-1" />
    </>
  ),
  star: (
    <path
      d="M32 8l6 16 17 1-13 11 4 17-14-9-14 9 4-17-13-11 17-1z"
      fill="currentColor"
      stroke="none"
    />
  ),
};
