import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CustomerRanking = () => {
  const { customers } = useContext(AppContext);
  
  // Mock ranking data
  const rankingData = [
    { rank: 1, name: 'PT Maju Bersama', orders: 154, revenue: 'Rp 125.400.000', trend: 'up' },
    { rank: 2, name: 'CV Sentosa Jaya', orders: 132, revenue: 'Rp 98.200.000', trend: 'up' },
    { rank: 3, name: 'Toko Sumber Rejeki', orders: 89, revenue: 'Rp 45.100.000', trend: 'down' },
    { rank: 4, name: 'PT Logistik Nusantara', orders: 67, revenue: 'Rp 34.800.000', trend: 'up' },
    { rank: 5, name: 'CV Andalas Express', orders: 45, revenue: 'Rp 21.500.000', trend: 'same' },
  ];

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Peringkat Pelanggan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Daftar pelanggan teratas berdasarkan volume dan pendapatan</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--outline-variant)' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Peringkat</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Pelanggan</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Total Order</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Pendapatan (IDR)</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Tren</th>
            </tr>
          </thead>
          <tbody>
            {rankingData.map((item, index) => (
              <tr key={index} style={{ borderBottom: index < rankingData.length - 1 ? '1px solid var(--outline-variant)' : 'none' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: item.rank <= 3 ? '#fffbeb' : '#f1f5f9',
                    color: item.rank === 1 ? '#d97706' : item.rank === 2 ? '#64748b' : item.rank === 3 ? '#b45309' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px',
                    border: item.rank <= 3 ? `1px solid ${item.rank === 1 ? '#fcd34d' : item.rank === 2 ? '#cbd5e1' : '#fcd34d'}` : 'none'
                  }}>
                    {item.rank}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary)' }}>{item.name}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--on-surface)' }}>{item.orders}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', color: 'var(--on-surface)', fontWeight: 500 }}>{item.revenue}</td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ 
                    color: item.trend === 'up' ? '#16a34a' : item.trend === 'down' ? '#dc2626' : '#94a3b8',
                    fontSize: 20
                  }}>
                    {item.trend === 'up' ? 'trending_up' : item.trend === 'down' ? 'trending_down' : 'trending_flat'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerRanking;
