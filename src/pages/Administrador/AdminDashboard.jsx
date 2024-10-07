import React from 'react';

import AdminNavbar from '../Barra de navegacion/AdminNavbar';

const AdminDashboard = () => {

  return (
    <>
      <AdminNavbar />
      <div className='container__wrapper'>
        <h2 className='title'>Dashboard de Administrador</h2>
        <p>Aqui apareceran los pedidos de los clientes</p>
      </div>
    </>
  );
};

export default AdminDashboard;
