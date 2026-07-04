"use client";

import { useReducer, useCallback } from "react";
import { simulate } from "../engine/simulate.js";
import type { Build, GachaOption, LifeRecord } from "../engine/types.js";
import { theme, pullGacha, makeRng, dailySeed } from "./theme-ui.js";
import { recordResult } from "./stats-store.js";
import { event } from "./analytics.js";

export type Phase = "title" | "build" | "pulling" | "simulating" | "dead";

export interface RunResult {
  isNewBest: boolean;
  streak: number;
  bestAge: number;
  dailyAttempts: number;
  dailyBest: number;
  dailyBeaten: boolean;
}

export interface GameState {
  phase: Phase;
  seed: string;
  daily: boolean;
  selections: Record<string, string>;
  gacha?: GachaOption;
  life?: LifeRecord;
  result?: RunResult;
}

type Action =
  | { type: "start"; daily: boolean; seed: string }
  | { type: "home" }
  | { type: "select"; slot: string; optionId: string }
  | { type: "pull"; gacha: GachaOption }
  | { type: "startSim"; life: LifeRecord }
  | { type: "finish"; result: RunResult };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return {
        phase: "build",
        seed: action.seed,
        daily: action.daily,
        selections: {},
        gacha: undefined,
        life: undefined,
        result: undefined,
      };
    case "home":
      return { ...state, phase: "title", selections: {}, gacha: undefined, life: undefined };
    case "select":
      return {
        ...state,
        selections: { ...state.selections, [action.slot]: action.optionId },
      };
    case "pull":
      return { ...state, phase: "pulling", gacha: action.gacha };
    case "startSim":
      return { ...state, phase: "simulating", life: action.life };
    case "finish":
      return { ...state, phase: "dead", result: action.result };
  }
}

function initState(): GameState {
  return { phase: "title", seed: dailySeed(), daily: true, selections: {} };
}

function freeSeed(): string {
  return `free-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  const startDaily = useCallback(
    () => dispatch({ type: "start", daily: true, seed: dailySeed() }),
    [],
  );
  const startFreeplay = useCallback(
    () => dispatch({ type: "start", daily: false, seed: freeSeed() }),
    [],
  );
  const goHome = useCallback(() => dispatch({ type: "home" }), []);

  const select = useCallback(
    (slot: string, optionId: string) => dispatch({ type: "select", slot, optionId }),
    [],
  );

  const allChosen = theme.slots.every((s) => Boolean(state.selections[s.id]));

  const pull = useCallback(() => {
    const rng = makeRng(`pull:${Date.now()}:${Math.floor(Math.random() * 1e9)}`);
    const gacha = pullGacha(rng);
    event("gacha_pull", { rarity: gacha.rarity, id: gacha.id });
    dispatch({ type: "pull", gacha });
  }, []);

  const startSim = useCallback(() => {
    if (!state.gacha) return;
    const build: Build = { choices: { ...state.selections }, gachaId: state.gacha.id };
    const life = simulate(build, state.seed, theme);
    event("run_started", { ...build.choices, gacha: build.gachaId, daily: state.daily });
    dispatch({ type: "startSim", life });
  }, [state.gacha, state.selections, state.seed, state.daily]);

  const finish = useCallback(() => {
    const life = state.life;
    if (!life) return;
    event("run_completed", {
      age: life.ageAtDeath,
      cause: life.deathCauseId,
      good: life.goodDeath,
      daily: state.daily,
    });
    const { stats, isNewBest, dailyBeaten } = recordResult({
      age: life.ageAtDeath,
      dailyDate: state.daily ? state.seed : undefined,
    });
    dispatch({
      type: "finish",
      result: {
        isNewBest,
        streak: stats.streak,
        bestAge: stats.bestAge,
        dailyAttempts: stats.dailyAttempts,
        dailyBest: stats.dailyBest,
        dailyBeaten,
      },
    });
  }, [state.life, state.daily, state.seed]);

  const playAgain = useCallback(
    () =>
      dispatch({
        type: "start",
        daily: state.daily,
        seed: state.daily ? dailySeed() : freeSeed(),
      }),
    [state.daily],
  );

  return {
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
  };
}
