import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { parseAmount } from "../utils/format";

// The state and rules of "sit a friend at the table", shared by the inline form on desktop and
// the sheet on phones, so both accept exactly the same input.
export const useAddFriendForm = (onAdd: (name: string, amount: number, concept: string) => void) => {
  const [name, setName] = useState<string>("");
  const [concept, setConcept] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const nameRef = useRef<HTMLInputElement>(null);

  const changeName = (value: string) => {
    setName(value.replace(/[^\p{L} ]/gu, ""));
    setError("");
  };

  const changeAmount = (value: string) => setAmount(value.replace(/[^\d.,]/g, ""));

  // Returns whether somebody was added, so a caller can react (a notice, closing a sheet).
  const submit = (e?: FormEvent): boolean => {
    e?.preventDefault();

    if (!name.trim()) {
      setError("Falta el nombre de quién se sienta.");
      nameRef.current?.focus();
      return false;
    }

    onAdd(name.trim(), parseAmount(amount), concept.trim());

    setName("");
    setConcept("");
    setAmount("");
    setError("");
    nameRef.current?.focus();

    return true;
  };

  return { name, concept, amount, error, nameRef, changeName, setConcept, changeAmount, submit };
};

export type AddFriendForm = ReturnType<typeof useAddFriendForm>;
