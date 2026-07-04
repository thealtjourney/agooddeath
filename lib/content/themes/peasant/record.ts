import type { LifeRecord } from "../../../engine/types.js";

export interface ParishRecord {
  title: string;
  lines: string[]; // "Age 14: survived the sweating sickness."
  deathLine: string; // "Age 31: died of dysentery..."
  survivedBy: string; // always begins "Survived by..."
  score: number; // age at death
  goodDeath: boolean;
  savedNote?: string;
}

/**
 * Renders the LifeRecord as a parish register. Template-driven, NOT LLM —
 * zero marginal cost, zero latency, fully controlled tone.
 */
export function renderParishRecord(life: LifeRecord): ParishRecord {
  const lines = life.events
    .filter((e) => e.age < life.ageAtDeath || e.eventId !== life.deathCauseId)
    .map((e) => `Age ${e.age}: ${e.text}`);

  const deathLine = `Age ${life.ageAtDeath}: ${life.deathText}`;

  const survivedBy = buildSurvivedBy(life);

  const savedNote = life.savedBy
    ? SAVE_NOTES[life.savedBy] ?? "Something intervened. Best not to ask."
    : undefined;

  return {
    title: `The Parish Record of ${life.name}`,
    lines,
    deathLine,
    survivedBy,
    score: life.ageAtDeath,
    goodDeath: life.goodDeath,
    savedNote,
  };
}

const SAVE_NOTES: Record<string, string> = {
  indulgence: "A papal indulgence was produced. Death was, on this occasion, refunded.",
  bezoar: "The bezoar stone did its one job and was never spoken of again.",
  pardon: "A royal pardon arrived, damp but valid.",
  horseshoe: "The horseshoe held. Fortune, this once, looked the other way.",
};

function buildSurvivedBy(life: LifeRecord): string {
  const parts: string[] = [];
  const kids = life.stats.childrenSurvived;
  const married = life.flags.includes("married");

  if (married) parts.push("Agnes");
  if (kids === 1) parts.push("one child");
  else if (kids > 1) parts.push(`${kids} children`);

  // running gag: the pig
  const hasPig = life.build.gachaId === "goose" ? false : true;
  if (parts.length === 0) {
    return hasPig
      ? "Survived by no one. Even the pig looked relieved."
      : "Survived by no one at all.";
  }
  parts.push("the pig");
  return `Survived by ${joinList(parts)}.`;
}

function joinList(items: string[]): string {
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
