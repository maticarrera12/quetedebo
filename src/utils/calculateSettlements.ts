import type { Friend } from "../types/types";

interface Balance {
  name: string;
  cents: number;
}

const toCents = (amount: number) => Math.round(amount * 100);

const formatMoney = (cents: number) => (cents / 100).toFixed(2);

export const calculateSettlements = (friends: Friend[]): string[] => {
  if (friends.length < 2) return [];

  const totalCents = friends.reduce((sum, friend) => sum + toCents(friend.expense), 0);
  if (totalCents === 0) return [];

  const avgCents = totalCents / friends.length;

  const balances: Balance[] = friends
    .map((friend) => ({
      name: friend.name,
      cents: toCents(friend.expense) - avgCents,
    }))
    .filter((balance) => Math.abs(balance.cents) >= 1)
    .sort((a, b) => a.cents - b.cents);

  const transactions: string[] = [];
  let debtorIndex = 0;
  let creditorIndex = balances.length - 1;

  while (debtorIndex < creditorIndex) {
    const debtor = balances[debtorIndex];
    const creditor = balances[creditorIndex];

    const payCents = Math.round(Math.min(-debtor.cents, creditor.cents));

    if (payCents < 1) {
      debtorIndex++;
      creditorIndex--;
      continue;
    }

    transactions.push(
      `${debtor.name} debe $${formatMoney(payCents)} a ${creditor.name}`
    );

    debtor.cents += payCents;
    creditor.cents -= payCents;

    if (Math.abs(debtor.cents) < 1) debtorIndex++;
    if (Math.abs(creditor.cents) < 1) creditorIndex--;
  }

  return transactions;
};

export const getTotalExpense = (friends: Friend[]): number =>
  friends.reduce((sum, friend) => sum + friend.expense, 0);
