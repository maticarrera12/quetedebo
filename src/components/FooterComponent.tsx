import type { JSX } from "react";

import { AiFillLinkedin } from "react-icons/ai";

import { FaGithubSquare } from "react-icons/fa";

import { MdLanguage } from "react-icons/md";

function FooterComponent(): JSX.Element {
  return (
    <footer className="w-full px-4 sm:px-6 pb-6">
      <div className="max-w-6xl mx-auto bg-primary/5 backdrop-blur-sm neon-footer py-5 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Texto */}

        <div className="text-foreground text-base font-medium text-center md:text-left">
          <p>
            {" "}
            &copy;<span className="neon-text-accent">Matias Carrera</span>{" "}
            {new Date().getFullYear()}
          </p>
        </div>

        {/* Íconos */}

        <div className="flex space-x-4 text-2xl text-foreground">
          <a
            href="http://www.linkedin.com/in/matias-carrera"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-cyan transition-all duration-300 hover:[text-shadow:0_0_12px_hsl(186_100%_50%_/_0.8)]"
          >
            <AiFillLinkedin size={32} />
          </a>

          <a
            href="https://github.com/maticarrera12"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-magenta transition-all duration-300 hover:[text-shadow:0_0_12px_hsl(300_100%_60%_/_0.8)]"
          >
            <FaGithubSquare size={32} />
          </a>

          <a
            href="https://matiascarreradev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-violet transition-all duration-300 hover:[text-shadow:0_0_12px_hsl(262_100%_65%_/_0.8)]"
          >
            <MdLanguage size={32} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterComponent;
