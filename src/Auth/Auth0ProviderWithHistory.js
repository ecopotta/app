// src/Auth0ProviderWithHistory.js
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || location.pathname);
  };

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
