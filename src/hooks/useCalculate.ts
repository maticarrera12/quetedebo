import { useState } from "react";
import type { Friend, TransactionResult } from "../types/types";

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
    const totalExpense = friends.reduce(
      (total, friend) => total + friend.expense,
      0
    );
    const avgExpense = totalExpense / friends.length;

    const differences = friends.map((friend) => ({
      name: friend.name,
      difference: friend.expense - avgExpense,
    }));

    const debtors = differences.filter((d) => d.difference < 0);
    const creditors = differences.filter((d) => d.difference > 0);

    const transactionsCalculated: string[] = [];

    debtors.forEach((debtor) => {
      let debt = Math.abs(debtor.difference);
      creditors.forEach((creditor) => {
        if (debt > 0 && creditor.difference > 0) {
          const pay = Math.min(debt, creditor.difference);
          transactionsCalculated.push(
            `${debtor.name} debe $${pay.toFixed(2)} a ${creditor.name}`
          );
          debt -= pay;
          creditor.difference -= pay;
        }
      });
    });

    const newTransaction: TransactionResult = {
      friends,
      totalExpense,
      transactions: transactionsCalculated,
      date: new Date().toLocaleString(),
    };

    const existing: TransactionResult[] = JSON.parse(localStorage.getItem("calculation") || "[]");
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
