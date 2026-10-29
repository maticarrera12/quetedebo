import { describe, expect, it } from "vitest";
import { initialOf, money, parseAmount, parseSettlement, personColor } from "./format";

describe("parseAmount", () => {
  it("reads Argentine formatting: dots for thousands, comma for decimals", () => {
    expect(parseAmount("28000")).toBe(28000);
    expect(parseAmount("28.000")).toBe(28000);
    expect(parseAmount("1.200,50")).toBe(1200.5);
    expect(parseAmount("1200,50")).toBe(1200.5);
  });

  it("treats empty or non-numeric input as zero", () => {
    expect(parseAmount("")).toBe(0);
    expect(parseAmount("abc")).toBe(0);
  });
});

describe("money", () => {
  it("formats with Argentine separators and always two decimals", () => {
    expect(money(5925.125)).toBe("$5.925,13");
    expect(money(0)).toBe("$0,00");
    expect(money(23700.5)).toBe("$23.700,50");
  });
});

describe("parseSettlement", () => {
  it("reads the sentence calculateSettlements saves", () => {
    expect(parseSettlement("Sofía debe $5925.13 a Lucía")).toEqual({
      from: "Sofía",
      to: "Lucía",
      amount: 5925.13,
    });
  });

  it("keeps names with spaces and accents", () => {
    expect(parseSettlement("Ana María debe $10.50 a José Luis")).toEqual({
      from: "Ana María",
      to: "José Luis",
      amount: 10.5,
    });
  });

  it("returns null for anything else", () => {
    expect(parseSettlement("hola")).toBeNull();
    expect(parseSettlement("")).toBeNull();
  });
});

describe("initialOf", () => {
  it("uppercases the first letter and ignores surrounding spaces", () => {
    expect(initialOf("  lucía")).toBe("L");
  });
});

describe("personColor", () => {
  const friends = [
    { name: "Ana", expense: 1, color: 0 },
    { name: "Beto", expense: 1, color: 1 },
    { name: "Caro", expense: 1 },
  ];

  it("gives different friends different colours", () => {
    expect(personColor(friends, "Ana")).not.toBe(personColor(friends, "Beto"));
  });

  it("keeps a friend's stored colour slot when others leave", () => {
    const afterAnaLeaves = friends.slice(1);

    expect(personColor(afterAnaLeaves, "Beto")).toBe(personColor(friends, "Beto"));
  });

  it("falls back to list position for older saved friends", () => {
    expect(personColor(friends, "Caro")).toMatch(/^oklch\(/);
  });
});
