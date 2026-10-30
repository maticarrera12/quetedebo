import { useMemo, useRef, useState } from "react";

import { useCalculate } from "../hooks/useCalculate";
import { usePersistedState } from "../hooks/usePersistedState";

import Avatar from "../components/Avatar";
import RoundTable from "../components/RoundTable";
import SettlementCard from "../components/SettlementCard";

import { calculateSettlements } from "../utils/calculateSettlements";
import { isBooleanMap, isString } from "../utils/storage";
import { money, parseAmount, parseSettlement, personColor } from "../utils/format";
import type { Settlement } from "../utils/format";

const CONCEPT_CHIPS = ["la carne", "las bebidas", "el hielo", "el pan", "el postre", "el carbón", "la picada"];

const fieldClass =
  "rounded-[14px] border-[1.5px] border-field-line bg-ground px-4 py-3.5 text-lg font-medium text-ink placeholder:text-faint focus:border-accent-deep focus:bg-surface";

const settlementKey = (settlement: Settlement) =>
  `${settlement.from}>${settlement.to}:${settlement.amount}`;

const signatureOf = (friends: { name: string; expense: number }[]) =>
  friends.map((friend) => `${friend.name}:${friend.expense}`).join("|");

export const CalculatePage = () => {
  const { friends, addFriend, deleteFriend, reset, calculateTransactions } = useCalculate();

  const [eventName, setEventName] = usePersistedState<string>("quetedebo:draft:event", "", isString);

  const [name, setName] = useState<string>("");

  const [concept, setConcept] = useState<string>("");

  const [amount, setAmount] = useState<string>("");

  const [error, setError] = useState<string>("");

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);

  // Keyed by who pays whom and how much, so a changed amount is never shown as already paid.
  const [paid, setPaid] = usePersistedState<Record<string, boolean>>("quetedebo:draft:paid", {}, isBooleanMap);

  const [copied, setCopied] = useState<boolean>(false);

  const [savedFor, setSavedFor] = useState<string | null>(null);

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

  const handleAddFriend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Falta el nombre de quién se sienta.");

      nameInputRef.current?.focus();

      return;
    }

    addFriend(name.trim(), String(parseAmount(amount)), concept.trim());

    setName("");

    setConcept("");

    setAmount("");

    setError("");

    nameInputRef.current?.focus();
  };

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

  return (
    <>
      <section className="grid items-center gap-12 overflow-x-clip pt-6 pb-14 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col gap-6">
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            aria-label="Nombre de la juntada"
            placeholder="Ponele nombre a la juntada"
            size={Math.max(eventName.length, 26)}
            className="max-w-full self-start rounded-full bg-sand px-3.5 py-2 text-base font-semibold text-sand-ink sm:text-sm placeholder:text-sand-ink focus:ring-2 focus:ring-accent-deep"
          />

          <h1 className="text-[clamp(40px,5vw,68px)] leading-[0.95] font-extrabold tracking-[-0.045em] text-balance">
            Cuentas claras, <span className="text-accent">amigos de siempre.</span>
          </h1>

          <p className="max-w-[30ch] text-xl text-pretty text-muted">
            Cada uno anota lo que trajo a la juntada. Nosotros hacemos la cuenta para que nadie
            tenga que sacar la calculadora en la sobremesa.
          </p>
        </div>

        <RoundTable friends={friends} total={total} />
      </section>

      <form
        onSubmit={handleAddFriend}
        className="flex flex-col gap-5 rounded-[28px] border border-line bg-surface p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[26px] font-bold tracking-[-0.03em]">¿Quién se suma a la mesa?</h2>

          <span className="text-[15px] text-faint">
            {count
              ? `${count} ${count === 1 ? "persona" : "personas"} en la mesa`
              : "Todavía no llegó nadie"}
          </span>
        </div>

        <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_0.9fr_auto]">
          <label className="flex flex-col gap-2 text-sm font-semibold text-muted">
            Nombre
            <input
              ref={nameInputRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value.replace(/[^\p{L} ]/gu, ""));
                setError("");
              }}
              autoComplete="off"
              placeholder="Por ejemplo, Lucía"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "form-error" : undefined}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-muted">
            Qué trajo
            <input
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              autoComplete="off"
              placeholder="La carne, el vino…"
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-muted">
            Cuánto puso
            <span className="flex items-center rounded-[14px] border-[1.5px] border-field-line bg-ground pl-4 focus-within:border-accent-deep focus-within:bg-surface">
              <span aria-hidden="true" className="text-lg font-semibold text-faint">
                $
              </span>

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                className="w-full min-w-0 bg-transparent px-3 py-3.5 text-lg font-semibold text-ink tabular-nums placeholder:text-faint"
              />
            </span>
          </label>

          <button
            type="submit"
            className="rounded-[14px] bg-ink px-5 py-[15px] text-[17px] font-bold whitespace-nowrap text-ground transition-[background-color,transform] duration-150 hover:bg-accent-deep active:scale-[0.97]"
          >
            Sentar a la mesa
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {CONCEPT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setConcept(chip)}
              className="shrink-0 rounded-full border border-field-line px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-muted transition-colors duration-150 hover:border-ink hover:text-ink"
            >
              {chip}
            </button>
          ))}
        </div>

        {error && (
          <span id="form-error" role="alert" className="text-sm font-semibold text-danger">
            {error}
          </span>
        )}
      </form>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-surface p-5 sm:p-7">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[26px] font-bold tracking-[-0.03em]">Quién puso qué</h2>

            {count > 0 &&
              (confirmingReset ? (
                <span className="flex items-center gap-3 text-sm font-semibold">
                  ¿Levantar a {count}?
                  <button type="button" onClick={handleReset} className="text-danger hover:underline">
                    Sí
                  </button>
                  <button type="button" onClick={() => setConfirmingReset(false)} className="text-muted hover:underline">
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className="text-sm font-semibold text-faint transition-colors duration-150 hover:text-danger"
                >
                  Levantar la mesa
                </button>
              ))}
          </div>

          {count === 0 && (
            <p className="rounded-[18px] bg-ground p-7 text-center text-muted">
              La mesa está vacía. ¿Quién llegó primero?
            </p>
          )}

          <ul className="flex flex-col">
            {friends.map((friend, index) => {
              const color = personColor(friends, friend.name);
              const diff = friend.expense - perPerson;
              const even = Math.abs(diff) < 1;

              return (
                <li
                  key={index}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3.5 border-t border-track py-3.5 first:border-t-0"
                >
                  <Avatar name={friend.name} color={color} size={44} />

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[17px] font-bold">{friend.name}</span>

                      <span className="text-sm text-faint">
                        {friend.concept ? `trajo ${friend.concept}` : "no trajo nada (todavía)"}
                      </span>
                    </div>

                    <span aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-track">
                      <span
                        className="bar block h-full rounded-full"
                        style={{ width: `${(friend.expense / biggest) * 100}%`, background: color }}
                      />
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[17px] font-bold tabular-nums">{money(friend.expense)}</span>

                    <span
                      className={`text-[13px] font-semibold ${even ? "text-faint" : diff > 0 ? "text-good" : "text-danger"}`}
                    >
                      {even ? "justo" : diff > 0 ? `le deben ${money(diff)}` : `debe ${money(-diff)}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteFriend(index)}
                    aria-label={`Sacar a ${friend.name} de la mesa`}
                    title="Sacar de la mesa"
                    className="h-[30px] w-[30px] rounded-full text-lg text-faint transition-colors duration-150 hover:bg-ground hover:text-danger"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-[28px] bg-panel p-5 text-ground sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[26px] font-bold tracking-[-0.03em]">Quién le pasa a quién</h2>

            {settlements.length > 0 && (
              <span className="text-sm text-panel-faint">
                {settledCount} de {settlements.length} saldados
              </span>
            )}
          </div>

          {settlements.length === 0 && (
            <p className="rounded-[18px] bg-panel-item p-7 text-center text-panel-text">
              {count < 2
                ? "Cuando haya al menos dos en la mesa, acá aparece quién le pasa a quién."
                : "Todos pusieron lo mismo. ¡Nadie le debe nada a nadie!"}
            </p>
          )}

          <ul className="flex flex-col gap-2.5">
            {settlements.map((settlement) => {
              const key = settlementKey(settlement);

              return (
                <SettlementCard
                  key={key}
                  settlement={settlement}
                  friends={friends}
                  dark
                  paid={Boolean(paid[key])}
                  onToggle={() => setPaid((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
              );
            })}
          </ul>

          {settlements.length > 0 && (
            <div className="mt-auto flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleShare}
                className="rounded-[14px] bg-honey px-5 py-[15px] text-base font-bold text-ink transition-colors duration-150 hover:bg-honey-soft"
              >
                {copied ? "¡Copiado! Pegalo en el grupo" : "Copiar resumen para el grupo"}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaved}
                className="rounded-[14px] border-[1.5px] border-muted px-5 py-3 text-[15px] font-bold text-ground transition-colors duration-150 hover:border-ground disabled:cursor-default disabled:border-transparent disabled:text-panel-faint"
              >
                {isSaved ? "Guardada en el historial" : "Guardar en el historial"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
