import { useNavigate } from "react-router-dom";
import "../styles/NavbarComponent.css";

const NavbarComponent = () => {
  const navigate = useNavigate(); // Hook para la navegación

  return (
    <nav className="nav-bar-container">
      <div className="nav-bar">
        <div className="logo">
          <h1 onClick={()=> navigate('/')} className="logo-txt">
            ¿Que te <br />
            debo?
          </h1>
        </div>
        <div className="menu">
          <ul>
            <li onClick={() => navigate("/")}>Inicio</li>
            <li onClick={() => navigate("/history")}>Historial</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
