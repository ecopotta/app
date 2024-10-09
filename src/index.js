// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from "@clerk/clerk-react" 
import "./index.css"
import { AppContextProvider } from './Context';
const PUBLISHABLE_KEY = process.env.REACT_APP_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </ClerkProvider>
  </BrowserRouter>
);
