import type { JSX } from "react";

const links = [
  { label: "LinkedIn", href: "http://www.linkedin.com/in/matias-carrera" },
  { label: "GitHub", href: "https://github.com/maticarrera12" },
  { label: "Web", href: "https://matiascarreradev.com" },
];

function FooterComponent(): JSX.Element {
  return (
    <footer className="mx-auto w-full max-w-[1180px] px-4 pb-8 sm:px-7">
      <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[15px] text-muted">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold text-ink">Matias Carrera</span>
        </p>

        <ul className="flex gap-5">
          {links.map((link) => (
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
