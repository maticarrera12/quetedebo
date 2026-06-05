import { useEffect, useState } from "react";

import type { TransactionResult } from "../types/types";

const HistoryPage = () => {
  const [calculations, setCalculations] = useState<TransactionResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("calculation");

    if (stored) {
      setCalculations(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold neon-text text-center tracking-wide">
        Historial de repartijas
      </h2>

      {calculations.length === 0 ? (
        <p className="text-center text-base text-muted-foreground">
          No hay repartijas encontradas.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {calculations.map((calculation, index) => (
            <div
              key={index}
              className="p-4 neon-list-item rounded-xl flex flex-col min-h-64 max-h-[28rem] w-full"
            >
              <div className="shrink-0 space-y-2">
                <p className="text-base text-muted-foreground">
                  <strong className="neon-text-accent">Fecha:</strong>{" "}
                  {calculation.date}
                </p>

                <p className="text-base text-foreground">
                  <strong className="neon-text-accent">Gasto total:</strong>{" "}
                  <span className="neon-text-cyan">
                    ${calculation.totalExpense.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto neon-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pr-1">
                <div>
                  <p className="font-semibold neon-text-accent">Repartijas:</p>
                  <ul className="list-disc list-inside text-base neon-transaction space-y-1 mt-1">
                    {calculation.transactions.map((transaction, id) => (
                      <li key={id}>{transaction}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-semibold neon-text-accent">
                    Amigos contribuyentes:
                  </p>
                  <ul className="list-disc list-inside text-base text-muted-foreground space-y-1 mt-1">
                    {calculation.friends.map((friend, id) => (
                      <li key={id}>
                        {friend.name} contribuyó:{" "}
                        <span className="neon-text-cyan">
                          ${friend.expense.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
