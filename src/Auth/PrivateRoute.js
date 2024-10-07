// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { message, Spin } from 'antd';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
      
      return (
        <>
          <div className='loader__wrapper'>Aguarde...<span class="loader"></span></div>
        </>
      )
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
