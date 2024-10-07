// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Administrador/Login/Login.jsx';
import PrivateRoute from './Auth/PrivateRoute.js'; 
import AdminDashboard from './pages/Administrador/AdminDashboard.jsx'; 
import "./App.css"
import ProductsAndCatManager from './pages/Administrador/Productos&Categorias/ProductsAndCatManager.jsx';
import PromotionsManager from './pages/Administrador/Promociones/PromotionsManager.jsx';
import BannersManager from './pages/Administrador/Banners/BannersManager.jsx';
import Settings from './pages/Administrador/Ajustes/Settings.jsx';
import Shop from './pages/Usuarios/Shop.jsx';
import ProductDetails from './pages/Usuarios/componentes/DetallesDelProducto/ProductDetails.jsx';
import PromotionsView from './pages/Usuarios/componentes/Promociones/PromotionsView.jsx';
import PromotionDetails from './pages/Usuarios/componentes/DetallesDeLaPromocion/PromotionDetails.jsx';
const App = () => {
  
  return (
    <div>
      
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/shop/*' element={<Shop/>}/>
        <Route path='/shop/product/:id' element={<ProductDetails/>}/>
        <Route path='/shop/promotions/*' element={<PromotionsView/>}/>
        <Route path='/shop/promotions/details/:id' element={<PromotionDetails/>}/>
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route
        path='/products-and-categories'
        element={
          <PrivateRoute>
            <ProductsAndCatManager />
          </PrivateRoute>
        }
        />
        <Route
        path='/promotions'
        element={
          <PrivateRoute>
            <PromotionsManager />
          </PrivateRoute>
        }
        />

        <Route
        path='/banners'
        element={
          <PrivateRoute>
            <BannersManager />
          </PrivateRoute>
        }
        />

        <Route
        path='/settings'
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
        />
      </Routes>
    </div>
  );
};

export default App;
