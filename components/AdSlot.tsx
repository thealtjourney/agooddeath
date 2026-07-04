"use client";

import { useEffect } from "react";

/**
 * A single, unobtrusive AdSense unit. Renders NOTHING unless both
 * NEXT_PUBLIC_ADSENSE_ID and NEXT_PUBLIC_ADSENSE_SLOT are set — so ads (and the
 * cookies they bring) are entirely off by default until you enable them.
 */
export function AdSlot() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= []).push({});
    } catch {
      /* ad blocker or not yet loaded */
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <ins
      className="adsbygoogle mx-auto mt-6 block"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
