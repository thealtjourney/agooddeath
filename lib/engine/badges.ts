/**
 * Badge evaluation. Pure and deterministic: the set of badges a run earns is a
 * function of its LifeRecord alone. This is what a server re-runs (via
 * simulate(build, seed) -> awardBadges) to verify an unlock before counting it
 * toward global rarity — so rarity percentages can't be forged.
 */
import type { BadgeDef, LifeRecord } from "./types.js";

export function awardBadges(life: LifeRecord, badges: BadgeDef[]): string[] {
  const out: string[] = [];
  for (const b of badges) {
    try {
      if (b.predicate(life)) out.push(b.id);
    } catch {
      /* a bad predicate should never crash a run */
    }
  }
  return out;
}

/** Convenience predicates for badge authors. */
export function hasEvent(life: LifeRecord, eventId: string): boolean {
  return life.events.some((e) => e.eventId === eventId);
}

export function survivedEvent(life: LifeRecord, eventId: string): boolean {
  // event happened but was not the cause of death
  return hasEvent(life, eventId) && life.deathCauseId !== eventId;
}
