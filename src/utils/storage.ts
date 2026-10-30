import type { Friend } from "../types/types";

// Whatever is in storage was written by an older version, another tab or a person poking at
// DevTools, so a stored value is only used when it has exactly the shape we expect.

export const readStored = <T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const writeStored = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the app keeps working, it just will not remember.
  }
};

export const isString = (value: unknown): value is string => typeof value === "string";

export const isBooleanMap = (value: unknown): value is Record<string, boolean> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((entry) => typeof entry === "boolean");

export const isFriendList = (value: unknown): value is Friend[] =>
  Array.isArray(value) &&
  value.every((friend) => {
    if (typeof friend !== "object" || friend === null) return false;

    const { name, expense, concept, color } = friend as Record<string, unknown>;

    return (
      typeof name === "string" &&
      name.trim() !== "" &&
      typeof expense === "number" &&
      Number.isFinite(expense) &&
      expense >= 0 &&
      (concept === undefined || typeof concept === "string") &&
      (color === undefined || Number.isInteger(color))
    );
  });
