import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const Invoice = () => {
  const { shipments, settings } = useContext(AppContext);
  const [invoices, setInvoices] = useState([]);
  const [customInvoices, setCustomInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ 
    customer: '', 
    amount: 0, 
    due: '', 
    resi: '', 
    startDate: '', 
    endDate: '' 
  });

  const displayInvoices = [...customInvoices, ...invoices];

  // Logic for monthly billing
  const deliveredShipments = shipments.filter(s => s.status === 'Delivered');
  const uniqueCustomers = [...new Set(deliveredShipments.map(s => s.customer))].filter(Boolean);

  useEffect(() => {
    if (!newInvoice.customer || !newInvoice.startDate || !newInvoice.endDate) {
      if (!newInvoice.customer) setNewInvoice(prev => ({ ...prev, amount: 0, resi: '' }));
      return;
    }
    const start = new Date(newInvoice.startDate);
    const end = new Date(newInvoice.endDate);
    end.setHours(23, 59, 59, 999);

    const customerShipments = deliveredShipments.filter(s => {
      if (s.customer !== newInvoice.customer) return false;
      const sDate = new Date(s.createdAt || new Date());
      return sDate >= start && sDate <= end;
    });

    const totalAmount = customerShipments.reduce((sum, s) => sum + (Number(s.totalBiaya) || 1500000), 0);
    const resis = customerShipments.map(s => s.id).join(', ');
    
    setNewInvoice(prev => ({
      ...prev,
      amount: totalAmount,
      resi: resis.length > 50 ? `${customerShipments.length} Resi/STT` : resis
    }));
  }, [newInvoice.customer, newInvoice.startDate, newInvoice.endDate, shipments]);

  // Initialize invoices from shipments
  useEffect(() => {
    if (shipments && shipments.length > 0) {
      const mappedInvoices = shipments.map((s, index) => {
        // Create mock dates based on index
        const date = new Date();
        date.setDate(date.getDate() - index);
        const due = new Date(date);
        due.setDate(due.getDate() + 30);
        
        return {
          id: `INV-${s.id}`,
          resi: s.id,
          customer: s.customer || 'Unknown',
          date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          due: due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          amount: s.totalBiaya || 0,
          // Randomly set initial status based on shipment status or just Unpaid
          status: s.status === 'Completed' ? 'Paid' : 'Unpaid',
          origin: s.origin,
          destination: s.destination
        };
      });
      setInvoices(mappedInvoices);
    }
  }, [shipments]);

  const toggleStatus = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: inv.status === 'Paid' ? 'Unpaid' : 'Paid' } : inv));
    setCustomInvoices(customInvoices.map(inv => inv.id === id ? { ...inv, status: inv.status === 'Paid' ? 'Unpaid' : 'Paid' } : inv));
  };

  const statusStyle = (status) => {
    if (status === 'Paid') return { bg: '#dcfce7', text: '#166534' };
    if (status === 'Unpaid') return { bg: '#fef9c3', text: '#854d0e' };
    return { bg: '#fee2e2', text: '#991b1b' };
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Faktur / Invoice</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Kelola penagihan pelanggan berdasarkan transaksi</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
            Ekspor
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Buat Invoice Baru
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--outline-variant)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>No. Invoice</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Pelanggan</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Tanggal Terbit</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Jatuh Tempo</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Jumlah Tagihan</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Status</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--on-surface-variant)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayInvoices.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--outline)' }}>Belum ada faktur yang diterbitkan.</td></tr>
              ) : displayInvoices.map((inv, index) => {
                const style = statusStyle(inv.status);
                return (
                  <tr key={inv.id} style={{ borderBottom: index < displayInvoices.length - 1 ? '1px solid var(--outline-variant)' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setSelectedInvoice(inv)}>
                      {inv.id}
                    </td>
                    <td style={{ padding: '16px 24px', color: 'var(--on-surface)', fontWeight: 500 }}>{inv.customer}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>{inv.date}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--on-surface-variant)', fontSize: '14px' }}>{inv.due}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', color: '#0f172a', fontWeight: 700 }}>
                      Rp {inv.amount.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <button 
                        onClick={() => toggleStatus(inv.id)}
                        style={{
                          padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
                          background: style.bg, color: style.text, transition: 'all 0.2s'
                        }}
                      >
                        {inv.status}
                      </button>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button className="icon-btn" onClick={() => setSelectedInvoice(inv)} style={{ color: 'var(--primary)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>
                        </button>
                        <button className="icon-btn" onClick={() => window.print()} style={{ color: 'var(--on-surface-variant)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)} style={{ padding: '40px' }}>
          <div id="print-area" className="modal print-area" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', width: '100%', padding: '0', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '40px 40px 20px 40px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#253b80', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {settings?.appLogo ? <img src={settings.appLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/> : <span className="material-symbols-outlined" style={{ color: 'white', fontSize: 32 }}>inventory_2</span>}
                </div>
                <div>
                  <h1 style={{ margin: 0, color: '#253b80', fontSize: '24px', fontWeight: 800 }}>{settings?.companyName?.toUpperCase() || 'REGULER LOGISTIK'}</h1>
                  <p style={{ margin: '4px 0 12px 0', color: '#475569', fontWeight: 600, fontSize: '13px' }}>Solusi Pengiriman Terpercaya</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#475569', fontSize: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span> {settings?.companyAddress || 'Jl. Sudirman No. 123, Jakarta 12190, Indonesia'}</div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>call</span> {settings?.companyPhone || '021-12345678'}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', position: 'relative' }}>
                {/* Slanted banner */}
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', background: '#253b80', padding: '16px 60px 16px 80px', clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
                  <h1 style={{ margin: 0, color: 'white', fontSize: '24px', letterSpacing: '0.1em' }}>INVOICE</h1>
                </div>
                
                <div style={{ marginTop: '60px' }}>
                  <table style={{ fontSize: '12px', color: '#475569', textAlign: 'left', marginLeft: 'auto' }}>
                    <tbody>
                      <tr><td style={{ padding: '4px 16px 4px 0' }}>Invoice No.</td><td>: <b>{selectedInvoice.id}</b></td></tr>
                      <tr><td style={{ padding: '4px 16px 4px 0' }}>Invoice Date</td><td>: <b>{selectedInvoice.date}</b></td></tr>
                      <tr><td style={{ padding: '4px 16px 4px 0' }}>Due Date</td><td>: <b>{selectedInvoice.due}</b></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Client & Summary Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0 40px', marginBottom: '20px' }}>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#253b80', color: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}>BILL TO</div>
                <div style={{ padding: '16px', fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{selectedInvoice.customer}</p>
                  <p style={{ margin: '0' }}>Tujuan: {selectedInvoice.destination}</p>
                  <p style={{ margin: '8px 0 0 0' }}>NPWP: -</p>
                </div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#253b80', color: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}>INVOICE SUMMARY</div>
                <div style={{ padding: '16px', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', height: 'calc(100% - 34px)' }}>
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr><td style={{ width: '120px' }}>Total Pengiriman</td><td>: <b>1 Resi / STT</b></td></tr>
                      <tr><td style={{ paddingTop: '8px' }}>Tipe Pembayaran</td><td style={{ paddingTop: '8px' }}>: <b>Termin (Bulanan)</b></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div style={{ padding: '0 40px', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                <thead>
                  <tr style={{ background: '#253b80', color: 'white' }}>
                    <th style={{ padding: '12px', fontSize: '12px', borderRight: '1px solid white' }}>NO.</th>
                    <th style={{ padding: '12px', fontSize: '12px', borderRight: '1px solid white' }}>TANGGAL<br/>KIRIM</th>
                    <th style={{ padding: '12px', fontSize: '12px', borderRight: '1px solid white' }}>NO RESI / STT</th>
                    <th style={{ padding: '12px', fontSize: '12px', borderRight: '1px solid white', textAlign: 'left' }}>TUJUAN & BARANG</th>
                    <th style={{ padding: '12px', fontSize: '12px', borderRight: '1px solid white' }}>BERAT</th>
                    <th style={{ padding: '12px', fontSize: '12px' }}>HARGA (RP)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>1</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>{selectedInvoice.date}</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>{selectedInvoice.resi}</td>
                    <td style={{ padding: '12px', fontSize: '13px', borderRight: '1px solid #cbd5e1' }}>Pengiriman Reguler</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>-</td>
                    <td style={{ padding: '12px', fontSize: '13px', textAlign: 'right' }}>Rp {selectedInvoice.amount.toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0 40px 40px 40px' }}>
              
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#253b80', color: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}>TERBILANG</div>
                  <div style={{ padding: '16px', fontSize: '13px', fontStyle: 'italic', fontWeight: 600, color: '#0f172a' }}>
                    Sesuai Tagihan
                  </div>
                </div>
                
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#253b80', color: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}>PEMBAYARAN</div>
                  <div style={{ padding: '16px', fontSize: '13px', color: '#475569' }}>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr><td style={{ width: '100px', paddingBottom: '8px' }}>Bank</td><td style={{ paddingBottom: '8px' }}>: <b>{settings?.bankName || '-'}</b></td></tr>
                        <tr><td style={{ paddingBottom: '8px' }}>No. Rekening</td><td style={{ paddingBottom: '8px' }}>: <b>{settings?.bankAccount || '-'}</b></td></tr>
                        <tr><td>Atas Nama</td><td>: <b>{settings?.bankAccountName || '-'}</b></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', fontSize: '14px', fontWeight: 700, color: '#475569' }}>
                    <span>SUBTOTAL</span>
                    <span>Rp {selectedInvoice.amount.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ background: '#253b80', color: 'white', display: 'flex', justifyContent: 'space-between', padding: '16px', fontSize: '18px', fontWeight: 800 }}>
                    <span>TOTAL INVOICE</span>
                    <span>Rp {selectedInvoice.amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: '#253b80', color: 'white', padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}>CATATAN</div>
                  <div style={{ padding: '16px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                    1. Pembayaran harap dilakukan sebelum tanggal jatuh tempo.<br/>
                    2. Harap mencantumkan nomor invoice pada bukti transfer.
                  </div>
                </div>
              </div>

            </div>

            {/* Print Controls (Hidden on Print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px 40px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <button className="btn btn-outline" onClick={() => setSelectedInvoice(null)}>Tutup</button>
              <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span> Cetak Invoice
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Manual Invoice Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="font-headline-md">Buat Invoice Tagihan (Bulanan)</h3>
              <button className="icon-btn" onClick={() => setShowCreateModal(false)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const date = new Date();
              const due = new Date(newInvoice.due || date);
              
              const inv = {
                id: `INV-M-${Math.floor(Math.random() * 10000)}`,
                resi: newInvoice.resi || '-',
                customer: newInvoice.customer,
                date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                due: due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                amount: Number(newInvoice.amount),
                status: 'Unpaid',
                origin: 'Berbagai Asal',
                destination: 'Berbagai Tujuan'
              };
              setCustomInvoices([inv, ...customInvoices]);
              setShowCreateModal(false);
              setNewInvoice({ customer: '', amount: 0, due: '', resi: '', startDate: '', endDate: '' });
            }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Pilih Pelanggan (Dari Riwayat Delivered)</label>
                  <select className="form-control" required value={newInvoice.customer} onChange={e => setNewInvoice({...newInvoice, customer: e.target.value})}>
                    <option value="">-- Pilih Pelanggan --</option>
                    {uniqueCustomers.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: '12px', color: 'var(--primary)', margin: '4px 0 0 0', fontWeight: 500 }}>
                    *Memilih pelanggan otomatis mengakumulasi tagihan paket "Delivered".
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah Tagihan (Rp)</label>
                  <input type="text" className="form-control" required value={newInvoice.amount > 0 ? `Rp ${newInvoice.amount.toLocaleString('id-ID')}` : 'Rp 0'} readOnly style={{ background: 'var(--surface-container-high)', fontWeight: '600', color: newInvoice.amount > 0 ? 'var(--primary)' : 'var(--on-surface-variant)' }} />
                  <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>*Otomatis terisi berdasarkan akumulasi resi Delivered bulan ini.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Periode Awal</label>
                    <input type="date" className="form-control" required value={newInvoice.startDate} onChange={e => setNewInvoice({...newInvoice, startDate: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Periode Akhir</label>
                    <input type="date" className="form-control" required value={newInvoice.endDate} onChange={e => setNewInvoice({...newInvoice, endDate: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Jatuh Tempo</label>
                  <input type="date" className="form-control" required value={newInvoice.due} onChange={e => setNewInvoice({...newInvoice, due: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Terbitkan Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
