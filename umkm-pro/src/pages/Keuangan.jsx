import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Wallet, TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';

const Keuangan = () => {
  const { transactions } = useContext(StoreContext);

  const totalPendapatan = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalModal = transactions.reduce((sum, t) => sum + t.totalCogs, 0);
  const totalKeuntungan = transactions.reduce((sum, t) => sum + t.profit, 0);
  const jumlahTransaksi = transactions.length;

  const StatCard = ({ title, value, icon, colorClass, prefix = 'Rp' }) => (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div className="text-muted text-sm mb-1">{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className={colorClass}>
          {prefix === 'Rp' ? `Rp ${value.toLocaleString('id-ID')}` : value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 className="title mb-4 flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
        <Wallet /> Laporan Keuangan
      </h1>

      <div className="grid-cols-4 mb-6">
        <StatCard 
          title="Total Pendapatan (Omzet)" 
          value={totalPendapatan} 
          icon={<TrendingUp size={24} className="text-success" />} 
          colorClass="text-success"
        />
        <StatCard 
          title="Total Modal (HPP)" 
          value={totalModal} 
          icon={<Activity size={24} className="text-warning" />} 
          colorClass="text-warning"
        />
        <StatCard 
          title="Keuntungan Bersih" 
          value={totalKeuntungan} 
          icon={<Wallet size={24} className="text-primary" />} 
          colorClass=""
        />
        <StatCard 
          title="Jumlah Transaksi" 
          value={jumlahTransaksi} 
          icon={<Calendar size={24} className="text-muted" />} 
          colorClass=""
          prefix=""
        />
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ padding: '1.5rem 1.5rem 0', fontSize: '1.25rem', marginBottom: '1rem' }}>Riwayat Transaksi</h3>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto', border: 'none', borderTop: '1px solid var(--border-glass)' }}>
          <table className="table">
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th>Waktu</th>
                <th>ID Transaksi</th>
                <th>Item Terjual</th>
                <th>Total (Rp)</th>
                <th>Keuntungan (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-muted">Belum ada transaksi tercatat.</td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="text-muted">#{t.id.slice(-6)}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {t.items.map((item, idx) => (
                          <span key={idx} className="badge" style={{ background: 'var(--bg-primary)' }}>
                            {item.name} x{item.qty}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-success" style={{ fontWeight: 500 }}>{t.total.toLocaleString('id-ID')}</td>
                    <td className="text-primary" style={{ fontWeight: 500 }}>{t.profit.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Keuangan;
