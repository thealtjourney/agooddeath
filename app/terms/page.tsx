import type { Metadata } from "next";
import { NavBar } from "../../components/NavBar.js";

export const metadata: Metadata = {
  title: "Terms — A Good Death",
  description: "Terms of use for A Good Death.",
};

export default function TermsPage() {
  return (
    <main className="parchment-grain relative min-h-screen">
      <NavBar />
      <article className="mx-auto max-w-2xl px-6 py-10 font-body text-[15px] leading-relaxed text-ink-soft">
        <h1 className="font-black text-4xl text-ink">Terms of Use</h1>
        <p className="mt-2 text-ink-faded">Last updated: July 2026</p>

        <p className="mt-6">
          A Good Death is provided free of charge for entertainment. By playing,
          you agree to the following, which we&rsquo;ve tried to keep short and
          human.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">It&rsquo;s all fiction</h2>
        <p className="mt-2">
          Every peasant, village, lord, event and death in the game is fictional.
          Any resemblance to real people, living or long-dead, is coincidental and
          played for deadpan comedy. Nothing here is historical advice, and no
          real individuals or groups are targeted.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">Fair play</h2>
        <p className="mt-2">
          Please don&rsquo;t attempt to cheat, spam or manipulate the leaderboard,
          and don&rsquo;t submit offensive display names. Scores are verified
          server-side, and names that break these rules may be moderated or
          removed without notice.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">No warranty</h2>
        <p className="mt-2">
          The game is provided &ldquo;as is,&rdquo; without warranties of any kind.
          It may change, break, or disappear at any time. To the fullest extent
          permitted by law, the operator is not liable for any loss arising from
          your use of it — though we&rsquo;re sorry if your peasant dies at
          fourteen.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">Ownership</h2>
        <p className="mt-2">
          The game, its writing, and its artwork belong to the operator of
          agooddeath.app. You&rsquo;re welcome to share your results and screenshots
          freely.
        </p>

        <h2 className="mt-8 font-black text-xl text-ink">Changes</h2>
        <p className="mt-2">
          These terms may be updated from time to time. Continuing to play means
          you accept the current version.
        </p>
      </article>
    </main>
  );
}
