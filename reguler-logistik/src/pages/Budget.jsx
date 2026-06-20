import React from 'react';

const Budget = () => {
  const expenses = [
    { category: 'Bahan Bakar (BBM)', amount: 'Rp 45.000.000', percentage: 40, color: '#ef4444' },
    { category: 'Pemeliharaan Armada', amount: 'Rp 22.500.000', percentage: 20, color: '#f59e0b' },
    { category: 'Gaji Pengemudi', amount: 'Rp 33.750.000', percentage: 30, color: '#3b82f6' },
    { category: 'Tol & Parkir', amount: 'Rp 11.250.000', percentage: 10, color: '#8b5cf6' },
  ];

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Anggaran / Budget</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Pantau pengeluaran operasional logistik</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Catat Pengeluaran
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>Alokasi Pengeluaran Bulan Ini</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {expenses.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span style={{ fontWeight: 600 }}>{exp.category}</span>
                  <span>{exp.amount}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--surface-container-highest)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${exp.percentage}%`, background: exp.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Total Pengeluaran</p>
          <h2 style={{ margin: 0, fontSize: '32px', color: '#dc2626' }}>Rp 112.500.000</h2>
          <div style={{ marginTop: '16px', padding: '12px', background: '#fef2f2', borderRadius: '8px', color: '#991b1b', fontSize: '13px' }}>
            Masih dalam batas anggaran (Rp 150.000.000)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
