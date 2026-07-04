"use client";

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
    goHome,
    select,
    allChosen,
    pull,
    startSim,
    finish,
    playAgain,
  } = useGame();

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
