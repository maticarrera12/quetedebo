import type { Friend, TransactionResult } from "../types/types";
import { calculateSettlements, getTotalExpense } from "./calculateSettlements";

const HISTORY_KEY = "calculation";

// Appends a finished mesa to this device's history. Returns false when there is nothing to
// settle, because a mesa where nobody owes anything is not worth keeping.
export const saveToHistory = (friends: Friend[], eventName?: string): boolean => {
  const transactions = calculateSettlements(friends);
  if (transactions.length === 0) return false;

  const entry: TransactionResult = {
    // Only the fields the history knows: a shared mesa carries server ids it does not need.
    friends: friends.map(({ name, expense, concept, color }) => ({ name, expense, concept, color })),
    totalExpense: getTotalExpense(friends),
    transactions,
    date: new Date().toLocaleString(),
    ...(eventName ? { eventName } : {}),
  };

  try {
    const existing: TransactionResult[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    existing.push(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
};
