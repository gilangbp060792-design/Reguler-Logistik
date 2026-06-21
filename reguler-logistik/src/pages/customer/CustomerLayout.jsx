import React from 'react';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="customer-portal-root">
      <Outlet />
    </div>
  );
};

export default CustomerLayout;
