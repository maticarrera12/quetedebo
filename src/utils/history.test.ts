import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { saveToHistory } from "./history";

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
};

beforeEach(() => {
  vi.stubGlobal("localStorage", memoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("saveToHistory", () => {
  it("appends the mesa with its settlements and keeps only the friend fields", () => {
    const friends = [
      { id: "a", name: "Ana", expense: 100, concept: "la carne", color: 0 },
      { id: "b", name: "Beto", expense: 0, concept: "", color: 1 },
    ];

    expect(saveToHistory(friends, "Asado")).toBe(true);
    expect(saveToHistory(friends)).toBe(true);

    const stored = JSON.parse(localStorage.getItem("calculation") ?? "[]");

    expect(stored).toHaveLength(2);
    expect(stored[0]).toMatchObject({
      eventName: "Asado",
      totalExpense: 100,
      transactions: ["Beto debe $50.00 a Ana"],
      friends: [
        { name: "Ana", expense: 100, concept: "la carne", color: 0 },
        { name: "Beto", expense: 0, concept: "", color: 1 },
      ],
    });
    expect(stored[0].friends[0]).not.toHaveProperty("id");
    expect(stored[1]).not.toHaveProperty("eventName");
  });

  it("saves nothing when nobody owes anything", () => {
    expect(saveToHistory([{ name: "Ana", expense: 10 }])).toBe(false);
    expect(localStorage.getItem("calculation")).toBeNull();
  });
});
