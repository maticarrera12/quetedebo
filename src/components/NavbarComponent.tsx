import { NavLink } from "react-router-dom";

import type { JSX } from "react";

import Mark from "./Mark";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-150 ${
    isActive ? "bg-ink text-ground" : "text-muted hover:text-accent-deep"
  }`;

function NavbarComponent(): JSX.Element {
  return (
    <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-5 sm:px-7">
      <NavLink to="/" className="flex items-center gap-3 text-[21px] font-bold tracking-[-0.02em]">
        <Mark />
        ¿Qué te debo?
      </NavLink>

      <nav aria-label="Principal" className="flex gap-1.5">
        <NavLink to="/" end className={linkClass}>
          Inicio
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          Historial
        </NavLink>
      </nav>
    </header>
  );
}

export default NavbarComponent;
