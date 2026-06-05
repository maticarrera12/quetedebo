import { useState } from "react";
import type { Friend, TransactionResult } from "../types/types";
import { calculateSettlements, getTotalExpense } from "../utils/calculateSettlements";

interface UseCalculate {
  friends: Friend[];
  transactions: string[];
  addFriend: (name: string, expense: string) => void;
  deleteFriend: (index: number) => void;
  reset: () => void;
  calculateTransactions: () => void;
}

export const useCalculate = (): UseCalculate => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [transactions, setTransactions] = useState<string[]>([]);

  const addFriend = (name: string, expense: string) => {
    const formattedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const newFriend: Friend = { name: formattedName, expense: Number(expense) };
    setFriends((prev) => [...prev, newFriend]);
  };

  const deleteFriend = (index: number) => {
    setFriends((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFriends([]);
    setTransactions([]);
  };

  const calculateTransactions = () => {
    const transactionsCalculated = calculateSettlements(friends);
    if (transactionsCalculated.length === 0) return;

    const newTransaction: TransactionResult = {
      friends,
      totalExpense: getTotalExpense(friends),
      transactions: transactionsCalculated,
      date: new Date().toLocaleString(),
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
