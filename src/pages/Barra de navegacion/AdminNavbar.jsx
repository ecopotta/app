import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./AdminNavbar.css";
import menuIcon from "../../assets/menuIcon.svg";
import logoIcon from "../../assets/Logo.png";
import LogoutButton from "../../pages/Administrador/Logout/Logout";

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleNav = () => {
    setIsOpen(prevState => !prevState);
  };

  const closeNav = () => {
    setIsOpen(false); 
  };

  const isActive = (path) => {
  
    return location.pathname === path;
  }

  return (
    <header className="header">
      <nav className="nav-pc">
        <div className="logo__container">
          <img src={logoIcon} alt="Logo" />
        </div>
        <ul>
          {/* <li className={isActive("/admin-dashboard") ? "active" : ""}>
            <Link to={"/admin-dashboard"}>Inicio</Link>
          </li> */}
          <li className={isActive("/products-and-categories") ? "active" : ""}>
            <Link to="/products-and-categories">Productos y categorías</Link>
          </li>
          <li className={isActive("/promotions") ? "active" : ""}>
            <Link to="/promotions">Promociones</Link>
          </li>
          <li className={isActive("/banners") ? "active" : ""}>
            <Link to="/banners">Banners</Link>
          </li>
          <li className={isActive("/settings") ? "active" : ""}>
            <Link to="/settings">Ajustes</Link>
          </li>
          <LogoutButton />
        </ul>
      </nav>

      <nav className="nav-phone">
        <div className="nav-phone__brand">
          <div className="logo__container">
            <img src={logoIcon} alt="Logo" />
          </div>
          <h1 className="nav-phone__title" style={{ color: "white" }}>Administración</h1>
        </div>
        
        <input type="checkbox" id="menu-toggle" className="menu-toggle" checked={isOpen} readOnly />
        <label htmlFor="menu-toggle" className="nav-phone__icon" onClick={toggleNav}>
          <img src={menuIcon} alt="Icono de menú" />
        </label>
        
        <div className={"nav-phone__menu"}>
          <ul>
            {/* <li className={isActive("/admin-dashboard") ? "active" : ""} onClick={closeNav}>
              <Link to={"/admin-dashboard"}>Inicio</Link>
            </li> */}
            <li className={isActive("/products-and-categories") ? "active" : ""} onClick={closeNav}>
              <Link to="/products-and-categories">Productos y categorías</Link>
            </li>
            <li className={isActive("/promotions") ? "active" : ""} onClick={closeNav}>
              <Link to="/promotions">Promociones</Link>
            </li>
            <li className={isActive("/banners") ? "active" : ""} onClick={closeNav}>
              <Link to="/banners">Banners</Link>
            </li>
            <li className={isActive("/settings") ? "active" : ""} onClick={closeNav}>
              <Link to="/settings">Ajustes</Link>
            </li>
            <LogoutButton />
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default AdminNavbar;
