import { useLocation, useNavigate } from 'react-router-dom';

import type { JSX } from 'react'

import { IoMoonOutline } from "react-icons/io5";

function NavbarComponent(): JSX.Element {

  const navigate = useNavigate();

  const location = useLocation();



  return (

   <nav className="bg-background/60 backdrop-blur-md neon-nav py-3 sm:py-4 px-4 sm:px-6">

  <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    {/* Logo */}

    <div className="text-center sm:text-left">

      <h1

        onClick={() => navigate('/')}

        className="text-2xl sm:text-3xl font-bold neon-text cursor-pointer leading-tight tracking-wide"

        role="button"

        tabIndex={0}

      >

        ¿Qué te debo?

      </h1>

      <p className="text-sm sm:text-base text-muted-foreground neon-text-cyan mt-0.5">

        Dividi gastos de forma simple y justa

      </p>

    </div>



    {/* Links */}

    <div className="flex items-center justify-center sm:justify-end gap-5 sm:gap-6">

   <ul className="flex gap-5 sm:gap-6 text-foreground font-semibold text-lg sm:text-xl lg:text-2xl font-[family-name:var(--font-display)]">

  <li

    onClick={() => navigate('/')}

    className={`cursor-pointer transition-all duration-300 ${

      location.pathname === '/'

        ? 'neon-text-accent'

        : 'hover:text-primary hover:[text-shadow:0_0_12px_hsl(262_100%_70%_/_0.6)]'

    }`}

  >

    Inicio

  </li>

  <li

    onClick={() => navigate('/history')}

    className={`cursor-pointer transition-all duration-300 ${

      location.pathname === '/history'

        ? 'neon-text-accent'

        : 'hover:text-primary hover:[text-shadow:0_0_12px_hsl(262_100%_70%_/_0.6)]'

    }`}

  >

    Historial

  </li>

</ul>



<button className="text-2xl text-foreground hover:text-accent transition-all duration-300 hover:[text-shadow:0_0_12px_hsl(186_100%_50%_/_0.7)]">

  <IoMoonOutline className="text-2xl cursor-pointer" />

</button>

    </div>

  </div>

</nav>

  );

};



export default NavbarComponent;

