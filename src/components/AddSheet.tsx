import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

import type { AddFriendForm } from "../hooks/useAddFriendForm";
import { CONCEPT_CHIPS } from "../utils/concepts";

interface AddSheetProps {
  open: boolean;
  onClose: () => void;
  form: AddFriendForm;
}

const fieldClass =
  "h-[52px] w-full rounded-[14px] border-[1.5px] border-field-line bg-ground px-4 text-lg font-medium text-ink placeholder:text-faint focus:border-accent-deep focus:bg-surface";

// A sheet that rises from the bottom, so the table and the total stay in sight while someone
// is added. It stays open after each addition, because friends are usually loaded in a row.
const AddSheet = ({ open, onClose, form }: AddSheetProps) => {
  const [notice, setNotice] = useState<string>("");
  const openedFrom = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    openedFrom.current = document.activeElement as HTMLElement | null;

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
      openedFrom.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    setNotice("");
    onClose();
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    const added = form.name.trim();

    if (form.submit(e)) setNotice(`${added} ya está en la mesa`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") close();
  };

  return (
    <div className="fixed inset-0 z-30">
      <div aria-hidden="true" className="sheet-scrim absolute inset-0 bg-ink/25" onClick={close} />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onKeyDown={onKeyDown}
        className="sheet absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-y-auto rounded-t-[28px] bg-surface px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgba(35,25,15,0.35)]"
      >
        <span aria-hidden="true" className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#d9cbb2]" />

        <div className="mb-2 flex h-11 items-center justify-between">
          <h2 id="sheet-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
            Sumar a la mesa
          </h2>

          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ground text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col">
          <label className="mb-3 flex flex-col gap-1.5 text-[13px] font-semibold text-muted">
            Nombre
            <input
              ref={form.nameRef}
              value={form.name}
              onChange={(e) => form.changeName(e.target.value)}
              autoFocus
              autoComplete="off"
              enterKeyHint="next"
              placeholder="Por ejemplo, Lucía"
              aria-invalid={Boolean(form.error)}
              aria-describedby={form.error ? "sheet-error" : undefined}
              className={fieldClass}
            />
          </label>

          <label className="mb-2 flex flex-col gap-1.5 text-[13px] font-semibold text-muted">
            Qué trajo
            <input
              value={form.concept}
              onChange={(e) => form.setConcept(e.target.value)}
              autoComplete="off"
              enterKeyHint="next"
              placeholder="La carne, el vino…"
              className={fieldClass}
            />
          </label>

          <div className="-mr-5 mb-3 flex gap-2 overflow-x-auto pr-5 pb-1 [scrollbar-width:none]">
            {CONCEPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => form.setConcept(chip)}
                className="relative h-9 flex-none rounded-full border border-field-line px-3.5 text-sm font-medium whitespace-nowrap text-muted before:absolute before:inset-x-0 before:-inset-y-[5px] before:content-['']"
              >
                {chip}
              </button>
            ))}
          </div>

          <label className="mb-4 flex flex-col gap-1.5 text-[13px] font-semibold text-muted">
            Cuánto puso
            <span className="flex h-[52px] items-center rounded-[14px] border-[1.5px] border-field-line bg-ground pl-4 focus-within:border-accent-deep focus-within:bg-surface">
              <span aria-hidden="true" className="text-lg font-semibold text-faint">
                $
              </span>

              <input
                value={form.amount}
                onChange={(e) => form.changeAmount(e.target.value)}
                inputMode="decimal"
                autoComplete="off"
                enterKeyHint="done"
                placeholder="0"
                className="h-full w-full min-w-0 bg-transparent px-3 text-lg font-semibold text-ink tabular-nums placeholder:text-faint"
              />
            </span>
          </label>

          <div aria-live="polite" className="min-h-5 text-sm font-semibold">
            {form.error ? (
              <span id="sheet-error" role="alert" className="text-danger">
                {form.error}
              </span>
            ) : (
              notice && <span className="text-good">{notice}</span>
            )}
          </div>

          <div className="mt-2 flex gap-2.5">
            <button
              type="button"
              onClick={close}
              className="h-14 flex-none rounded-2xl border-[1.5px] border-field-line px-[22px] text-base font-bold text-ink"
            >
              Listo
            </button>

            <button type="submit" className="h-14 flex-1 rounded-2xl bg-ink text-[17px] font-bold text-ground">
              Sumar a la mesa
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddSheet;
