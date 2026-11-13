import type { Friend } from "../types/types";

const moneyFormat = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const HUES = [70, 150, 250, 330, 200, 30, 110, 290];

export const money = (amount: number): string => `$${moneyFormat.format(amount)}`;

export const initialOf = (name: string): string => name.trim().charAt(0).toUpperCase();

// Accepts how people type pesos in Argentina: dots for thousands, comma for decimals.
export const parseAmount = (text: string): number =>
  parseFloat(text.replace(/\./g, "").replace(",", ".")) || 0;

// How a name is shown at the table: "lUCÍA" sits down as "Lucía".
export const formatName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

// The inverse of parseAmount, to put an amount back in the field when someone edits it.
export const amountInput = (amount: number): string => (amount ? String(amount).replace(".", ",") : "");

export const personColor =(friends: Friend[], name: string): string => {
  const index = friends.findIndex((friend) => friend.name === name);
  const slot = friends[index]?.color ?? Math.max(index, 0);
  return `oklch(0.8 0.12 ${HUES[slot % HUES.length]})`;
};

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

// Settlements are persisted as sentences by calculateSettlements; read them back for display.
export const parseSettlement = (text: string): Settlement | null => {
  const match = text.match(/^(.+) debe \$(\d+(?:\.\d+)?) a (.+)$/);
  if (!match) return null;
  return { from: match[1], amount: Number(match[2]), to: match[3] };
};
