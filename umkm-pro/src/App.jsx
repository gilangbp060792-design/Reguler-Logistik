import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { LayoutDashboard, ShoppingCart, Package, Calculator, Wallet } from 'lucide-react';

// Import Pages
import Kasir from './pages/Kasir';
import Inventory from './pages/Inventory';
import KalkulatorHPP from './pages/KalkulatorHPP';
import Keuangan from './pages/Keuangan';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Package size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>UMKM Pro</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Premium Management</span>
        </div>
      </div>
      
      <nav className="nav-links">
        <NavLink to="/kasir" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <ShoppingCart size={20} />
          <span>Kasir (POS)</span>
        </NavLink>
        <NavLink to="/inventory" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Package size={20} />
          <span>Inventaris</span>
        </NavLink>
        <NavLink to="/hpp" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Calculator size={20} />
          <span>Kalkulator HPP</span>
        </NavLink>
        <NavLink to="/keuangan" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Wallet size={20} />
          <span>Keuangan</span>
        </NavLink>
      </nav>
    </aside>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/kasir" replace />} />
              <Route path="/kasir" element={<Kasir />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/hpp" element={<KalkulatorHPP />} />
              <Route path="/keuangan" element={<Keuangan />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StoreProvider>
  );
};

export default App;
