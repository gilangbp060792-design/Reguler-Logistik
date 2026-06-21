import React, { useState } from 'react';

const Budget = () => {
  const [budgetLimit, setBudgetLimit] = useState(150000000); // 150 Juta
  const [expenses, setExpenses] = useState([
    { category: 'Bahan Bakar (BBM)', amount: 45000000, color: '#ef4444' },
    { category: 'Pemeliharaan Armada', amount: 22500000, color: '#f59e0b' },
    { category: 'Gaji Pengemudi', amount: 33750000, color: '#3b82f6' },
    { category: 'Tol & Parkir', amount: 11250000, color: '#8b5cf6' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category: 'Operasional Lainnya', amount: '' });

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = budgetLimit - totalExpense;
  const isOverBudget = remainingBudget < 0;

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return;
    
    // Assign a random color for new categories
    const colors = ['#10b981', '#14b8a6', '#f43f5e', '#a855f7', '#ec4899', '#64748b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const existingIndex = expenses.findIndex(exp => exp.category === form.category);
    
    if (existingIndex >= 0) {
      const newExpenses = [...expenses];
      newExpenses[existingIndex].amount += Number(form.amount);
      setExpenses(newExpenses);
    } else {
      setExpenses([...expenses, { category: form.category, amount: Number(form.amount), color: randomColor }]);
    }
    
    setShowModal(false);
    setForm({ category: 'Operasional Lainnya', amount: '' });
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Anggaran / Budget</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Pantau dan kelola pengeluaran operasional logistik</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Catat Pengeluaran
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Alokasi Pengeluaran Aktual</h3>
            <span style={{ fontSize: '12px', background: 'var(--surface-container-high)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Pagu: Rp {budgetLimit.toLocaleString('id-ID')}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {expenses.sort((a, b) => b.amount - a.amount).map((exp, idx) => {
              const percentage = Math.min((exp.amount / budgetLimit) * 100, 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: exp.color }}></div>
                      <span style={{ fontWeight: 600 }}>{exp.category}</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>Rp {exp.amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--surface-container-highest)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, background: exp.color, borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {isOverBudget && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#ef4444', color: 'white', fontSize: '12px', padding: '4px', fontWeight: 600 }}>OVER BUDGET</div>}
          
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 600, marginTop: isOverBudget ? '24px' : 0 }}>Total Pengeluaran Berjalan</p>
          <h2 style={{ margin: 0, fontSize: '36px', color: isOverBudget ? '#dc2626' : '#0f172a', fontWeight: 800 }}>Rp {totalExpense.toLocaleString('id-ID')}</h2>
          
          <div style={{ marginTop: '24px', padding: '16px', background: isOverBudget ? '#fef2f2' : '#f0fdf4', borderRadius: '12px', width: '100%' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--on-surface-variant)' }}>{isOverBudget ? 'Kekurangan Anggaran' : 'Sisa Anggaran Tersedia'}</p>
            <h3 style={{ margin: 0, fontSize: '20px', color: isOverBudget ? '#991b1b' : '#166534' }}>
              Rp {Math.abs(remainingBudget).toLocaleString('id-ID')}
            </h3>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="font-headline-md">Catat Pengeluaran Baru</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Kategori Pengeluaran</label>
                  <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="Bahan Bakar (BBM)">Bahan Bakar (BBM)</option>
                    <option value="Pemeliharaan Armada">Pemeliharaan Armada</option>
                    <option value="Gaji Pengemudi">Gaji Pengemudi</option>
                    <option value="Tol & Parkir">Tol & Parkir</option>
                    <option value="Biaya Pemasaran">Biaya Pemasaran</option>
                    <option value="Operasional Lainnya">Operasional Lainnya</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nominal Pengeluaran (Rp)</label>
                  <input type="number" className="form-control" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Contoh: 500000" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#dc2626' }}>Simpan Pengeluaran</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
