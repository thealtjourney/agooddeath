/**
 * Minimal display-name hygiene for the public board. Not exhaustive — a basic
 * guard so the leaderboard stays broadly clean. Swap for a proper moderation
 * service if abuse becomes a problem.
 */
const DEFAULT_NAME = "A Nameless Peasant";
const BANNED = [
  "fuck", "shit", "cunt", "nigger", "faggot", "rape", "nazi", "hitler",
  "bitch", "whore", "slut", "retard",
];

export function cleanName(raw: unknown): string {
  if (typeof raw !== "string") return DEFAULT_NAME;
  let name = raw.trim().replace(/[^\p{L}\p{N} '\-]/gu, "");
  name = name.replace(/\s+/g, " ").slice(0, 20);
  if (name.length < 2) return DEFAULT_NAME;
  const lower = name.toLowerCase().replace(/[^a-z]/g, "");
  if (BANNED.some((b) => lower.includes(b))) return DEFAULT_NAME;
  return name;
}
