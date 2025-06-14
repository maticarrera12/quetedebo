import type { JSX } from "react";
import { AiFillLinkedin } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

function FooterComponent(): JSX.Element {
  return (
  <footer className="bg-violet-700 shadow-inner py-6 px-4 mt-10">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    
    {/* Texto */}
    <div className="text-white text-md font-medium text-center md:text-left">
      <p>&copy; Matias Carrera 2025</p>
    </div>

    {/* Íconos */}
    <div className="flex space-x-4 text-2xl text-white">
      <a
        href="http://www.linkedin.com/in/matias-carrera"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-violet-300 transition-colors"
      >
        <AiFillLinkedin size={32}/>
      </a>
      <a
        href="https://github.com/maticarrera12"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-violet-300 transition-colors"
      >
        <FaGithubSquare size={32}/>
      </a>
      <a
        href="https://matiascarreradev.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-violet-300 transition-colors"
      >
        <MdLanguage size={32}/>
      </a>
    </div>
    
  </div>
</footer>
  );
};

export default FooterComponent;
