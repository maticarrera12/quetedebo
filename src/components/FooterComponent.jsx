import "../styles/FooterComponent.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
const FooterComponent = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="right">
          <p>© Matias Carrera 2025</p>
        </div>
        <div className="left">
          <a
            href="http://www.linkedin.com/in/matias-carrera-761b45328"
            target="_blank"
            rel="noopener noreferrer"
            className="link-button"
          >
            <LinkedInIcon />
          </a>
          <a
            href="https://github.com/maticarrera12"
            target="_blank"
            rel="noopener noreferrer"
            className="link-button"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://matiascarrera.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="link-button"
          >
            <LanguageIcon />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
