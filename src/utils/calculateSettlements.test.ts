import { describe, expect, it } from "vitest";
import type { Friend } from "../types/types";
import { calculateSettlements, getTotalExpense } from "./calculateSettlements";
import { parseSettlement } from "./format";

const friend = (name: string, expense: number): Friend => ({ name, expense });

// Applies every settlement and returns what each friend ends up having put in.
const netAfterSettling = (friends: Friend[]) => {
  const net = new Map(friends.map((f) => [f.name, f.expense]));

  for (const text of calculateSettlements(friends)) {
    const settlement = parseSettlement(text);
    if (!settlement) throw new Error(`Unparseable settlement: ${text}`);
    net.set(settlement.from, (net.get(settlement.from) ?? 0) + settlement.amount);
    net.set(settlement.to, (net.get(settlement.to) ?? 0) - settlement.amount);
  }

  return net;
};

describe("calculateSettlements", () => {
  it("returns nothing for fewer than two friends", () => {
    expect(calculateSettlements([])).toEqual([]);
    expect(calculateSettlements([friend("Ana", 100)])).toEqual([]);
  });

  it("returns nothing when nobody put any money", () => {
    expect(calculateSettlements([friend("Ana", 0), friend("Beto", 0)])).toEqual([]);
  });

  it("returns nothing when everyone put the same", () => {
    expect(
      calculateSettlements([friend("Ana", 50), friend("Beto", 50), friend("Caro", 50)])
    ).toEqual([]);
  });

  it("makes the one who put nothing pay half to the other", () => {
    expect(calculateSettlements([friend("Ana", 100), friend("Beto", 0)])).toEqual([
      "Beto debe $50.00 a Ana",
    ]);
  });

  it("does not lose a cent to floating point (1.15 * 100 is 114.999…)", () => {
    expect(calculateSettlements([friend("Ana", 1.15), friend("Beto", 0)])).toEqual([
      "Beto debe $0.58 a Ana",
    ]);
  });

  it("settles a group with several debtors and creditors", () => {
    const friends = [
      friend("Lucía", 12500),
      friend("Mateo", 3200.5),
      friend("Sofía", 0),
      friend("Tomás", 8000),
    ];

    expect(calculateSettlements(friends)).toEqual([
      "Sofía debe $5925.13 a Lucía",
      "Mateo debe $649.75 a Lucía",
      "Mateo debe $2074.88 a Tomás",
    ]);
  });

  it("matches the asado example: five friends, four payments", () => {
    const friends = [
      friend("Lucía", 28000),
      friend("Tomi", 4500),
      friend("Juli", 15500),
      friend("Nico", 0),
      friend("Caro", 7000),
    ];

    expect(calculateSettlements(friends)).toEqual([
      "Nico debe $11000.00 a Lucía",
      "Tomi debe $6000.00 a Lucía",
      "Tomi debe $500.00 a Juli",
      "Caro debe $4000.00 a Juli",
    ]);
  });

  it("leaves everybody within a cent of an equal share", () => {
    const groups: Friend[][] = [
      [friend("Ana", 100), friend("Beto", 0), friend("Caro", 0)],
      [friend("Ana", 10.01), friend("Beto", 20.02), friend("Caro", 0.03), friend("Dani", 7)],
      [friend("Ana", 1), friend("Beto", 2), friend("Caro", 3), friend("Dani", 4), friend("Eli", 5), friend("Fede", 6), friend("Gus", 7)],
      [friend("Ana María", 1234.56), friend("José", 99.99)],
    ];

    for (const friends of groups) {
      const share = getTotalExpense(friends) / friends.length;

      for (const net of netAfterSettling(friends).values()) {
        expect(Math.abs(net - share)).toBeLessThan(0.02);
      }
    }
  });

  it("never asks someone to pay who already put in more than their share", () => {
    const friends = [friend("Ana", 90), friend("Beto", 30), friend("Caro", 0)];
    const payers = calculateSettlements(friends)
      .map(parseSettlement)
      .map((settlement) => settlement?.from);

    expect(payers).not.toContain("Ana");
  });
});

describe("getTotalExpense", () => {
  it("adds up what everyone put", () => {
    expect(getTotalExpense([friend("Ana", 10.5), friend("Beto", 4.5)])).toBe(15);
    expect(getTotalExpense([])).toBe(0);
  });
});
