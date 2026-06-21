import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Revenue = () => {
  const { shipments } = useContext(AppContext);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const totalRevenue = shipments.reduce((sum, s) => sum + (s.totalBiaya || 0), 0);
  const pendingRevenue = shipments.filter(s => s.status !== 'Completed').reduce((sum, s) => sum + (s.totalBiaya || 0), 0);
  const completedRevenue = shipments.filter(s => s.status === 'Completed').reduce((sum, s) => sum + (s.totalBiaya || 0), 0);

  // Recent 5 transactions
  const recentTransactions = [...shipments].reverse().slice(0, 5);

  // Mock monthly data (based on real total)
  const monthlyData = [
    { month: 'Jan', value: totalRevenue * 0.4 },
    { month: 'Feb', value: totalRevenue * 0.6 },
    { month: 'Mar', value: totalRevenue * 0.5 },
    { month: 'Apr', value: totalRevenue * 0.8 },
    { month: 'Mei', value: totalRevenue * 0.7 },
    { month: 'Jun', value: totalRevenue }, // Current month is real total for demo
  ];
  
  const maxMonthVal = Math.max(...monthlyData.map(m => m.value)) || 1;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Pendapatan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Laporan pemasukan dan tren keuangan secara *real-time*</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', color: 'white' }}>
          <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Total Pendapatan Terkumpul</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 800 }}>Rp {completedRevenue.toLocaleString('id-ID')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '16px', fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '16px', display: 'inline-flex', backdropFilter: 'blur(4px)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
            Dana sudah cair & masuk sistem
          </div>
        </div>
        <div className="card">
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Potensi Pendapatan / Tagihan Aktif</p>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#d97706', fontWeight: 800 }}>Rp {pendingRevenue.toLocaleString('id-ID')}</h2>
          <div style={{ marginTop: '16px', color: 'var(--outline)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>pending_actions</span> Menunggu pengiriman selesai
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Chart Area */}
        <div className="card">
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>monitoring</span>
            Tren Pendapatan Bulanan
          </h3>
          
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px', gap: '16px' }}>
            {monthlyData.map((data, idx) => {
              const heightPct = Math.max((data.value / maxMonthVal) * 100, 5); // min 5%
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '12px' }}>
                  <div style={{ 
                    width: '100%', maxWidth: '60px', height: '240px', background: 'var(--surface-container-high)', 
                    borderRadius: '8px 8px 0 0', position: 'relative', overflow: 'hidden' 
                  }}>
                    <div style={{ 
                      position: 'absolute', bottom: 0, left: 0, right: 0, 
                      height: animate ? `${heightPct}%` : '0%', 
                      background: idx === monthlyData.length - 1 ? 'linear-gradient(180deg, var(--primary), #8b5cf6)' : '#cbd5e1', 
                      borderRadius: '8px 8px 0 0', transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}></div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--outline-variant)' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Transaksi Terkini Masuk</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentTransactions.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--outline)' }}>Belum ada transaksi.</div>
            ) : recentTransactions.map((tx, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: idx < recentTransactions.length - 1 ? '1px solid var(--outline-variant)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>receipt_long</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{tx.customer}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--on-surface-variant)' }}>{tx.id}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                  + Rp {tx.totalBiaya?.toLocaleString('id-ID') || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Revenue;
