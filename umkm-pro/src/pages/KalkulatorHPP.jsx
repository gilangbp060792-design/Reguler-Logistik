import React, { useState } from 'react';
import { Calculator, Plus, Trash2, ArrowRight } from 'lucide-react';

const KalkulatorHPP = () => {
  const [bahanBaku, setBahanBaku] = useState([{ id: 1, name: '', cost: 0 }]);
  const [tenagaKerja, setTenagaKerja] = useState([{ id: 1, name: '', cost: 0 }]);
  const [overhead, setOverhead] = useState([{ id: 1, name: '', cost: 0 }]);
  const [targetProduksi, setTargetProduksi] = useState(1);
  const [marginProfit, setMarginProfit] = useState(30);

  const handleAddItem = (setter, items) => {
    setter([...items, { id: Date.now(), name: '', cost: 0 }]);
  };

  const handleRemoveItem = (setter, items, id) => {
    setter(items.filter(item => item.id !== id));
  };

  const handleChangeItem = (setter, items, id, field, value) => {
    setter(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const sumCosts = (items) => items.reduce((sum, item) => sum + Number(item.cost), 0);

  const totalBahanBaku = sumCosts(bahanBaku);
  const totalTenagaKerja = sumCosts(tenagaKerja);
  const totalOverhead = sumCosts(overhead);
  
  const totalBiayaProduksi = totalBahanBaku + totalTenagaKerja + totalOverhead;
  const hppPerUnit = targetProduksi > 0 ? totalBiayaProduksi / targetProduksi : 0;
  
  const hargaJualSaran = hppPerUnit + (hppPerUnit * (marginProfit / 100));

  const renderSection = (title, items, setter) => (
    <div className="glass-card mb-4" style={{ padding: '1.5rem' }}>
      <div className="flex-between mb-3">
        <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
        <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleAddItem(setter, items)}>
          <Plus size={14} /> Tambah
        </button>
      </div>
      
      {items.map((item, index) => (
        <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 2 }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nama Biaya/Item" 
              value={item.name}
              onChange={(e) => handleChangeItem(setter, items, item.id, 'name', e.target.value)}
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: 'var(--text-secondary)' }}>Rp</span>
            <input 
              type="number" 
              className="form-control" 
              style={{ paddingLeft: '2.5rem' }}
              value={item.cost === 0 ? '' : item.cost}
              onChange={(e) => handleChangeItem(setter, items, item.id, 'cost', e.target.value)}
            />
          </div>
          <button 
            style={{ color: 'var(--accent-danger)', background: 'transparent', padding: '0.5rem' }}
            onClick={() => handleRemoveItem(setter, items, item.id)}
            disabled={items.length === 1}
          >
            <Trash2 size={18} style={{ opacity: items.length === 1 ? 0.3 : 1 }} />
          </button>
        </div>
      ))}
      <div className="text-right mt-3 text-muted" style={{ fontSize: '0.875rem' }}>
        Subtotal: <span className="text-primary font-weight-bold" style={{ color: 'white' }}>Rp {sumCosts(items).toLocaleString('id-ID')}</span>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ height: '100%', overflowY: 'auto' }}>
      <h1 className="title mb-4 flex-center" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
        <Calculator /> Kalkulator HPP
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Input Section */}
        <div>
          {renderSection('1. Biaya Bahan Baku', bahanBaku, setBahanBaku)}
          {renderSection('2. Biaya Tenaga Kerja Langsung', tenagaKerja, setTenagaKerja)}
          {renderSection('3. Biaya Overhead (Listrik, Sewa, dll)', overhead, setOverhead)}
        </div>

        {/* Result Section */}
        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '0', padding: '1.5rem' }}>
            <h3 className="mb-4" style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>Ringkasan HPP</h3>
            
            <div className="form-group">
              <label className="form-label">Target Produksi (Unit/Porsi)</label>
              <input 
                type="number" 
                className="form-control" 
                value={targetProduksi}
                onChange={(e) => setTargetProduksi(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="mb-4" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)' }}>
              <div className="flex-between mb-2">
                <span className="text-muted text-sm">Total Biaya Produksi</span>
                <span>Rp {totalBiayaProduksi.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex-between">
                <span className="font-weight-bold" style={{ color: 'var(--accent-warning)' }}>HPP per Unit</span>
                <span className="font-weight-bold" style={{ color: 'var(--accent-warning)', fontSize: '1.25rem' }}>Rp {Math.round(hppPerUnit).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="form-group mt-4">
              <label className="form-label flex-between">
                <span>Margin Keuntungan (%)</span>
                <span>{marginProfit}%</span>
              </label>
              <input 
                type="range" 
                min="0" max="200" step="5"
                className="w-full"
                value={marginProfit}
                onChange={(e) => setMarginProfit(Number(e.target.value))}
                style={{ accentColor: 'var(--accent-success)' }}
              />
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))', padding: '1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div className="text-center mb-1 text-sm text-success">Saran Harga Jual</div>
              <div className="text-center" style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#34d399' }}>
                Rp {Math.round(hargaJualSaran).toLocaleString('id-ID')}
              </div>
            </div>
            
            <p className="text-muted mt-3 text-center" style={{ fontSize: '0.75rem' }}>
              *Gunakan hasil HPP ini saat menambah produk baru di menu Inventaris.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KalkulatorHPP;
