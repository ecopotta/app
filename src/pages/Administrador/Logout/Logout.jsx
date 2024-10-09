// src/LogoutButton.js
import React from 'react';
import "./logout.css"
import { SignOutButton } from '@clerk/clerk-react';
const LogoutButton = () => {

  return <SignOutButton asChild><button className="logout-button">Cerrar sesión</button></SignOutButton>;
};

export default LogoutButton;
