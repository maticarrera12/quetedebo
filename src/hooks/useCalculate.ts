import { useState } from "react";
import type { Friend, TransactionResult } from "../types/types";
import { calculateSettlements, getTotalExpense } from "../utils/calculateSettlements";
import { isFriendList } from "../utils/storage";
import { usePersistedState } from "./usePersistedState";

// The table in progress: it must outlive a reload or the system closing the app in the background.
const FRIENDS_KEY = "quetedebo:draft:friends";

interface UseCalculate {
  friends: Friend[];
  transactions: string[];
  addFriend: (name: string, expense: string, concept?: string) => void;
  deleteFriend: (index: number) => void;
  reset: () => void;
  calculateTransactions: (eventName?: string) => void;
}

export const useCalculate = (): UseCalculate => {
  const [friends, setFriends] = usePersistedState<Friend[]>(FRIENDS_KEY, [], isFriendList);
  const [transactions, setTransactions] = useState<string[]>([]);

  const addFriend = (name: string, expense: string, concept = "") => {
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    setFriends((prev) => {
      // Each friend keeps one colour for the whole session, even when others leave.
      const color = prev.length ? Math.max(...prev.map((friend) => friend.color ?? 0)) + 1 : 0;
      const newFriend: Friend = { name: formattedName, expense: Number(expense), concept, color };
      return [...prev, newFriend];
    });
  };

  const deleteFriend = (index: number) => {
    setFriends((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFriends([]);
    setTransactions([]);
  };

  const calculateTransactions = (eventName?: string) => {
    const transactionsCalculated = calculateSettlements(friends);
    if (transactionsCalculated.length === 0) {
      setTransactions([]);
      return;
    }

    const newTransaction: TransactionResult = {
      friends,
      totalExpense: getTotalExpense(friends),
      transactions: transactionsCalculated,
      date: new Date().toLocaleString(),
      ...(eventName ? { eventName } : {}),
    };

    const existing: TransactionResult[] = JSON.parse(
      localStorage.getItem("calculation") || "[]"
    );
    existing.push(newTransaction);
    localStorage.setItem("calculation", JSON.stringify(existing));

    setTransactions(transactionsCalculated);
  };

  return {
    friends,
    transactions,
    addFriend,
    deleteFriend,
    reset,
    calculateTransactions,
  };
};
