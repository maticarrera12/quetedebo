import { NavLink, useLocation, useNavigate } from "react-router-dom";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 flex-1 flex-col items-center gap-[3px] text-xs ${
    isActive ? "font-bold text-ink" : "font-semibold text-muted"
  }`;

const icon = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

// The phone's navigation: two places and, docked in the middle where a thumb lands, the one
// thing people do all the time. Sumar travels as router state so it works from any tab.
const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const openSheet = () => navigate("/", { replace: pathname === "/", state: { sumar: Date.now() } });

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-20 flex h-[calc(84px+env(safe-area-inset-bottom))] items-start border-t border-line bg-surface px-4 pt-2.5 pb-[env(safe-area-inset-bottom)]"
    >
      <NavLink to="/" end className={tabClass}>
        <svg {...icon}>
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="3.5" r="1.6" />
          <circle cx="20.5" cy="12" r="1.6" />
          <circle cx="12" cy="20.5" r="1.6" />
          <circle cx="3.5" cy="12" r="1.6" />
        </svg>
        Mesa
      </NavLink>

      <button
        type="button"
        onClick={openSheet}
        aria-label="Sumar a la mesa"
        className="-mt-[26px] flex flex-1 flex-col items-center gap-[3px] text-xs font-bold text-ink"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-surface bg-ink text-honey">
          <svg {...icon} width={26} height={26} strokeWidth={2.6}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        Sumar
      </button>

      <NavLink to="/history" className={tabClass}>
        <svg {...icon}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        Historial
      </NavLink>
    </nav>
  );
};

export default BottomNav;
