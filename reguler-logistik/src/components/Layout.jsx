import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children, onNewShipment }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app-layout">
      <Sidebar onNewShipment={onNewShipment} />
      <main className="main-content">
        <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        {children}
      </main>
    </div>
  );
};

export default Layout;
