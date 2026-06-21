import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const { stats, shipments, activities, getDriverById } = useContext(AppContext);

  const activeShipments = shipments.filter(s => ['In-Transit', 'Picked Up', 'Delayed', 'Pending'].includes(s.status)).slice(0, 5);

  const handleExportCSV = () => {
    const headers = ['No. Resi', 'Asal', 'Tujuan', 'Status', 'Pengemudi', 'ETA', 'Pelanggan', 'Prioritas'];
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    activeShipments.forEach(s => {
      const driver = s.driverId ? getDriverById(s.driverId) : null;
      const driverName = driver ? driver.name : 'Belum Ditugaskan';
      const statusIndo = statusLabel(s.status);
      
      const row = [
        s.id,
        `"${s.origin}"`,
        `"${s.destination}"`,
        `"${statusIndo}"`,
        `"${driverName}"`,
        `"${s.eta}"`,
        `"${s.customer}"`,
        `"${s.priority}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data_pengiriman_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = [
    { label: 'Sen', value: 60, count: 152 },
    { label: 'Sel', value: 40, count: 98 },
    { label: 'Rab', value: 75, count: 188 },
    { label: 'Kam', value: 55, count: 136 },
    { label: 'Jum', value: 90, count: 244, peak: true },
    { label: 'Sab', value: 70, count: 176 },
    { label: 'Min', value: 65, count: 162 },
  ];

  const statusLabel = (status) => {
    const map = { 'In-Transit': 'Dalam Perjalanan', 'Picked Up': 'Dijemput', 'Delivered': 'Terkirim', 'Delayed': 'Tertunda', 'Pending': 'Menunggu' };
    return map[status] || status;
  };

  const statusBadge = (status) => {
    const map = { 'In-Transit': 'badge-transit', 'Picked Up': 'badge-picked', 'Delivered': 'badge-delivered', 'Delayed': 'badge-delayed', 'Pending': 'badge-pending' };
    return map[status] || 'badge-pending';
  };

  return (
    <div className="animate-slide-up">
      {/* Stats Grid */}
      <section style={{ marginBottom: '16px' }}>
        <div className="grid-4">
          <div className="card stat-card">
            <div className="stat-header">
              <span className="stat-icon material-symbols-outlined">shopping_cart</span>
              <span className="stat-badge up">+12.5% ↑</span>
            </div>
            <div>
              <p className="stat-label">Total Pesanan</p>
              <h2 className="stat-value">{stats.totalOrders.toLocaleString()}</h2>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-header">
              <span className="stat-icon material-symbols-outlined">local_shipping</span>
              <span className="stat-badge stable">Stabil</span>
            </div>
            <div>
              <p className="stat-label">Pengiriman Aktif</p>
              <h2 className="stat-value">{stats.activeShipments}</h2>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-header">
              <span className="stat-icon material-symbols-outlined">payments</span>
              <span className="stat-badge up">+8.2% ↑</span>
            </div>
            <div>
              <p className="stat-label">Pendapatan Bulan Ini</p>
              <h2 className="stat-value">Rp {(stats.revenue * 15).toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="card stat-card">
            <div className="stat-header">
              <span className="stat-icon material-symbols-outlined">badge</span>
              <span className="stat-badge alert">{stats.delayed} Peringatan</span>
            </div>
            <div>
              <p className="stat-label">Status Pengemudi</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h2 className="stat-value">{stats.driverOnlinePercent}%</h2>
                <span className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chart + Activity */}
      <div className="grid-1-2" style={{ marginBottom: '16px' }}>
        {/* Shipment Volume Chart */}
        <section className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-headline-md">Volume Pengiriman</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select className="form-control" style={{ padding: '4px 32px 4px 12px', background: 'var(--surface-container)', border: 'none', fontSize: '12px', fontWeight: 600 }}>
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
                <option>Tahun Berjalan</option>
              </select>
              <button className="icon-btn" style={{ width: 32, height: 32 }}>
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div style={{ padding: '24px', flex: 1, minHeight: '300px' }}>
            <div className="bar-chart-container">
              {chartData.map((d, i) => (
                <div key={i} className="bar-wrapper">
                  <div className="bar" style={{ height: `${d.value}%` }}>
                    {d.peak && <span className="peak-label">{d.count} Puncak</span>}
                  </div>
                  <span className="bar-label" style={{ position: 'relative', marginTop: '8px' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-headline-md">Aktivitas Terbaru</h3>
            <button className="font-label-md" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>Lihat Semua</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activities.slice(0, 6).map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${activity.color}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{activity.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="font-body-md">{activity.message}</p>
                  <p className="font-label-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Active Shipment Table */}
      <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 className="font-headline-md">Pelacakan Pengiriman Aktif</h3>
            <p className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>Status real-time barang yang sedang dalam perjalanan.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" onClick={handleExportCSV}>Ekspor CSV</button>
            <button className="btn btn-primary">Filter Pencarian</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Resi</th>
                <th>Tujuan</th>
                <th>Status</th>
                <th>Pengemudi</th>
                <th style={{ textAlign: 'right' }}>ETA</th>
              </tr>
            </thead>
            <tbody>
              {activeShipments.map(s => {
                const driver = s.driverId ? getDriverById(s.driverId) : null;
                return (
                  <tr key={s.id}>
                    <td className="font-mono" style={{ color: 'var(--primary)' }}>{s.id}</td>
                    <td className="font-body-md">{s.origin} → {s.destination}</td>
                    <td><span className={`badge ${statusBadge(s.status)}`}>{statusLabel(s.status)}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
                        </div>
                        <span className="font-body-md">{driver ? driver.name : 'Belum Ditugaskan'}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-body-md">{s.eta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
