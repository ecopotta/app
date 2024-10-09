// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Administrador/Login/Login.jsx';
import AdminDashboard from './pages/Administrador/AdminDashboard.jsx'; 
import "./App.css"
import ProductsAndCatManager from './pages/Administrador/Productos&Categorias/ProductsAndCatManager.jsx';
import PromotionsManager from './pages/Administrador/Promociones/PromotionsManager.jsx';
import BannersManager from './pages/Administrador/Banners/BannersManager.jsx';
import Shop from './pages/Usuarios/Shop.jsx';
import ProductDetails from './pages/Usuarios/componentes/DetallesDelProducto/ProductDetails.jsx';
import PromotionsView from './pages/Usuarios/componentes/Promociones/PromotionsView.jsx';
import PromotionDetails from './pages/Usuarios/componentes/DetallesDeLaPromocion/PromotionDetails.jsx';
import { SignedIn } from '@clerk/clerk-react';
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
            <SignedIn>
              <AdminDashboard />
            </SignedIn>
          } 
        />
        <Route
        path='/products-and-categories'
        element={
          <SignedIn>
            <ProductsAndCatManager />
          </SignedIn>
        }
        />
        <Route
        path='/promotions'
        element={
          <SignedIn>
            <PromotionsManager />
          </SignedIn>
        }
        />

        <Route
        path='/banners'
        element={
          <SignedIn>
            <BannersManager />
          </SignedIn>
        }
        />

        <Route
        path='*'
        element={<Navigate to="/shop" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;
