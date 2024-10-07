// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Auth0ProviderWithHistory from './Auth/Auth0ProviderWithHistory';
import "./index.css"
import { AppContextProvider } from './Context';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0ProviderWithHistory>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Auth0ProviderWithHistory>
  </BrowserRouter>
);
