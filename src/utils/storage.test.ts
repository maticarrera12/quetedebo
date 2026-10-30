import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isBooleanMap, isFriendList, isString, readStored, writeStored } from "./storage";

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

describe("isFriendList", () => {
  it("accepts the shape the app writes, with or without the optional fields", () => {
    expect(isFriendList([])).toBe(true);
    expect(isFriendList([{ name: "Ana", expense: 10 }])).toBe(true);
    expect(isFriendList([{ name: "Ana", expense: 0, concept: "la carne", color: 2 }])).toBe(true);
  });

  it("rejects anything that could crash the page or print nonsense", () => {
    expect(isFriendList(null)).toBe(false);
    expect(isFriendList({ name: "Ana" })).toBe(false);
    expect(isFriendList([{ name: "", expense: 1 }])).toBe(false);
    expect(isFriendList([{ name: "Ana", expense: "10" }])).toBe(false);
    expect(isFriendList([{ name: "Ana", expense: -5 }])).toBe(false);
    expect(isFriendList([{ name: "Ana", expense: Number.NaN }])).toBe(false);
    expect(isFriendList([{ name: "Ana", expense: 1, color: 1.5 }])).toBe(false);
    expect(isFriendList([{ name: "Ana", expense: 1, concept: 7 }])).toBe(false);
    expect(isFriendList([{ name: "Ana", expense: 1 }, null])).toBe(false);
  });
});

describe("isBooleanMap and isString", () => {
  it("accepts only a plain map of booleans", () => {
    expect(isBooleanMap({})).toBe(true);
    expect(isBooleanMap({ "a>b:10": true, "c>d:5": false })).toBe(true);
    expect(isBooleanMap({ "a>b:10": "yes" })).toBe(false);
    expect(isBooleanMap([])).toBe(false);
    expect(isBooleanMap(null)).toBe(false);
  });

  it("accepts only strings", () => {
    expect(isString("Asado")).toBe(true);
    expect(isString(3)).toBe(false);
  });
});

describe("readStored and writeStored", () => {
  it("round-trips a valid value", () => {
    writeStored("k", [{ name: "Ana", expense: 12.5 }]);

    expect(readStored("k", [], isFriendList)).toEqual([{ name: "Ana", expense: 12.5 }]);
  });

  it("returns the fallback when nothing is stored", () => {
    expect(readStored("missing", "fallback", isString)).toBe("fallback");
  });

  it("returns the fallback for corrupted JSON instead of throwing", () => {
    localStorage.setItem("k", "{not json");

    expect(readStored("k", [], isFriendList)).toEqual([]);
  });

  it("returns the fallback when the stored value has the wrong shape", () => {
    localStorage.setItem("k", JSON.stringify({ friends: "nope" }));

    expect(readStored("k", [], isFriendList)).toEqual([]);
  });

  it("survives a storage that throws, on read and on write", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("full");
      },
    });

    expect(readStored("k", "fallback", isString)).toBe("fallback");
    expect(() => writeStored("k", "x")).not.toThrow();
  });
});
