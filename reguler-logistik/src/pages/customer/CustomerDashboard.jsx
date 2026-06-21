import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CustomerOrderBaru from './CustomerOrderBaru';
import CustomerTracking from './CustomerTracking';
import CustomerProfile from './CustomerProfile';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('order-baru');
  const { logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ overflowY: 'auto' }}>
        <div className="sidebar-header" style={{ padding: '32px 24px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1 className="font-headline-lg" style={{ color: 'var(--primary)' }}>Reguler Logistik</h1>
          <p className="font-label-md" style={{ marginTop: '0', width: '100%' }}>Customer Portal</p>
        </div>
        <nav className="sidebar-nav" style={{ flex: 'none', paddingBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ padding: '0 24px', fontSize: '11px', fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              LAYANAN PELANGGAN
            </div>
            <button 
              onClick={() => setActiveTab('order-baru')}
              className={`nav-item ${activeTab === 'order-baru' ? 'active' : ''}`}
              style={{ width: 'calc(100% - 24px)', margin: '0 12px', border: 'none', background: activeTab === 'order-baru' ? 'var(--primary-container)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined">add_box</span>
              <span className="font-label-md">Order Baru</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('history-order')}
              className={`nav-item ${activeTab === 'history-order' ? 'active' : ''}`}
              style={{ width: 'calc(100% - 24px)', margin: '0 12px', border: 'none', background: activeTab === 'history-order' ? 'var(--primary-container)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined">history</span>
              <span className="font-label-md">History Order</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('lacak-resi')}
              className={`nav-item ${activeTab === 'lacak-resi' ? 'active' : ''}`}
              style={{ width: 'calc(100% - 24px)', margin: '0 12px', border: 'none', background: activeTab === 'lacak-resi' ? 'var(--primary-container)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined">search</span>
              <span className="font-label-md">Lacak Resi</span>
            </button>

            <button 
              onClick={() => setActiveTab('profil')}
              className={`nav-item ${activeTab === 'profil' ? 'active' : ''}`}
              style={{ width: 'calc(100% - 24px)', margin: '0 12px', border: 'none', background: activeTab === 'profil' ? 'var(--primary-container)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined">person</span>
              <span className="font-label-md">Informasi Data</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="info">
              <p className="name">PT Maju Bersama</p>
              <p className="role">CUST-0001</p>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Keluar" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'order-baru' && <CustomerOrderBaru />}
        {activeTab === 'history-order' && <HistoryOrderTab />}
        {activeTab === 'lacak-resi' && <CustomerTracking />}
        {activeTab === 'profil' && <CustomerProfile />}
      </main>
    </div>
  );
};
const HistoryOrderTab = () => {
  const { shipments } = useContext(AppContext);
  
  return (
    <div className="max-w-4xl animate-slide-up">
      <h2 className="font-headline-lg text-primary mb-6">History Order</h2>
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        {shipments.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">Belum ada riwayat pesanan.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="p-4 font-label-md text-on-surface-variant">Resi</th>
                <th className="p-4 font-label-md text-on-surface-variant">Tujuan</th>
                <th className="p-4 font-label-md text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-mono-data text-primary font-bold">{s.id}</td>
                  <td className="p-4 text-on-surface font-body-md">{s.destination}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-label-md text-xs font-bold ${
                      s.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      s.status === 'In-Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
