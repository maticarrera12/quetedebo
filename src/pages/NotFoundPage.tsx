import type { JSX } from "react";
import { Link } from "react-router-dom";

function NotFoundPage(): JSX.Element {
  return (
    <section className="px-4 pt-16 pb-8 text-center sm:px-0 sm:pt-24">
      <p className="text-sm font-bold text-accent-deep">Error 404</p>

      <h1 className="mx-auto mt-3 max-w-[18ch] text-[clamp(36px,5vw,60px)] leading-[0.98] font-extrabold tracking-[-0.04em] text-balance">
        Esta página no existe
      </h1>

      <p className="mx-auto mt-4 max-w-[34ch] text-[17px] text-muted">
        El link puede estar mal escrito o la página ya no está. Tu mesa de siempre sigue en el inicio.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-6 text-base font-bold text-ground"
      >
        Volver a la mesa
      </Link>
    </section>
  );
}

export default NotFoundPage;
