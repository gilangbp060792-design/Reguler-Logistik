import React from 'react';

const Invoice = () => {
  const invoices = [
    { id: 'INV-2024-001', customer: 'PT Maju Bersama', date: '18 Dec 2024', due: '18 Jan 2025', amount: 'Rp 4.500.000', status: 'Unpaid' },
    { id: 'INV-2024-002', customer: 'CV Sentosa Jaya', date: '15 Dec 2024', due: '15 Jan 2025', amount: 'Rp 2.100.000', status: 'Paid' },
    { id: 'INV-2024-003', customer: 'Toko Sumber Rejeki', date: '10 Dec 2024', due: '10 Jan 2025', amount: 'Rp 8.750.000', status: 'Overdue' },
  ];

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Faktur / Invoice</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Kelola penagihan pelanggan</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Buat Invoice Baru
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--outline-variant)' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>No. Invoice</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Pelanggan</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Tanggal</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Jatuh Tempo</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Jumlah Tagihan</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, index) => (
              <tr key={index} style={{ borderBottom: index < invoices.length - 1 ? '1px solid var(--outline-variant)' : 'none' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: '#0f172a' }}>{inv.id}</td>
                <td style={{ padding: '16px 24px', color: 'var(--on-surface)' }}>{inv.customer}</td>
                <td style={{ padding: '16px 24px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>{inv.date}</td>
                <td style={{ padding: '16px 24px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>{inv.due}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', color: '#0f172a', fontWeight: 600 }}>{inv.amount}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600,
                    background: inv.status === 'Paid' ? '#dcfce7' : inv.status === 'Unpaid' ? '#fef9c3' : '#fee2e2',
                    color: inv.status === 'Paid' ? '#166534' : inv.status === 'Unpaid' ? '#854d0e' : '#991b1b'
                  }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px', border: 'none' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>print</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
