import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Friend } from "../types/types";
import { amountInput, parseAmount } from "../utils/format";

// The longest name and concept a shared mesa accepts (see the checks in supabase/migrations).
export const NAME_MAX_LENGTH = 40;
export const CONCEPT_MAX_LENGTH = 60;

// The state and rules of "sit a friend at the table", shared by the inline form on desktop and
// the sheet on phones, so both accept exactly the same input. The same form edits someone who is
// already sitting: `editing` holds their position until the change is saved or cancelled.
export const useAddFriendForm = (
  onSubmit: (name: string, amount: number, concept: string, editing: number | null) => void
) => {
  const [name, setName] = useState<string>("");
  const [concept, setConcept] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editing, setEditing] = useState<number | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);

  const changeName = (value: string) => {
    setName(value.replace(/[^\p{L} ]/gu, ""));
    setError("");
  };

  const changeAmount = (value: string) => setAmount(value.replace(/[^\d.,]/g, ""));

  const clear = () => {
    setName("");
    setConcept("");
    setAmount("");
    setError("");
    setEditing(null);
  };

  const startEdit = (index: number, friend: Friend) => {
    setName(friend.name);
    setConcept(friend.concept ?? "");
    setAmount(amountInput(friend.expense));
    setError("");
    setEditing(index);
    nameRef.current?.focus();
  };

  const cancelEdit = () => clear();

  // Returns whether somebody was added or changed, so a caller can react (a notice, closing a sheet).
  const submit = (e?: FormEvent): boolean => {
    e?.preventDefault();

    if (!name.trim()) {
      setError("Falta el nombre de quién se sienta.");
      nameRef.current?.focus();
      return false;
    }

    onSubmit(name.trim(), parseAmount(amount), concept.trim(), editing);

    clear();
    nameRef.current?.focus();

    return true;
  };

  return {
    name,
    concept,
    amount,
    error,
    editing,
    nameRef,
    changeName,
    setConcept,
    changeAmount,
    startEdit,
    cancelEdit,
    submit,
  };
};

export type AddFriendForm = ReturnType<typeof useAddFriendForm>;
