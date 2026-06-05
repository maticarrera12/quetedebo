import { useState } from "react";

import { useCalculate } from "../hooks/useCalculate";

import CustomButton from "../components/CustomButton";

import { BiTrashAlt } from "react-icons/bi";

import { TiGroup } from "react-icons/ti";

import { FaPlus, FaMinus } from "react-icons/fa6";

import { FaCalculator } from "react-icons/fa";

import { AiOutlineDollar } from "react-icons/ai";

import StatComponent from "../components/StatComponent";

import calculateImage from "../assets/image.png";
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

  const adjustExpense = (delta: number) => {
    const current = parseFloat(expense) || 0;
    const next = Math.max(0, current + delta);

    setExpense(
      Number.isInteger(next) ? String(next) : next.toFixed(2).replace(/\.?0+$/, "")
    );
  };

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12 py-4 sm:py-6">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start gap-4 order-2 lg:order-1">
        <h2 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-foreground text-center lg:text-left tracking-wide leading-tight">
          Dividi gastos, <br /> <span className="bg-gradient-to-r from-white via-purple-500 to-neon-cyan bg-clip-text text-transparent">fortalece amistades.</span>
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground text-center lg:text-left max-w-md">
          Calculá cuánto debe cada uno y evita cuentas incomodas.
        </p>

        <img
          src={calculateImage}
          alt="Calculate"
          className="w-full max-w-sm lg:max-w-none object-contain hidden sm:block"
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-stretch gap-6 order-1 lg:order-2">
      <div className="card space-y-5 sm:space-y-6 w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
          <TiGroup className="text-5xl neon-icon-wrap rounded-full p-2 w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center" />

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold neon-text tracking-wide leading-snug">
              Paguen sus deudas o sufran las consecuencias
            </h2>

            <p className="text-base text-muted-foreground mt-1">
              Agrega los participantes y cuanto gasto cada uno
            </p>
          </div>
        </div>

        <form className="space-y-4">
          {/* Inputs */}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
              className="flex-1 text-base text-foreground px-4 py-3 neon-input focus:outline-none min-h-11"
            />

            <div className="w-full sm:w-36 lg:w-40 neon-stepper flex items-stretch min-h-11">
              <button
                type="button"
                onClick={() => adjustExpense(-1)}
                disabled={!expense || parseFloat(expense) <= 0}
                className="neon-stepper-btn"
                aria-label="Disminuir gasto"
              >
                <FaMinus className="w-3 h-3" />
              </button>

              <input
                type="number"
                min="0"
                step="0.01"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                placeholder="0.00"
                className="neon-stepper-input"
              />

              <button
                type="button"
                onClick={() => adjustExpense(1)}
                className="neon-stepper-btn"
                aria-label="Aumentar gasto"
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Botones Agregar y Borrar */}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <CustomButton
              onClick={handleAddFriend}
              icon={<FaPlus className="w-4 h-4 shrink-0" />}
              text="Agregar Persona"
              className="w-full sm:w-1/2"
              disabled={!name.trim() || !expense.trim()}
            />

            <CustomButton
              onClick={reset}
              icon={<BiTrashAlt className="w-4 h-4 shrink-0" />}
              text="Borrar Todo"
              className="w-full sm:w-1/2 border-primary/50 text-primary hover:border-primary hover:shadow-[0_0_15px_hsl(0_100%_65%_/_0.4)] hover:text-primary"
            />
          </div>

          {/* Botón Calcular */}

          <CustomButton
            onClick={calculateTransactions}
            icon={<FaCalculator className="w-4 h-4 shrink-0" />}
            text="Calcular cuanto debe pagar cada uno"
            className="w-full py-3.5 text-base sm:text-sm bg-linear-to-r from-neon-violet/30 to-neon-cyan/20 border-neon-cyan/50 hover:shadow-[0_0_25px_hsl(186_100%_50%_/_0.35),0_0_25px_hsl(262_100%_65%_/_0.25)] text-foreground font-[family-name:var(--font-display)] tracking-wide"
            disabled={friends.length < 2}
          />

          {/* Resultados */}

          <div className="space-y-2">
            <ul className="space-y-2">
              {friends.map((friend, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center gap-3 neon-list-item px-4 py-3"
                >
                  <span className="text-base text-foreground min-w-0">
                    {friend.name} puso:{" "}
                    <span className="neon-text-cyan">${friend.expense}</span>
                  </span>

                  <BiTrashAlt
                    onClick={() => deleteFriend(index)}
                    className="text-primary cursor-pointer text-2xl shrink-0 hover:[filter:drop-shadow(0_0_6px_hsl(0_100%_65%_/_0.8))] transition-all"
                  />
                </li>
              ))}
            </ul>

            <ul className="space-y-2 text-base">
              {transactions.map((transaction, index) => (
                <li key={index} className="neon-transaction">
                  • {transaction}
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>

      <div className="neon-stat w-full flex items-stretch overflow-hidden">
        <StatComponent
          title="Total"
          value={friends.reduce((total, friend) => total + friend.expense, 0)}
          icon={<AiOutlineDollar />}
          className="flex-1"
        />
        <div
          className="w-px shrink-0 bg-linear-to-b from-transparent via-primary/25 to-transparent"
          aria-hidden="true"
        />
        <StatComponent
          title="Amigos"
          value={friends.length}
          icon={<TiGroup className="text-neon-cyan" />}
          className="flex-1"
        />
      </div>
      </div>
    </section>
  );
};
