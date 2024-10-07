// src/LoginButton.js
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd'; // Importar el sistema de notificaciones de Ant Design
import "./login.css";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, user, logout,isLoading } = useAuth0();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const allowedEmail = process.env.REACT_APP_ALLOWED_EMAIL;

  const openNotification = () => {
    api.info({
      message: `Ingreso no autorizado`,
      description: "El usuario no está autorizado para acceder a esta sección",
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.email === allowedEmail) {
        navigate("/admin-dashboard");
      } else {
        openNotification(); 
         
        setTimeout(() => {
          logout();
        },1000 *4)
      }
    }
  }, [isAuthenticated, user, allowedEmail, navigate, logout]);

  return (
    <div className="login__wrapper">
      {contextHolder} 
      <div className="login__hero">
        <h2 className="login__title">Hola, ¡Qué bueno verte de vuelta!</h2>
        <button onClick={() => loginWithRedirect()} className="login__button" disabled={isLoading}>{isLoading ? <span class="loader"></span> : "Ingresar"}</button>

        <p className='login__text'>¿No eres administrador? <Link className='login__link' to={"/shop"}>Regresar a la tienda</Link></p>
      </div>
    </div>
  );
};

export default Login;
