import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "../../components/NavBar.js";
import { ChoiceIcon } from "../../components/ChoiceIcon.js";
import { WoodcutIcon } from "../../components/WoodcutIcon.js";
import { Flourish } from "../../components/Flourish.js";

export const metadata: Metadata = {
  title: "How it works — A Good Death",
  description:
    "How to play A Good Death: build a medieval peasant, live out their years through plague, famine and feudal justice, and share the parish record of how long you survived.",
};

function Step({
  icon,
  n,
  title,
  children,
}: {
  icon: React.ReactNode;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-3 font-black text-lg text-ink">
        <span className="text-rubric">{n}.</span> {title}
      </h3>
      <p className="mt-1 font-body text-[14px] leading-snug text-ink-faded">{children}</p>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-ink/15 px-4 py-3">
      <h3 className="font-body text-[15px] font-semibold text-ink">{q}</h3>
      <p className="mt-1 font-body text-[14px] leading-relaxed text-ink-faded">{children}</p>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="parchment-grain relative min-h-screen">
      <NavBar />

      <section className="mx-auto max-w-3xl px-6 pb-12 pt-10">
        <h1 className="text-center font-black text-4xl text-ink">How it works</h1>
        <Flourish className="mb-8 mt-4" />

        <div className="grid gap-6 sm:grid-cols-3">
          <Step icon={<ChoiceIcon id="peasant" className="h-12 w-12 text-ink/80" />} n="I" title="Build a peasant">
            Four choices and one lucky draw of fate. Every pick shifts your odds
            in the medieval meat-grinder.
          </Step>
          <Step icon={<WoodcutIcon category="the_pestilence" className="h-12 w-12 text-ink/80" />} n="II" title="Watch them die">
            Live year by year through plague, famine, war and the occasional
            falling hay cart. Most peasants don&rsquo;t see forty.
          </Step>
          <Step icon={<WoodcutIcon category="old_age" className="h-12 w-12 text-ink/80" />} n="III" title="Share the record">
            Get an illuminated parish record of your life and death. Compare your
            age with the world, and dare your friends to last longer.
          </Step>
        </div>
      </section>

      <Flourish className="pb-10" />

      <section className="mx-auto max-w-2xl px-6 pb-14">
        <div className="space-y-5 font-body text-[15px] leading-relaxed text-ink-soft">
          <h2 className="font-black text-2xl text-ink">
            How long would you survive medieval England?
          </h2>
          <p>
            <span className="rubric-cap">A</span> Good Death is a free browser game
            about surviving the Middle Ages as an ordinary English peasant. You
            build a life from a trade, a village, a lord and a single lucky
            possession, then watch it play out through a world of dysentery, bad
            harvests, feudal justice and the Black Death. Your score is simply how
            old you manage to get — and dying peacefully in bed of old age is the
            rarest achievement of all.
          </p>
          <p>
            Every day brings a new shared seed: the same world for everyone, so a
            plague year is a plague year for the whole parish. The same choices in
            a different year, or different choices in the same year, tell a very
            different tale. There are no accounts to make and nothing to buy — just
            a quick, funny, faintly grim reminder of how brutal, and how strangely
            survivable, medieval life could be.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Faq q="Is A Good Death free?">
            Yes — completely free, no account, no cost. It runs in any modern
            browser on phone or desktop.
          </Faq>
          <Faq q="How do you play?">
            Pick a trade, a village, a lord and an item, then draw one random piece
            of fortune. Your peasant lives out their years and eventually dies; you
            get a shareable parish record and a score, which is their age at death.
          </Faq>
          <Faq q="What is a 'good death'?">
            Reaching seventy or more and dying quietly in bed. In a world of plague
            and hay carts it&rsquo;s a genuine rarity — only a lucky few manage it.
          </Faq>
          <Faq q="Is it historically accurate?">
            It&rsquo;s played for deadpan laughs rather than as a textbook, but the
            trades, illnesses, taxes and calamities are all rooted in real medieval
            English life. Everything is fictional — no real people are named.
          </Faq>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="rounded-sm border border-rubric bg-rubric px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-parchment-light hover:brightness-110"
          >
            Play today&rsquo;s life →
          </Link>
        </div>
      </section>
    </main>
  );
}
