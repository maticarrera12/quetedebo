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

describe("saveToHistory for one mesa", () => {
  const read = () => JSON.parse(localStorage.getItem("calculation") ?? "[]");

  it("keeps one entry per mesa and updates it as people join", () => {
    saveToHistory([{ name: "Ana", expense: 100 }, { name: "Beto", expense: 0 }], "Asado", "mesa-1");
    saveToHistory(
      [{ name: "Ana", expense: 100 }, { name: "Beto", expense: 0 }, { name: "Caro", expense: 50 }],
      "Asado",
      "mesa-1"
    );

    const stored = read();

    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ mesaId: "mesa-1", eventName: "Asado", totalExpense: 150 });
    expect(stored[0].friends).toHaveLength(3);
  });

  it("updates the entry in place, so other juntadas keep their order", () => {
    const pair = [{ name: "Ana", expense: 10 }, { name: "Beto", expense: 0 }];

    saveToHistory(pair, "Primera", "mesa-1");
    saveToHistory(pair, "Segunda", "mesa-2");
    saveToHistory(pair, "Primera, cambiada", "mesa-1");

    expect(read().map((entry: { eventName: string }) => entry.eventName)).toEqual(["Primera, cambiada", "Segunda"]);
  });

  it("drops the event name when it is cleared", () => {
    const pair = [{ name: "Ana", expense: 10 }, { name: "Beto", expense: 0 }];

    saveToHistory(pair, "Asado", "mesa-1");
    saveToHistory(pair, undefined, "mesa-1");

    expect(read()[0]).not.toHaveProperty("eventName");
  });

  it("leaves the last saved entry alone when nobody owes anything anymore", () => {
    saveToHistory([{ name: "Ana", expense: 10 }, { name: "Beto", expense: 0 }], "Asado", "mesa-1");

    expect(saveToHistory([{ name: "Ana", expense: 10 }], "Asado", "mesa-1")).toBe(false);
    expect(read()[0].friends).toHaveLength(2);
  });

  it("does not touch entries saved before mesas had an id", () => {
    const pair = [{ name: "Ana", expense: 10 }, { name: "Beto", expense: 0 }];

    saveToHistory(pair, "Vieja");
    saveToHistory(pair, "Nueva", "mesa-1");
    saveToHistory(pair, "Nueva", "mesa-1");

    expect(read().map((entry: { eventName: string }) => entry.eventName)).toEqual(["Vieja", "Nueva"]);
  });
});
