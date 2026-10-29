import { money } from "../utils/format";

interface MoneyFigureProps {
  amount: number;
  className?: string;
  centsClassName?: string;
}

// Whole units at full size, cents smaller, so the number itself carries the weight.
const MoneyFigure = ({ amount, className = "", centsClassName = "opacity-70" }: MoneyFigureProps) => {
  const [units, cents] = money(amount).split(",");

  return (
    <span className={`tabular-nums ${className}`}>
      {units}
      <span className={`text-[0.5em] ${centsClassName}`}>,{cents}</span>
    </span>
  );
};

export default MoneyFigure;
