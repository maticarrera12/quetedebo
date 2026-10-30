import Avatar from "./Avatar";
import MoneyFigure from "./MoneyFigure";
import { money, personColor } from "../utils/format";
import type { Friend } from "../types/types";

interface RoundTableProps {
  friends: Friend[];
  total: number;
  // The phone version: a fixed 232px table, smaller seats and no names (they are in the list).
  compact?: boolean;
}

// The whole group around one table: the total in the middle, each friend on a seat.
const RoundTable = ({ friends, total, compact = false }: RoundTableProps) => {
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
      className={
        compact
          ? "round-table relative mx-auto aspect-square w-[232px] overflow-visible"
          : "round-table relative aspect-square w-[calc(100%-6rem)] max-w-[480px] justify-self-center sm:w-full"
      }
    >
      <div
        className={`absolute flex flex-col items-center justify-center gap-1 rounded-full bg-accent-deep text-center text-white ${
          compact
            ? "inset-[18%] shadow-[inset_0_0_0_6px_rgba(255,255,255,0.12)]"
            : "inset-[15%] shadow-[inset_0_0_0_10px_rgba(255,255,255,0.12)]"
        }`}
      >
        <span className={compact ? "text-xs font-semibold" : "text-[15px] font-medium"}>
          {compact ? "Total" : "Total de la juntada"}
        </span>

        <MoneyFigure
          amount={total}
          className={`leading-none font-extrabold tracking-[-0.04em] ${
            compact ? "text-[30px]" : "text-[clamp(32px,5vw,52px)]"
          }`}
          centsClassName="opacity-80"
        />

        {(!compact || count === 0) && (
          <span
            className={`rounded-full bg-ink/25 font-semibold ${
              compact ? "mt-1 px-2.5 py-0.5 text-xs" : "mt-1.5 px-3 py-1 text-[15px]"
            }`}
          >
            {count ? `${money(perPerson)} cada uno` : "La mesa está vacía"}
          </span>
        )}
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
                  size={compact ? 40 : 62}
                  ring="var(--ground)"
                />
              </span>

              {!compact && (
                <span className="rounded-full bg-ground px-2 text-[13px] font-semibold">{friend.name}</span>
              )}
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
