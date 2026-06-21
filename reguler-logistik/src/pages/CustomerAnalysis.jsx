import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CustomerAnalysis = () => {
  const { customers, shipments } = useContext(AppContext);
  
  // Kalkulasi Nyata
  const totalShipments = shipments.length;
  
  // Hitung jumlah transaksi tiap pelanggan
  const customerFreq = {};
  shipments.forEach(s => {
    const cName = s.customer || 'Unknown';
    if (!customerFreq[cName]) customerFreq[cName] = { count: 0, totalValue: 0 };
    customerFreq[cName].count += 1;
    customerFreq[cName].totalValue += (s.totalBiaya || 0);
  });

  const uniqueCustomers = Object.keys(customerFreq).length || 1;
  const repeatCustomers = Object.values(customerFreq).filter(c => c.count > 1).length;
  
  const retentionRate = ((repeatCustomers / uniqueCustomers) * 100).toFixed(1);
  
  const totalRevenue = shipments.reduce((sum, s) => sum + (s.totalBiaya || 0), 0);
  const avgOrderValue = totalShipments > 0 ? (totalRevenue / totalShipments) : 0;
  const lifetimeValue = uniqueCustomers > 0 ? (totalRevenue / uniqueCustomers) : 0;

  // Top Customers by Value
  const topCustomers = Object.entries(customerFreq)
    .sort((a, b) => b[1].totalValue - a[1].totalValue)
    .slice(0, 5);

  const maxCustValue = topCustomers.length > 0 ? topCustomers[0][1].totalValue : 1;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Analisis Pelanggan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Wawasan mendalam tentang retensi dan nilai pelanggan secara aktual</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined">group_add</span>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', fontWeight: 600 }}>Tingkat Retensi</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: 'var(--on-surface)' }}>{retentionRate}%</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined">shopping_cart</span>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', fontWeight: 600 }}>Rata-rata Nilai Order</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: 'var(--on-surface)' }}>Rp {avgOrderValue.toLocaleString('id-ID')}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined">diamond</span>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', fontWeight: 600 }}>Rata-rata CLV</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: 'var(--on-surface)' }}>Rp {lifetimeValue.toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>bar_chart</span>
          Top 5 Pelanggan Berdasarkan Pendapatan
        </h3>
        
        {topCustomers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--outline)' }}>Belum ada data transaksi.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topCustomers.map(([name, data], idx) => {
              const percentage = Math.max((data.totalValue / maxCustValue) * 100, 5); // min 5% visual
              return (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 120px', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {name}
                  </div>
                  <div style={{ width: '100%', height: '16px', background: 'var(--surface-container-highest)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, var(--primary), #8b5cf6)', borderRadius: '8px', transition: 'width 1s ease-in-out' }}></div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    Rp {data.totalValue.toLocaleString('id-ID')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAnalysis;
