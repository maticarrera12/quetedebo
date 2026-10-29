import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import type { TransactionResult } from "../types/types";

import Avatar from "../components/Avatar";
import AvatarStack from "../components/AvatarStack";
import MoneyFigure from "../components/MoneyFigure";
import SettlementCard from "../components/SettlementCard";

import { parseSettlement, personColor } from "../utils/format";
import type { Settlement } from "../utils/format";

const HistoryPage = () => {
  const [calculations, setCalculations] = useState<TransactionResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("calculation");

    if (stored) {
      setCalculations(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      <section className="flex flex-col gap-5 pt-6 pb-12">
        <span className="self-start rounded-full bg-sand px-3.5 py-2 text-sm font-semibold text-sand-ink">
          {calculations.length === 1 ? "1 juntada guardada" : `${calculations.length} juntadas guardadas`}
        </span>

        <h1 className="max-w-[18ch] text-[clamp(40px,5vw,68px)] leading-[0.95] font-extrabold tracking-[-0.045em] text-balance">
          Las juntadas que ya <span className="text-accent">quedaron a mano.</span>
        </h1>

        <p className="max-w-[40ch] text-xl text-pretty text-muted">
          Cada vez que guardás una juntada queda acá, en este navegador.
        </p>
      </section>

      {calculations.length === 0 ? (
        <section className="flex min-h-64 flex-col items-start justify-center gap-4 rounded-[28px] border-2 border-dashed border-[#d9cbb2] p-7">
          <h2 className="text-[26px] font-bold tracking-[-0.03em]">Todavía no hay juntadas</h2>

          <p className="max-w-md text-muted">
            Sentá a tus amigos a la mesa, mirá quién le pasa a quién y guardala: queda acá.
          </p>

          <Link
            to="/"
            className="rounded-[14px] bg-ink px-5 py-[15px] text-[17px] font-bold text-ground transition-colors duration-150 hover:bg-accent-deep"
          >
            Armar una juntada
          </Link>
        </section>
      ) : (
        <div className="flex flex-col gap-5">
          {calculations.map((calculation, index) => {
            const settlements = calculation.transactions
              .map(parseSettlement)
              .filter((settlement): settlement is Settlement => settlement !== null);

            return (
              <article
                key={index}
                className="flex flex-col gap-6 rounded-[28px] border border-line bg-surface p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <AvatarStack friends={calculation.friends} ring="var(--surface)" />

                    <div>
                      <h2 className="text-[26px] font-bold tracking-[-0.03em]">
                        {calculation.eventName || `Juntada de ${calculation.friends.length} amigos`}
                      </h2>

                      <p className="text-sm text-faint">{calculation.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-faint">Gasto total</p>
                    <MoneyFigure
                      amount={calculation.totalExpense}
                      className="text-[32px] leading-tight font-extrabold tracking-[-0.03em]"
                    />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-muted">Quién le pasa a quién</h3>

                    <ul className="flex flex-col gap-2.5">
                      {settlements.map((settlement, id) => (
                        <SettlementCard key={id} settlement={settlement} friends={calculation.friends} />
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-muted">Quién puso qué</h3>

                    <ul className="flex flex-col">
                      {calculation.friends.map((friend, id) => (
                        <li
                          key={id}
                          className="flex items-center gap-3.5 border-t border-track py-3 first:border-t-0"
                        >
                          <Avatar
                            name={friend.name}
                            color={personColor(calculation.friends, friend.name)}
                            size={44}
                          />

                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-[17px] font-bold">{friend.name}</span>

                            {friend.concept && (
                              <span className="truncate text-sm text-faint">trajo {friend.concept}</span>
                            )}
                          </div>

                          <MoneyFigure amount={friend.expense} className="text-[17px] font-bold" centsClassName="opacity-60" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

export default HistoryPage;
