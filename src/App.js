import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Login from './pages/Administrador/Login/Login.jsx';
import AdminDashboard from './pages/Administrador/AdminDashboard.jsx'; 
import "./App.css";
import ProductsAndCatManager from './pages/Administrador/Productos&Categorias/ProductsAndCatManager.jsx';
import PromotionsManager from './pages/Administrador/Promociones/PromotionsManager.jsx';
import BannersManager from './pages/Administrador/Banners/BannersManager.jsx';
import Shop from './pages/Usuarios/Shop.jsx';
import ProductDetails from './pages/Usuarios/componentes/DetallesDelProducto/ProductDetails.jsx';
import PromotionsView from './pages/Usuarios/componentes/Promociones/PromotionsView.jsx';
import PromotionDetails from './pages/Usuarios/componentes/DetallesDeLaPromocion/PromotionDetails.jsx';

// Componente para proteger las rutas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra algo mientras Auth0 carga
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/shop/*' element={<Shop />} />
        <Route path='/shop/product/:id' element={<ProductDetails />} />
        <Route path='/shop/promotions/*' element={<PromotionsView />} />
        <Route path='/shop/promotions/details/:id' element={<PromotionDetails />} />
        
        {/* Rutas protegidas para administradores */}
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

        <Route path='*' element={<Navigate to="/shop" replace />} />
      </Routes>
    </div>
  );
};

export default App;
