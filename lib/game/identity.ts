"use client";

/** Anonymous, local-only identity for the leaderboard — no login required. */
const ID_KEY = "agd:anon:v1";
const NAME_KEY = "agd:name:v1";

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `a-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Per-page fallback so a device with localStorage blocked still gets a UNIQUE
// id (never an empty string), so two such devices can never collide into one row.
let memoryId: string | null = null;

export function getAnonId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(ID_KEY);
    if (!id) {
      id = newId();
      window.localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    if (!memoryId) memoryId = newId();
    return memoryId;
  }
}

export function getName(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setName(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NAME_KEY, name.slice(0, 20));
  } catch {
    /* ignore */
  }
}
