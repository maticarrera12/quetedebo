import { useEffect } from "react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

import { INTENT_PAGES } from "../content/intents";
import type { IntentPage } from "../content/intents";

// The text of a search-intent page, under the same calculator as the home.
function IntentContent({ page }: { page: IntentPage }): JSX.Element {
  // Moving between guides never reloads the page, so the tab title follows by hand.
  useEffect(() => {
    const previous = document.title;
    document.title = page.title;
    return () => {
      document.title = previous;
    };
  }, [page.title]);

  const others = INTENT_PAGES.filter((other) => other.path !== page.path);

  return (
    <article className="mx-auto max-w-[760px] px-4 pt-8 pb-8 sm:px-0 sm:pt-14">
      <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-balance sm:text-4xl">{page.heading}</h2>

      <p className="mt-4 text-[17px] text-muted">{page.intro}</p>

      <ol className="mt-6 list-decimal space-y-2 pl-5 text-[17px] marker:font-bold marker:text-accent-deep">
        {page.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <p className="mt-6 rounded-2xl bg-sand p-4 text-[15px] text-sand-ink">{page.example}</p>

      {page.note && <p className="mt-4 text-[15px] text-muted">{page.note}</p>}

      <nav aria-label="Otras guías" className="mt-10 border-t border-line pt-6">
        <p className="text-sm font-bold text-muted">Otras guías</p>
        <ul className="mt-2 space-y-1">
          {others.map((other) => (
            <li key={other.path}>
              <Link to={other.path} className="font-semibold text-accent-deep underline-offset-4 hover:underline">
                {other.linkLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}

export default IntentContent;
