import type { JSX } from "react";

import { useInstall } from "../hooks/useInstall";
import { EXTERNAL_LINKS } from "../utils/links";

function FooterComponent(): JSX.Element {
  const { mode, bannerVisible, install, reopen } = useInstall();

  return (
    <footer className="mx-auto w-full max-w-[1180px] px-4 pb-8 sm:px-7">
      <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[15px] text-muted">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold text-ink">Matias Carrera</span>
        </p>

        <ul className="flex flex-wrap gap-5">
          {/* The way back to the install notice once it was dismissed. */}
          {mode && !bannerVisible && (
            <li>
              <button
                type="button"
                onClick={mode === "native" ? install : reopen}
                className="font-semibold text-ink transition-colors duration-150 hover:text-accent-deep"
              >
                Instalar app
              </button>
            </li>
          )}

          {EXTERNAL_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-accent-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default FooterComponent;
