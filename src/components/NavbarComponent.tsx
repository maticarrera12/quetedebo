import { useLocation, useNavigate } from 'react-router-dom';
import type { JSX } from 'react'
function NavbarComponent(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  return (
   <nav className="bg-white shadow-md py-4 px-6">
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    
    {/* Logo */}
    <div>
      <h1
        onClick={() => navigate('/')}
        className="text-3xl font-bold text-violet-600 cursor-pointer leading-tight"
        role="button"
        tabIndex={0}
      >
        ¿Qué te <br />
        debo?
      </h1>
    </div>

    {/* Links */}
    <div>
   <ul className="flex space-x-6 text-gray-700 font-semibold text-2xl">
  <li
    onClick={() => navigate('/')}
    className={`cursor-pointer transition-colors ${
      location.pathname === '/' ? 'text-violet-600' : 'hover:text-violet-600'
    }`}
  >
    Inicio
  </li>
  <li
    onClick={() => navigate('/history')}
    className={`cursor-pointer transition-colors ${
      location.pathname === '/history' ? 'text-violet-600' : 'hover:text-violet-600'
    }`}
  >
    Historial
  </li>
</ul>
    </div>
  </div>
</nav>
  );
};

export default NavbarComponent;
