"use client";

import { useEffect } from "react";
import { useGame } from "../lib/game/useGame.js";
import { TitleScreen } from "../components/TitleScreen.js";
import { BuildScreen } from "../components/BuildScreen.js";
import { GachaPull } from "../components/GachaPull.js";
import { YearTicker } from "../components/YearTicker.js";
import { DeathCard } from "../components/DeathCard.js";

export default function Page() {
  const {
    state,
    startDaily,
    startFreeplay,
    startChallenge,
    goHome,
    select,
    allChosen,
    pull,
    startSim,
    finish,
    playAgain,
  } = useGame();

  // Head-to-head challenge: /?seed=YYYY-MM-DD drops you into that exact world.
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("seed");
    if (s && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
      startChallenge(s);
      window.history.replaceState(null, "", "/");
    }
  }, [startChallenge]);

  if (state.phase === "title") {
    return <TitleScreen onDaily={startDaily} onFreeplay={startFreeplay} />;
  }

  return (
    <main className="parchment-grain relative min-h-screen">
      {(state.phase === "build" || state.phase === "pulling") && (
        <BuildScreen
          state={state}
          select={select}
          allChosen={allChosen}
          onPull={pull}
          onHome={goHome}
        />
      )}

      {state.phase === "pulling" && state.gacha && (
        <GachaPull gacha={state.gacha} onBegin={startSim} />
      )}

      {state.phase === "simulating" && state.life && (
        <YearTicker life={state.life} onDone={finish} />
      )}

      {state.phase === "dead" && state.life && (
        <DeathCard
          life={state.life}
          daily={state.daily}
          result={state.result}
          onAgain={playAgain}
          onFreeplay={startFreeplay}
          onHome={goHome}
        />
      )}
    </main>
  );
}
