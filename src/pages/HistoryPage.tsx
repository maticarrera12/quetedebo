// pages/HistoryPage.tsx
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
    <div className="max-w-2xl my-16 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Historial de repartijas
      </h2>

      {calculations.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay repartijas encontradas.
        </p>
      ) : (
        <div className="space-y-6 flex flex-wrap gap-2 items-center justify-center">
          {calculations.map((calculation, index) => (
            <div
              key={index}
              className="p-4 bg-violet-100 rounded-lg shadow border border-gray-200 space-y-4"
            >
              <p className="text-sm text-gray-500">
                <strong className="text-gray-700">Fecha:</strong>{" "}
                {calculation.date}
              </p>

              <p className="text-gray-700">
                <strong>Gasto total:</strong> $
                {calculation.totalExpense.toFixed(2)}
              </p>

              <div>
                <p className="font-semibold text-gray-700">Repartijas:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {calculation.transactions.map((transaction, id) => (
                    <li key={id}>{transaction}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Amigos contribuyentes:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {calculation.friends.map((friend, id) => (
                    <li key={id}>
                      {friend.name} contribuyó: ${friend.expense.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
