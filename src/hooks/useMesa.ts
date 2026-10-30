import { useMemo, useState } from "react";

import { useCalculate } from "./useCalculate";
import { useAddFriendForm } from "./useAddFriendForm";
import { usePersistedState } from "./usePersistedState";

import { calculateSettlements } from "../utils/calculateSettlements";
import { money, parseSettlement } from "../utils/format";
import type { Settlement } from "../utils/format";
import { isBooleanMap, isString } from "../utils/storage";

export const settlementKey = (settlement: Settlement) =>
  `${settlement.from}>${settlement.to}:${settlement.amount}`;

const signatureOf = (friends: { name: string; expense: number }[]) =>
  friends.map((friend) => `${friend.name}:${friend.expense}`).join("|");

// Everything the table of friends knows and does. The desktop page and the phone shell only
// differ in how they show it.
export const useMesa = () => {
  const { friends, addFriend, deleteFriend, reset, calculateTransactions } = useCalculate();

  const [eventName, setEventName] = usePersistedState<string>("quetedebo:draft:event", "", isString);

  // Keyed by who pays whom and how much, so a changed amount is never shown as already paid.
  const [paid, setPaid] = usePersistedState<Record<string, boolean>>("quetedebo:draft:paid", {}, isBooleanMap);

  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedFor, setSavedFor] = useState<string | null>(null);

  const form = useAddFriendForm((name, amount, concept) => addFriend(name, String(amount), concept));

  const count = friends.length;
  const total = friends.reduce((sum, friend) => sum + friend.expense, 0);
  const perPerson = count ? total / count : 0;
  const biggest = Math.max(perPerson, ...friends.map((friend) => friend.expense), 1);
  const signature = signatureOf(friends);
  const isSaved = savedFor === signature;

  const settlements = useMemo(
    () =>
      calculateSettlements(friends)
        .map(parseSettlement)
        .filter((settlement): settlement is Settlement => settlement !== null),
    [friends]
  );

  const settledCount = settlements.filter((settlement) => paid[settlementKey(settlement)]).length;

  const togglePaid = (key: string) => setPaid((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleReset = () => {
    reset();
    setPaid({});
    setEventName("");
    setSavedFor(null);
    setConfirmingReset(false);
  };

  const handleSave = () => {
    calculateTransactions(eventName.trim() || undefined);
    setSavedFor(signature);
  };

  const handleShare = async () => {
    const title = eventName.trim() || "La juntada";

    const summary =
      `${title} — total ${money(total)}, ${money(perPerson)} cada uno\n` +
      settlements
        .map((settlement) => `• ${settlement.from} → ${settlement.to}: ${money(settlement.amount)}`)
        .join("\n");

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return {
    friends,
    count,
    total,
    perPerson,
    biggest,
    settlements,
    settledCount,
    paid,
    togglePaid,
    eventName,
    setEventName,
    form,
    deleteFriend,
    confirmingReset,
    setConfirmingReset,
    handleReset,
    isSaved,
    handleSave,
    copied,
    handleShare,
  };
};

export type Mesa = ReturnType<typeof useMesa>;
