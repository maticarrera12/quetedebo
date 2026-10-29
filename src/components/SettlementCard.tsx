import Avatar from "./Avatar";
import { money, personColor } from "../utils/format";
import type { Settlement } from "../utils/format";
import type { Friend } from "../types/types";

interface SettlementCardProps {
  settlement: Settlement;
  friends: Friend[];
  dark?: boolean;
  paid?: boolean;
  onToggle?: () => void;
}

const SettlementCard = ({ settlement, friends, dark = false, paid = false, onToggle }: SettlementCardProps) => {
  const surface = dark ? "bg-panel-item" : "bg-ground";
  const ring = dark ? "var(--panel-item)" : "var(--ground)";

  return (
    <li
      className={`flex flex-wrap items-center gap-x-3.5 gap-y-3 rounded-[18px] px-4 py-3.5 transition-opacity duration-300 ${surface} ${paid ? "opacity-60" : ""}`}
    >
      <div className="flex items-center">
        <Avatar name={settlement.from} color={personColor(friends, settlement.from)} size={40} ring={ring} />
        <span aria-hidden="true" className={`h-0.5 w-[22px] ${dark ? "bg-muted" : "bg-field-line"}`} />
        <Avatar name={settlement.to} color={personColor(friends, settlement.to)} size={40} ring={ring} />
      </div>

      <div className={`flex min-w-0 flex-1 basis-40 flex-col gap-0.5 ${paid ? "line-through" : ""}`}>
        <span className={`text-[15px] ${dark ? "text-panel-text" : "text-muted"}`}>
          <b className={dark ? "text-ground" : "text-ink"}>{settlement.from}</b> le pasa a{" "}
          <b className={dark ? "text-ground" : "text-ink"}>{settlement.to}</b>
        </span>

        <span className={`text-[22px] font-extrabold tracking-[-0.02em] tabular-nums ${dark ? "text-ground" : "text-ink"}`}>
          {money(settlement.amount)}
        </span>
      </div>

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={paid}
          className={`rounded-full border-[1.5px] px-3.5 py-2 text-sm font-bold whitespace-nowrap text-ground transition-colors duration-150 ${
            paid ? "border-sage bg-sage text-ink" : "border-muted bg-transparent hover:border-ground"
          }`}
        >
          {paid ? "Pagado" : "Marcar pagado"}
        </button>
      )}
    </li>
  );
};

export default SettlementCard;
