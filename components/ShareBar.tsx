"use client";

import { useState } from "react";
import type { LifeRecord } from "../lib/engine/types.js";
import type { ParishRecord } from "../lib/content/themes/peasant/record.js";
import { runUrl, ogImagePath } from "../lib/game/share-url.js";
import { threatGlyphs, prettyDate } from "../lib/game/theme-ui.js";
import { event } from "../lib/game/analytics.js";

export function ShareBar({
  life,
  record,
  daily,
  shared = false,
  onAgain,
  onFreeplay,
}: {
  life: LifeRecord;
  record: ParishRecord;
  daily: boolean;
  shared?: boolean;
  onAgain?: () => void;
  onFreeplay?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const name = record.title.replace("The Parish Record of ", "");
  const url = runUrl(life.seed, life.build);
  const isDailySeed = /^\d{4}-\d{2}-\d{2}$/.test(life.seed);
  // Wordle-style, frictionless text share (works with no image).
  const shareText =
    daily && isDailySeed
      ? `A Good Death — ${prettyDate(life.seed)}\n${threatGlyphs(life.seed)}  I lasted to ${record.score}.\nSame world for everyone today. Beat me:`
      : `${name} — dead at ${record.score}. ${record.survivedBy} How long do you last?`;
  const imgPath = ogImagePath(life.seed, life.build);

  const fetchImage = async (): Promise<File | null> => {
    try {
      const blob = await (await fetch(imgPath)).blob();
      return new File([blob], `a-good-death-${record.score}.png`, { type: "image/png" });
    } catch {
      return null;
    }
  };

  const share = async () => {
    setBusy(true);
    event("share", { method: "native", shared });
    try {
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      const file = await fetchImage();
      if (file && nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], text: shareText, url });
        return;
      }
      if (nav.share) {
        await nav.share({ title: "A Good Death", text: shareText, url });
        return;
      }
      await copy();
    } catch {
      /* cancelled */
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setBusy(true);
    event("download_card", { age: record.score });
    try {
      const blob = await (await fetch(imgPath)).blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = `a-good-death-${record.score}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      /* blocked */
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const xIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(url)}`;

  const btn =
    "rounded-sm border px-3 py-3 font-body text-sm font-semibold uppercase tracking-widest transition disabled:opacity-50";
  const primary = "border-rubric bg-rubric text-parchment-light hover:brightness-110";
  const ghost = "border-ink/35 text-ink hover:border-ink/60";

  return (
    <div className="mt-5 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={share} disabled={busy} className={`${btn} ${primary}`}>
          Share
        </button>
        <button onClick={download} disabled={busy} className={`${btn} ${ghost}`}>
          {busy ? "…" : "Download card"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={copy} className={`${btn} ${ghost}`}>
          {copied ? "Copied ✓" : "Copy link"}
        </button>
        <a
          href={xIntent}
          target="_blank"
          rel="noreferrer"
          onClick={() => event("share", { method: "x", shared })}
          className={`${btn} ${ghost} flex items-center justify-center`}
        >
          Post to X
        </a>
      </div>

      {shared ? (
        <a
          href="/"
          className={`${btn} ${primary} flex items-center justify-center`}
        >
          Play your own life →
        </a>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onAgain} className={`${btn} ${ghost}`}>
            {daily ? "Replay today" : "Play again"}
          </button>
          <button onClick={onFreeplay} className={`${btn} ${ghost}`}>
            Freeplay life
          </button>
        </div>
      )}
    </div>
  );
}
