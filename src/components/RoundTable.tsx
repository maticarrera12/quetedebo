import Avatar from "./Avatar";
import MoneyFigure from "./MoneyFigure";
import { money, personColor } from "../utils/format";
import type { Friend } from "../types/types";

interface RoundTableProps {
  friends: Friend[];
  total: number;
}

// The whole group around one table: the total in the middle, each friend on a seat.
const RoundTable = ({ friends, total }: RoundTableProps) => {
  const count = friends.length;
  const perPerson = count ? total / count : 0;

  return (
    <div
      role="img"
      aria-label={
        count
          ? `En la mesa: ${friends.map((friend) => friend.name).join(", ")}`
          : "La mesa está vacía"
      }
      className="round-table relative aspect-square w-[calc(100%-6rem)] max-w-[480px] justify-self-center sm:w-full"
    >
      <div className="absolute inset-[15%] flex flex-col items-center justify-center gap-1 rounded-full bg-accent-deep text-center text-white shadow-[inset_0_0_0_10px_rgba(255,255,255,0.12)]">
        <span className="text-[15px] font-medium">Total de la juntada</span>

        <MoneyFigure
          amount={total}
          className="text-[clamp(32px,5vw,52px)] leading-none font-extrabold tracking-[-0.04em]"
          centsClassName="opacity-80"
        />

        <span className="mt-1.5 rounded-full bg-ink/25 px-3 py-1 text-[15px] font-semibold">
          {count ? `${money(perPerson)} cada uno` : "La mesa está vacía"}
        </span>
      </div>

      <div aria-hidden="true" className="orbit absolute inset-0">
        {friends.map((friend, index) => {
          const angle = (index / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2;

          return (
            <div
              key={index}
              className="seat seat-upright absolute flex flex-col items-center gap-1"
              style={{
                left: `${50 + 43 * Math.cos(angle)}%`,
                top: `${50 + 43 * Math.sin(angle)}%`,
              }}
            >
              <span className="rounded-full shadow-[0_6px_14px_-6px_rgba(35,25,15,0.4)]">
                <Avatar
                  name={friend.name}
                  color={personColor(friends, friend.name)}
                  size={62}
                  ring="var(--ground)"
                />
              </span>

              <span className="rounded-full bg-ground px-2 text-[13px] font-semibold">{friend.name}</span>
            </div>
          );
        })}
      </div>

      {count === 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#d9cbb2]"
        />
      )}
    </div>
  );
};

export default RoundTable;
