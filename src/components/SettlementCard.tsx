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
  // The phone row: one line with a round check, sized for a thumb.
  compact?: boolean;
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const SettlementCard = ({
  settlement,
  friends,
  dark = false,
  paid = false,
  onToggle,
  compact = false,
}: SettlementCardProps) => {
  const surface = dark ? "bg-panel-item" : "bg-ground";
  const ring = dark ? "var(--panel-item)" : "var(--ground)";

  if (compact) {
    return (
      <li
        className={`flex h-16 items-center gap-2.5 rounded-2xl pr-2 pl-3 transition-opacity duration-300 ${surface} ${paid ? "opacity-65" : ""}`}
      >
        <span aria-hidden="true" className="flex flex-none items-center">
          <Avatar name={settlement.from} color={personColor(friends, settlement.from)} size={34} ring={ring} />
          <span className={`h-0.5 w-2 ${dark ? "bg-muted" : "bg-field-line"}`} />
          <Avatar name={settlement.to} color={personColor(friends, settlement.to)} size={34} ring={ring} />
        </span>

        <div className={`flex min-w-0 flex-1 flex-col leading-tight ${paid ? "line-through" : ""}`}>
          <span className={`truncate text-[15px] font-bold ${dark ? "text-ground" : "text-ink"}`}>{settlement.from}</span>
          <span className={`truncate text-[13px] ${dark ? "text-panel-text" : "text-muted"}`}>a {settlement.to}</span>
        </div>

        <span
          className={`flex-none text-[17px] font-extrabold tracking-[-0.02em] tabular-nums ${dark ? "text-surface" : "text-ink"} ${paid ? "line-through" : ""}`}
        >
          {money(settlement.amount)}
        </span>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={paid}
            aria-label={`${paid ? "Pagado" : "Marcar pagado"}: ${settlement.from} a ${settlement.to}`}
            className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border-[1.5px] transition-colors duration-150 ${
              paid ? "border-sage bg-sage text-ink" : "border-[#8a7d6a] bg-transparent text-panel-text"
            }`}
          >
            <CheckIcon />
          </button>
        )}
      </li>
    );
  }

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
