import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { useCalculate } from "./useCalculate";
import { useAddFriendForm } from "./useAddFriendForm";
import { useCreateSharedMesa } from "./useCreateSharedMesa";
import type { AddFriendForm } from "./useAddFriendForm";
import { usePersistedState } from "./usePersistedState";

import type { Friend } from "../types/types";
import { calculateSettlements } from "../utils/calculateSettlements";
import { money, parseSettlement } from "../utils/format";
import type { Settlement } from "../utils/format";
import { saveToHistory } from "../utils/history";
import { isBooleanMap, isString } from "../utils/storage";
import { isSharingConfigured } from "../services/supabase";

export const settlementKey = (settlement: Settlement) =>
  `${settlement.from}>${settlement.to}:${settlement.amount}`;

const signatureOf = (friends: { name: string; expense: number }[]) =>
  friends.map((friend) => `${friend.name}:${friend.expense}`).join("|");

export interface MesaAction {
  start: () => void;
  busy: boolean;
  error: string;
}

// Everything the table of friends knows and does. The desktop page and the phone shell only
// differ in how they show it, and a local mesa and a shared one only differ in where it lives.
export interface Mesa {
  kind: "local" | "shared";
  friends: Friend[];
  count: number;
  total: number;
  perPerson: number;
  biggest: number;
  settlements: Settlement[];
  settledCount: number;
  paid: Record<string, boolean>;
  togglePaid: (key: string) => void;
  eventName: string;
  setEventName: (name: string) => void;
  form: AddFriendForm;
  startEdit: (index: number) => void;
  deleteFriend: (index: number) => void;
  confirmingReset: boolean;
  setConfirmingReset: Dispatch<SetStateAction<boolean>>;
  handleReset: () => void;
  copied: boolean;
  handleShare: () => void;
  // Turning the local mesa into a shared one; null when sharing is not configured or not offered.
  sharing: MesaAction | null;
  // Starting a new, empty shared mesa from a shared one; null on the local mesa.
  newMesa: MesaAction | null;
}

// The numbers both kinds of mesa show, derived from who is sitting and what was marked as paid.
export const useMesaSummary = (friends: Friend[], paid: Record<string, boolean>) => {
  const count = friends.length;
  const total = friends.reduce((sum, friend) => sum + friend.expense, 0);
  const perPerson = count ? total / count : 0;
  const biggest = Math.max(perPerson, ...friends.map((friend) => friend.expense), 1);

  const settlements = useMemo(
    () =>
      calculateSettlements(friends)
        .map(parseSettlement)
        .filter((settlement): settlement is Settlement => settlement !== null),
    [friends]
  );

  const settledCount = settlements.filter((settlement) => paid[settlementKey(settlement)]).length;

  return { count, total, perPerson, biggest, settlements, settledCount };
};

const AUTO_SAVE_DELAY_MS = 400;

// Keeps the mesa in this device's history without a button: its entry appears with the first
// split and is updated whenever someone joins, changes or leaves, or the name changes. Waits a
// moment so typing the name does not write on every key, and skips writes when nothing changed.
export const useAutoHistory = (friends: Friend[], eventName: string, mesaId: string | null) => {
  const name = eventName.trim();
  const signature = `${signatureOf(friends)}#${name}`;
  const lastSaved = useRef<string | null>(null);

  useEffect(() => {
    if (!mesaId || signature === lastSaved.current) return;

    const timer = setTimeout(() => {
      if (saveToHistory(friends, name || undefined, mesaId)) lastSaved.current = signature;
    }, AUTO_SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [friends, name, mesaId, signature]);
};

// randomUUID only exists on https and localhost; a phone opening the dev server over the local
// network gets the fallback. The id only has to be unique within this device's history.
const newLocalMesaId = () =>
  `local-${
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  }`;

export const useMesa = (): Mesa => {
  const { friends, addFriend, updateFriend, deleteFriend, reset } = useCalculate();

  const [eventName, setEventName] = usePersistedState<string>("quetedebo:draft:event", "", isString);

  // Keyed by who pays whom and how much, so a changed amount is never shown as already paid.
  const [paid, setPaid] = usePersistedState<Record<string, boolean>>("quetedebo:draft:paid", {}, isBooleanMap);

  // Identifies this local mesa in the history; a new one starts when the mesa is cleared.
  const [firstMesaId] = useState<string>(newLocalMesaId);
  const [mesaId, setMesaId] = usePersistedState<string>("quetedebo:draft:id", firstMesaId, isString);

  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const goLive = useCreateSharedMesa();

  const form = useAddFriendForm((name, amount, concept, editing) =>
    editing === null ? addFriend(name, amount, concept) : updateFriend(editing, name, amount, concept)
  );

  const summary = useMesaSummary(friends, paid);
  useAutoHistory(friends, eventName, mesaId);

  const togglePaid = (key: string) => setPaid((prev) => ({ ...prev, [key]: !prev[key] }));

  const startEdit = (index: number) => form.startEdit(index, friends[index]);

  const handleDelete = (index: number) => {
    if (form.editing !== null) form.cancelEdit();
    deleteFriend(index);
  };

  const handleReset = () => {
    reset();
    form.cancelEdit();
    setPaid({});
    setEventName("");
    setMesaId(newLocalMesaId());
    setConfirmingReset(false);
  };

  const handleShare = async () => {
    const title = eventName.trim() || "La juntada";

    const summaryText =
      `${title} — total ${money(summary.total)}, ${money(summary.perPerson)} cada uno\n` +
      summary.settlements
        .map((settlement) => `• ${settlement.from} → ${settlement.to}: ${money(settlement.amount)}`)
        .join("\n");

    try {
      await navigator.clipboard.writeText(summaryText);

      setCopied(true);

      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return {
    kind: "local",
    friends,
    ...summary,
    paid,
    togglePaid,
    eventName,
    setEventName,
    form,
    startEdit,
    deleteFriend: handleDelete,
    confirmingReset,
    setConfirmingReset,
    handleReset,
    copied,
    handleShare,
    // Uploads this mesa (name and everyone sitting) as a shared one; the local mesa stays as it was.
    sharing: isSharingConfigured()
      ? { start: () => void goLive.create(eventName.trim(), friends), busy: goLive.busy, error: goLive.error }
      : null,
    newMesa: null,
  };
};
