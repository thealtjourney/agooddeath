import type { Metadata } from "next";
import { NavBar } from "../../components/NavBar.js";

export const metadata: Metadata = {
  title: "Privacy — A Good Death",
  description: "How A Good Death handles your data. Short version: barely at all.",
};

export default function PrivacyPage() {
  return (
    <main className="parchment-grain relative min-h-screen">
      <NavBar />
      <article className="mx-auto max-w-2xl px-6 py-10 font-body text-[15px] leading-relaxed text-ink-soft">
        <h1 className="font-black text-4xl text-ink">Privacy</h1>
        <p className="mt-2 text-ink-faded">Last updated: July 2026</p>

        <p className="mt-6">
          A Good Death is a free browser game with no accounts and no sign-up.
          The short version: we collect as little as possible, and none of it
          identifies you personally.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">What&rsquo;s stored in your browser</h2>
        <p className="mt-2">
          To remember your progress between visits, the game keeps a few things in
          your browser&rsquo;s local storage: a random anonymous id (a string of
          characters, not linked to any personal information), your best age,
          daily streak, badges earned, and an optional display name you choose.
          This never leaves your device except as described below, and you can
          erase all of it by clearing your browser&rsquo;s site data.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">The leaderboard</h2>
        <p className="mt-2">
          When you play a daily run, we send that run to our server so it can
          appear on the public parish register: your anonymous id, the optional
          display name you chose, the peasant you built, and the age you reached.
          There is no real-world identity attached. If you don&rsquo;t enter a
          name, you appear as &ldquo;A Nameless Peasant.&rdquo;
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">Analytics</h2>
        <p className="mt-2">
          We use privacy-friendly, aggregate analytics to understand traffic (how
          many people visit and play). It does not build a profile of you or
          follow you around the web.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">Advertising</h2>
        <p className="mt-2">
          The game may in future show a small number of ads to cover its costs.
          If and when advertising is enabled, third-party ad providers may use
          cookies, and where the law requires it we will ask for your consent
          first. Advertising is not enabled at the time of writing.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">Contact</h2>
        <p className="mt-2">
          Questions about your data can be sent to the operator of agooddeath.app.
          We don&rsquo;t sell your data, because we barely have any.
        </p>
      </article>
    </main>
  );
}
