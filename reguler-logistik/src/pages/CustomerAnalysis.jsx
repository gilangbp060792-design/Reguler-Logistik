import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CustomerAnalysis = () => {
  const { customers, shipments } = useContext(AppContext);
  
  // Mock data
  const retentionRate = 84.5;
  const avgOrderValue = 'Rp 2.450.000';
  const lifetimeValue = 'Rp 45.200.000';

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Analisis Pelanggan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Wawasan mendalam tentang retensi dan nilai pelanggan</p>
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
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: 'var(--on-surface)' }}>{avgOrderValue}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined">diamond</span>
          </div>
          <div>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', fontWeight: 600 }}>Customer Lifetime Value (CLV)</p>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: 'var(--on-surface)' }}>{lifetimeValue}</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '48px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--outline-variant)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>insights</span>
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Grafik Analisis Terperinci</h3>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
          Visualisasi tren transaksi dan segmentasi pelanggan akan segera tersedia pada rilis pembaruan berikutnya.
        </p>
      </div>
    </div>
  );
};

export default CustomerAnalysis;
