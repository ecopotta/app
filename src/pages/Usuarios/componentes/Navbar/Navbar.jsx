import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../../../Administrador/../Barra de navegacion/AdminNavbar.css";
import menuIcon from "../../../../assets/menuIcon.svg";
import logoIcon from "../../../../assets/Logo.png";

function Navbar() {
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
                    <li className={isActive("/Inicio") ? "active" : ""}>
                        <Link to={"/shop"}>Inicio</Link>
                    </li>
                    <li className={isActive("/shop/promotions") ? "active" : ""}>
                        <Link to="/shop/promotions">Ofertas y promociones</Link>
                    </li>
                    {/* <li className={isActive("/About") ? "active" : ""}>
                        <Link to="/about">Sobre Nosotros</Link>
                    </li>
                    <li className={isActive("/contacto") ? "active" : ""}>
                        <Link to="/contacto">Contacto</Link>
                    </li>
                    <li className={isActive("/carrito") ? "active" : ""}>
                        <Link to="/carrito">Carrito</Link>
                    </li> */}
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
                        <li className={isActive("/Inicio") ? "active" : ""}>
                            <Link to={"/shop"}>Inicio</Link>
                        </li>
                        <li className={isActive("/shop/promotions") ? "active" : ""}>
                            <Link to="/shop/promotions">Ofertas y promociones</Link>
                        </li>
                        {/* <li className={isActive("/About") ? "active" : ""}>
                            <Link to="/about">Sobre Nosotros</Link>
                        </li>
                        <li className={isActive("/contacto") ? "active" : ""}>
                            <Link to="/contacto">Contacto</Link>
                        </li>
                        <li className={isActive("/carrito") ? "active" : ""}>
                            <Link to="/carrito">Carrito</Link>
                        </li> */}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
