import React from 'react';

const Revenue = () => {
  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Pendapatan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Laporan pemasukan dan tren keuangan</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
          <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '8px' }}>Total Pendapatan Bulan Ini</p>
          <h2 style={{ margin: 0, fontSize: '32px' }}>Rp 142.500.000</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '16px', display: 'inline-flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>
            +12.5% dari bulan lalu
          </div>
        </div>
        <div className="card">
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Tagihan Belum Dibayar</p>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#854d0e' }}>Rp 35.200.000</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Estimasi Pendapatan Berikutnya</p>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#166534' }}>Rp 28.000.000</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '48px', textAlign: 'center', border: '1px dashed var(--outline-variant)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>bar_chart</span>
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Grafik Tren Pendapatan</h3>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
          Integrasi grafik batang interaktif untuk laporan per kuartal sedang dipersiapkan.
        </p>
      </div>
    </div>
  );
};

export default Revenue;
