import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AddSheet from "../components/AddSheet";
import Avatar from "../components/Avatar";
import Mark from "../components/Mark";
import RoundTable from "../components/RoundTable";
import SettlementCard from "../components/SettlementCard";

import { settlementKey } from "../hooks/useMesa";
import type { Mesa } from "../hooks/useMesa";

import { money, personColor } from "../utils/format";

type Tab = "pagos" | "puso";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// The phone version of the table: a compact table that never leaves the screen, two tabs for
// what you need to read, and everything that adds data lives in a sheet (AddSheet).
const MobileMesa = ({ mesa }: { mesa: Mesa }) => {
  const {
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
  } = mesa;

  const location = useLocation();
  const navigate = useNavigate();

  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<Tab | null>(null);

  // Until the person picks a tab, show the answer if there is one and the list if not.
  const activeTab: Tab = tab ?? (settlements.length > 0 ? "pagos" : "puso");

  // The bottom bar asks for the sheet through router state, so it works from any tab. The state
  // is cleared right away: history keeps it across reloads and the sheet must not reopen.
  useEffect(() => {
    const state = location.state as { sumar?: number } | null;

    if (state?.sumar) {
      setSheetOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const sheet = <AddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} form={form} />;

  if (count === 0) {
    return (
      <>
        <div className="px-4 pt-[calc(0.5rem+env(safe-area-inset-top))]">
          <div className="flex h-14 items-center gap-3">
            <Mark />
            <span className="text-xl font-extrabold tracking-[-0.02em]">¿Qué te debo?</span>
          </div>

          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            aria-label="Nombre de la juntada"
            placeholder="Ponele nombre a la juntada"
            className="mt-1 h-10 w-64 max-w-full rounded-full bg-sand px-4 text-base font-semibold text-sand-ink placeholder:text-sand-ink focus:ring-2 focus:ring-accent-deep"
          />

          <h1 className="mt-5 text-4xl leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
            Cuentas claras, <span className="text-accent">amigos de siempre.</span>
          </h1>

          <p className="mt-3 max-w-[22rem] text-base text-muted">
            Cada uno anota lo que trajo. Nosotros hacemos la cuenta.
          </p>

          <div className="mt-7">
            <RoundTable compact friends={friends} total={total} />
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-ink text-[17px] font-bold text-ground"
          >
            <PlusIcon className="text-honey" />
            Sumar al primero
          </button>

          <p className="mt-4 text-center text-[13px] text-muted">Tu mesa se guarda sola en este celular.</p>
        </div>

        {sheet}
      </>
    );
  }

  return (
    <>
      <div className="pt-[env(safe-area-inset-top)]">
        <header className="flex h-16 items-center gap-3 pr-3 pl-4">
          <Mark />

          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="sr-only">La mesa de la juntada</h1>

            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              aria-label="Nombre de la juntada"
              placeholder="Ponele nombre a la juntada"
              className="w-full truncate bg-transparent text-xl leading-[1.15] font-extrabold tracking-[-0.02em] text-ink placeholder:text-muted"
            />

            <span className="text-[13px] font-medium text-muted">
              {count} {count === 1 ? "amigo" : "amigos"} · {money(perPerson)} cada uno
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Copiar resumen para el grupo"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line bg-surface text-ink"
          >
            {copied ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
              </svg>
            )}
          </button>

          <span role="status" className="sr-only">
            {copied ? "Resumen copiado" : ""}
          </span>
        </header>

        <div className="pt-1">
          <RoundTable compact friends={friends} total={total} />
        </div>

        <div role="tablist" aria-label="Vista de la mesa" className="mx-4 mt-3 flex gap-1 rounded-full bg-[#efe6d3] p-1">
          <button
            type="button"
            role="tab"
            id="tab-pagos"
            aria-selected={activeTab === "pagos"}
            aria-controls="panel-pagos"
            onClick={() => setTab("pagos")}
            className={`h-11 flex-1 rounded-full text-sm ${activeTab === "pagos" ? "bg-surface font-bold text-ink" : "font-semibold text-muted"}`}
          >
            Pagos · {settlements.length}
          </button>

          <button
            type="button"
            role="tab"
            id="tab-puso"
            aria-selected={activeTab === "puso"}
            aria-controls="panel-puso"
            onClick={() => setTab("puso")}
            className={`h-11 flex-1 rounded-full text-sm ${activeTab === "puso" ? "bg-surface font-bold text-ink" : "font-semibold text-muted"}`}
          >
            Quién puso · {count}
          </button>
        </div>

        {activeTab === "pagos" ? (
          <section id="panel-pagos" role="tabpanel" aria-labelledby="tab-pagos" className="mx-4 mt-3">
            {settlements.length === 0 ? (
              <p className="rounded-3xl bg-panel p-6 text-center text-panel-text">
                {count < 2
                  ? "Cuando haya al menos dos en la mesa, acá aparece quién le pasa a quién."
                  : "Todos pusieron lo mismo. ¡Nadie le debe nada a nadie!"}
              </p>
            ) : (
              <>
                <ul className="flex flex-col gap-2 rounded-3xl bg-panel p-3">
                  {settlements.map((settlement) => {
                    const key = settlementKey(settlement);

                    return (
                      <SettlementCard
                        key={key}
                        compact
                        dark
                        settlement={settlement}
                        friends={friends}
                        paid={Boolean(paid[key])}
                        onToggle={() => togglePaid(key)}
                      />
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaved}
                  className="mt-1 flex min-h-11 w-full items-center justify-center text-[15px] font-bold text-ink disabled:text-muted"
                >
                  {isSaved
                    ? "Guardada en el historial"
                    : `${settledCount} de ${settlements.length} saldados · Guardar en el historial`}
                </button>
              </>
            )}
          </section>
        ) : (
          <section id="panel-puso" role="tabpanel" aria-labelledby="tab-puso" className="mx-4 mt-3">
            <ul className="rounded-3xl border border-line bg-surface px-4">
              {friends.map((friend, index) => {
                const color = personColor(friends, friend.name);
                const diff = friend.expense - perPerson;
                const even = Math.abs(diff) < 1;

                return (
                  <li key={index} className="flex h-16 items-center gap-3 border-t border-track first:border-t-0">
                    <Avatar name={friend.name} color={color} size={40} />

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate text-[15px] font-bold">{friend.name}</span>
                        <span className="truncate text-xs text-muted">
                          {friend.concept ? `trajo ${friend.concept}` : "no trajo nada (todavía)"}
                        </span>
                      </div>

                      <span aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-track">
                        <span
                          className="bar block h-full rounded-full"
                          style={{ width: `${(friend.expense / biggest) * 100}%`, background: color }}
                        />
                      </span>
                    </div>

                    <div className="flex flex-none flex-col items-end leading-tight">
                      <span className="text-[15px] font-bold tabular-nums">{money(friend.expense)}</span>
                      <span className={`text-xs font-semibold ${even ? "text-muted" : diff > 0 ? "text-good" : "text-danger"}`}>
                        {even ? "justo" : diff > 0 ? `le deben ${money(diff)}` : `debe ${money(-diff)}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteFriend(index)}
                      aria-label={`Sacar a ${friend.name} de la mesa`}
                      className="-mr-2 flex h-11 w-9 flex-none items-center justify-center rounded-full text-lg text-muted"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-1 flex min-h-11 items-center justify-center">
              {confirmingReset ? (
                <span className="flex items-center gap-4 text-sm font-semibold">
                  ¿Levantar a {count}?
                  <button type="button" onClick={handleReset} className="min-h-11 px-2 text-danger">
                    Sí
                  </button>
                  <button type="button" onClick={() => setConfirmingReset(false)} className="min-h-11 px-2 text-muted">
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className="min-h-11 px-3 text-sm font-semibold text-muted"
                >
                  Levantar la mesa
                </button>
              )}
            </div>
          </section>
        )}
      </div>

      {sheet}
    </>
  );
};

export default MobileMesa;
