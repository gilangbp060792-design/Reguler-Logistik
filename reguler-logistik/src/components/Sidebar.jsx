import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const navGroups = [
  {
    title: 'OPERASIONAL',
    items: [
      { path: '/dashboard', label: 'Dasbor', icon: 'dashboard' },
      { path: '/order-baru', label: 'Order Baru', icon: 'add_box' },
      { path: '/stt', label: 'Surat Jalan (STT)', icon: 'receipt_long' },
      { path: '/status-orderan', label: 'Status Orderan', icon: 'barcode_scanner' },
      { path: '/tracking', label: 'Lacak Resi', icon: 'search' },
      { path: '/shipments', label: 'Pengiriman', icon: 'local_shipping' },
    ]
  },
  {
    title: 'MASTER DATA',
    items: [
      { path: '/customers', label: 'Master Customer', icon: 'storefront' },
      { path: '/fleet', label: 'Armada', icon: 'groups' },
      { path: '/drivers', label: 'Pengemudi', icon: 'person_pin_circle' },
    ]
  },
  {
    title: 'CRM',
    items: [
      { path: '/customer-analysis', label: 'Analisis Pelanggan', icon: 'insights' },
      { path: '/customer-ranking', label: 'Peringkat Pelanggan', icon: 'military_tech' },
    ]
  },
  {
    title: 'KEUANGAN',
    items: [
      { path: '/invoice', label: 'Faktur / Invoice', icon: 'request_quote' },
      { path: '/revenue', label: 'Pendapatan', icon: 'payments' },
      { path: '/budget', label: 'Anggaran / Budget', icon: 'account_balance_wallet' },
    ]
  },
  {
    title: 'SISTEM',
    items: [
      { path: '/analytics', label: 'Analitik', icon: 'analytics' },
      { path: '/settings', label: 'Pengaturan', icon: 'settings' },
    ]
  }
];

const Sidebar = ({ onNewShipment }) => {
  const { logout, settings } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar" style={{ overflowY: 'auto' }}>
      <div className="sidebar-header" style={{ padding: '32px 24px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {settings?.appLogo ? (
          <img src={settings.appLogo} alt="Logo" style={{ height: '140px', width: '100%', objectFit: 'contain', marginBottom: '16px' }} />
        ) : (
          <h1 className="font-headline-lg">{settings?.companyName || 'Reguler Logistik'}</h1>
        )}
        <p className="font-label-md" style={{ marginTop: '0', width: '100%' }}>Konsol Admin</p>
      </div>

      <nav className="sidebar-nav" style={{ flex: 'none', paddingBottom: '24px' }}>
        {navGroups.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div style={{ padding: '0 24px', fontSize: '11px', fontWeight: 700, color: 'var(--on-surface-variant)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {group.title}
            </div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-md">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="new-shipment-btn" onClick={() => navigate('/order-baru')}>
          <span className="material-symbols-outlined">add</span>
          Order Baru
        </button>
        <div className="user-profile">
          <div className="avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="info">
            <p className="name">Profil Admin</p>
            <p className="role">Operasi Global</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Keluar">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
