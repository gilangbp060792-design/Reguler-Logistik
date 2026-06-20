import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Analytics = () => {
  const { shipments, drivers, stats } = useContext(AppContext);

  const deliveredCount = shipments.filter(s => s.status === 'Delivered').length;
  const inTransitCount = shipments.filter(s => s.status === 'In-Transit').length;
  const pendingCount = shipments.filter(s => s.status === 'Pending').length;
  const delayedCount = shipments.filter(s => s.status === 'Delayed').length;
  const pickedUpCount = shipments.filter(s => s.status === 'Picked Up').length;
  const totalShipments = shipments.length;

  const statusDistribution = [
    { label: 'Terkirim', count: deliveredCount, color: '#16a34a', pct: totalShipments > 0 ? Math.round((deliveredCount / totalShipments) * 100) : 0 },
    { label: 'Dalam Perjalanan', count: inTransitCount, color: '#2563eb', pct: totalShipments > 0 ? Math.round((inTransitCount / totalShipments) * 100) : 0 },
    { label: 'Dijemput', count: pickedUpCount, color: '#0891b2', pct: totalShipments > 0 ? Math.round((pickedUpCount / totalShipments) * 100) : 0 },
    { label: 'Menunggu', count: pendingCount, color: '#6b7280', pct: totalShipments > 0 ? Math.round((pendingCount / totalShipments) * 100) : 0 },
    { label: 'Tertunda', count: delayedCount, color: '#ea580c', pct: totalShipments > 0 ? Math.round((delayedCount / totalShipments) * 100) : 0 },
  ];

  const weeklyData = [
    { label: 'Minggu 1', value: 85, count: 312 },
    { label: 'Minggu 2', value: 72, count: 264 },
    { label: 'Minggu 3', value: 95, count: 348 },
    { label: 'Minggu 4', value: 68, count: 249 },
  ];

  const topDrivers = [...drivers].sort((a, b) => b.totalDeliveries - a.totalDeliveries).slice(0, 5);

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Analitik & Laporan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Wawasan performa dan metrik operasional</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined">payments</span><span className="stat-badge up">+8.2%</span></div>
          <p className="stat-label">Total Pendapatan</p>
          <h2 className="stat-value">Rp {(stats.revenue * 15).toLocaleString('id-ID')}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: '#16a34a' }}>inventory_2</span></div>
          <p className="stat-label">Total Pengiriman Selesai</p>
          <h2 className="stat-value" style={{ color: '#16a34a' }}>{deliveredCount}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: '#2563eb' }}>schedule</span></div>
          <p className="stat-label">Rata-rata Waktu Kirim</p>
          <h2 className="stat-value" style={{ color: '#2563eb' }}>4.2 jam</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: 'var(--secondary)' }}>sentiment_satisfied</span></div>
          <p className="stat-label">Kepuasan Pelanggan</p>
          <h2 className="stat-value" style={{ color: 'var(--secondary)' }}>96%</h2>
        </div>
      </div>

      <div className="grid-1-2" style={{ marginBottom: '24px' }}>
        <section className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-headline-md">Performa Mingguan</h3>
            <select className="form-control" style={{ padding: '4px 32px 4px 12px', background: 'var(--surface-container)', border: 'none', fontSize: '12px', fontWeight: 600, width: 'auto' }}>
              <option>Bulan Ini</option><option>Bulan Lalu</option><option>Kuartal Terakhir</option>
            </select>
          </div>
          <div style={{ padding: '24px', flex: 1, minHeight: '260px' }}>
            <div className="bar-chart-container" style={{ height: '200px' }}>
              {weeklyData.map((d, i) => (
                <div key={i} className="bar-wrapper">
                  <div className="bar" style={{ height: `${d.value}%`, background: i === 2 ? 'rgba(0, 82, 204, 0.3)' : undefined }}>
                    <span className="peak-label" style={{ background: i === 2 ? 'var(--primary)' : 'var(--tertiary-container)', fontSize: '10px' }}>{d.count}</span>
                  </div>
                  <span className="bar-label" style={{ position: 'relative', marginTop: '8px', fontSize: '11px' }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)' }}>
            <h3 className="font-headline-md">Distribusi Status Pengiriman</h3>
          </div>
          <div style={{ padding: '24px' }}>
            {statusDistribution.map((s, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="font-body-md" style={{ fontWeight: 500 }}>{s.label}</span>
                  <span className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>{s.count} ({s.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--surface-container)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)' }}>
          <h3 className="font-headline-md">Pengemudi Terbaik</h3>
          <p className="font-label-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Peringkat berdasarkan total pengiriman selesai</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Peringkat</th><th>Pengemudi</th><th>Total Pengiriman</th><th>Rating</th><th>Status</th><th>Tanggal Bergabung</th></tr>
            </thead>
            <tbody>
              {topDrivers.map((d, i) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, background: i === 0 ? '#fef3c7' : i === 1 ? '#f1f5f9' : i === 2 ? '#fff7ed' : 'var(--surface-container)', color: i === 0 ? '#92400e' : i === 1 ? '#475569' : i === 2 ? '#9a3412' : 'var(--on-surface-variant)' }}>
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>person</span>
                      </div>
                      <div><span style={{ fontWeight: 500 }}>{d.name}</span><p className="font-mono" style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{d.id}</p></div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '16px' }}>{d.totalDeliveries}</td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f59e0b' }}>star</span><span style={{ fontWeight: 600 }}>{d.rating}</span></div></td>
                  <td><span className={`badge ${d.status === 'Online' ? 'badge-online' : 'badge-offline'}`}>{d.status}</span></td>
                  <td className="font-body-md">{d.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
