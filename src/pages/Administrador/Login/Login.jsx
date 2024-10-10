import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd'; 
import './login.css';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const { isAuthenticated, user, logout, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [invalidUser, setInvalidUser] = useState(false);
  const allowedID = process.env.REACT_APP_ALLOWED_ID;
  const alreadyVerify = useRef(false);
  
  useEffect(() => {
    if (isAuthenticated && user && !alreadyVerify.current) {
      console.log(user.sub)
      if (allowedID !== user.sub) { // En Auth0, el 'sub' es el ID único del usuario
        alreadyVerify.current = true;
        setInvalidUser(true);
        notification.error({
          message: 'Error',
          description: 'No tienes permisos para acceder aquí',
        });
        setTimeout(() => {
          logout({ returnTo: window.location.origin }); // Cierra sesión y redirige
        }, 1000 * 5);
      } else {
        navigate('/products-and-categories');
      }
    }
  }, [isAuthenticated, user, navigate, logout, allowedID]);

  // Cuenta regresiva para redirigir en caso de usuario inválido
  const [cuentaRegresiva, setCuentaRegresiva] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setCuentaRegresiva(prevCuenta => {
        if (prevCuenta > 0) {
          return prevCuenta - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="login__wrapper">
      {contextHolder}
      <div className="login__hero">
        <h2 className="login__title">Hola, ¡Qué bueno verte de vuelta!</h2>

        {!isAuthenticated ? (
          <button 
            className="login__button" 
            onClick={() => loginWithRedirect()} 
            disabled={isLoading || invalidUser}
            style={{ backgroundColor: invalidUser ? 'red' : '' }}
          >
            {invalidUser ? (
              <>
                <p>Redirigiéndote en {cuentaRegresiva}...</p>
              </>
            ) : isLoading ? 'Cargando...' : 'Ingresar'}
          </button>
        ) : null}

        <p className='login__text'>
          ¿No eres administrador? <Link className='login__link' to={"/shop"}>Regresar a la tienda</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
