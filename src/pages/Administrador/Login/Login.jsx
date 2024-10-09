import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { notification } from 'antd'; 
import "./login.css";
import { SignInButton, useUser, useAuth, useClerk } from '@clerk/clerk-react';

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const { isLoaded,isSignedIn } = useAuth();
  const navigate = useNavigate()
  const { user } = useUser();
  const { signOut } = useClerk()
  const [invalidUser, setInvalidUser] = useState(false);
  const allowedID = process.env.REACT_APP_ALLOWED_ID
  const alreadyVerify = useRef(false)
  useEffect(() => {
      if (isSignedIn && user && !alreadyVerify.current) {
        
        if (allowedID !== user.id) {
          alreadyVerify.current = true
          setInvalidUser(true)
          notification.error({
            message: 'Error',
            description: 'No tienes permisos para acceder aquí',
            
          })
          setTimeout(() => {
            signOut();
          }, 1000*5);
          
        }else{
          navigate('/products-and-categories'); 
        }
      }
    }, [isSignedIn, user, navigate, signOut, allowedID]);

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
        
        <SignInButton asChild>
          <button 
            className="login__button"
            style={{backgroundColor: invalidUser ? "red" : ""}}
            disabled={!isLoaded || invalidUser}
          >
            {invalidUser ? <>
              <p>Redirigiendote en {cuentaRegresiva}...</p>
              
            </> : isLoaded ? 'Ingresar' : 'Cargando...'}
          </button>
        </SignInButton>

        <p className='login__text'>
          ¿No eres administrador? <Link className='login__link' to={"/shop"}>Regresar a la tienda</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
