// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {Auth0Provider} from '@auth0/auth0-react';
import "./index.css"
import { AppContextProvider } from './Context';

const authDomain = process.env.REACT_APP_AUTH0_DOMAIN;
const authClientId = process.env.REACT_APP_AUTH0_CLIENT_ID

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Auth0Provider domain={authDomain} clientId={authClientId} redirectUri={window.location.origin}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Auth0Provider>
  </BrowserRouter>
);
