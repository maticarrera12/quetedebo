import { useState } from "react";
import { useCalculate } from "../hooks/useCalculate";
import CustomButton from "../components/CustomButton";
import { MdDeleteForever } from "react-icons/md";

export const CalculatePage = () => {
  const {
    friends,
    transactions,
    addFriend,
    deleteFriend,
    reset,
    calculateTransactions,
  } = useCalculate();

  const [name, setName] = useState<string>("");
  const [expense, setExpense] = useState<string>("");
  const handleAddFriend = (e: React.MouseEvent<HTMLButtonElement>) => {
    
    e.preventDefault();
    addFriend(name, expense);
    setName("");
    setExpense("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Paguen sus deudas o sufran las consecuencias
      </h2>

      <form className="space-y-2">
        {/* Inputs */}
        <div className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            onKeyDown={(e) => {
              if (!/^[A-Za-z ]/.test(e.key) && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="number"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            placeholder="Gasto"
            className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Botones Agregar y Borrar */}
        <div className="flex gap-4">
          <CustomButton
            onClick={handleAddFriend}
            text="Agregar"
            className="w-1/2"
            disabled={!name.trim() || !expense.trim()}
          />
          <CustomButton
            onClick={reset}
            text="Borrar"
            className="w-1/2 bg-red-500 hover:bg-red-600"
          />
        </div>

        {/* Botón Calcular */}
        <CustomButton
          onClick={calculateTransactions}
          text="Calcular"
          className="w-full"
        />

        {/* Resultados */}
        <div className="space-y-2">
          <ul className="space-y-2">
            {friends.map((friend, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
              >
                <span>
                  {friend.name} puso: ${friend.expense}
                </span>
                <MdDeleteForever
                  onClick={() => deleteFriend(index)}
                  className="text-red-700 cursor-pointer text-xl"
                />
              </li>
            ))}
          </ul>

          <p className="text-lg font-semibold text-gray-700">
            Total: $
            {friends.reduce((total, friend) => total + friend.expense, 0)}
          </p>

          <ul className="space-y-1 text-sm text-gray-600">
            {transactions.map((transaction, index) => (
              <li key={index}>• {transaction}</li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
};
