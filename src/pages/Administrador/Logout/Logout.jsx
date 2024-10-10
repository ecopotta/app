import React from 'react';
import "./logout.css";
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0(); // Obtenemos la función de cierre de sesión desde Auth0

  return (
    <button 
      className="logout-button" 
      onClick={() => logout({ returnTo: window.location.origin })} // Redirige al cerrar sesión
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
