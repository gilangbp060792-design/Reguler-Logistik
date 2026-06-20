import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import html2pdf from 'html2pdf.js';
import { AppContext } from '../context/AppContext';

const Shipments = ({ showNewModal, onCloseNewModal }) => {
  const { shipments, addShipment, updateShipment, deleteShipment, getDriverById, drivers, settings } = useContext(AppContext);
  const [filter, setFilter] = useState('Semua');
  const [search, setSearch] = useState('');
  const [editingShipment, setEditingShipment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingResi, setViewingResi] = useState(null);

  const initialForm = { origin: '', destination: '', driverId: '', priority: 'Standard', notes: '', eta: '', customer: '' };
  const [formData, setFormData] = useState(initialForm);

  const isModalOpen = showNewModal || showForm;

  const openNew = () => { setEditingShipment(null); setFormData(initialForm); setShowForm(true); };
  const openEdit = (shipment) => {
    setEditingShipment(shipment);
    setFormData({ origin: shipment.origin, destination: shipment.destination, driverId: shipment.driverId || '', priority: shipment.priority, notes: shipment.notes || '', eta: shipment.eta || '', customer: shipment.customer || '' });
    setShowForm(true);
  };

  const closeModal = () => { setShowForm(false); setEditingShipment(null); setFormData(initialForm); if (onCloseNewModal) onCloseNewModal(); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingShipment) { updateShipment(editingShipment.id, formData); } else { addShipment(formData); }
    closeModal();
  };

  const handleStatusChange = (id, newStatus) => { updateShipment(id, { status: newStatus }); };
  const handleDelete = (id) => { if (window.confirm(`Hapus pengiriman ${id}?`)) deleteShipment(id); };

  const handlePrintResi = (shipment) => {
    setViewingResi(shipment);
  };

  const handleDownloadResi = (id) => {
    const printArea = document.getElementById('resi-print-area');
    if (!printArea) return;
    const opt = {
      margin: 0,
      filename: `AWB_${id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(printArea).save();
  };

  const exportCSV = () => {
    const headers = ['No. Resi', 'Asal', 'Tujuan', 'Status', 'Pengemudi', 'Prioritas', 'Pelanggan', 'ETA', 'Dibuat'];
    const rows = filteredShipments.map(s => {
      const driver = s.driverId ? getDriverById(s.driverId) : null;
      return [s.id, s.origin, s.destination, statusLabel(s.status), driver?.name || 'Belum Ditugaskan', s.priority === 'Express' ? 'Ekspres' : 'Standar', s.customer, s.eta, s.createdAt];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pengiriman_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const statusLabel = (status) => {
    const map = { 'In-Transit': 'Dalam Perjalanan', 'Picked Up': 'Dijemput', 'Delivered': 'Terkirim', 'Delayed': 'Tertunda', 'Pending': 'Menunggu' };
    return map[status] || status;
  };

  const statusBadge = (status) => {
    const map = { 'In-Transit': 'badge-transit', 'Picked Up': 'badge-picked', 'Delivered': 'badge-delivered', 'Delayed': 'badge-delayed', 'Pending': 'badge-pending' };
    return map[status] || 'badge-pending';
  };

  const filterLabels = { 'Semua': 'All', 'Menunggu': 'Pending', 'Dijemput': 'Picked Up', 'Dalam Perjalanan': 'In-Transit', 'Terkirim': 'Delivered', 'Tertunda': 'Delayed' };
  const filters = ['Semua', 'Menunggu', 'Dijemput', 'Dalam Perjalanan', 'Terkirim', 'Tertunda'];
  const statusFlow = ['Pending', 'Picked Up', 'In-Transit', 'Delivered'];

  const filteredShipments = shipments.filter(s => {
    const matchFilter = filter === 'Semua' || s.status === (Object.entries({ 'Menunggu': 'Pending', 'Dijemput': 'Picked Up', 'Dalam Perjalanan': 'In-Transit', 'Terkirim': 'Delivered', 'Tertunda': 'Delayed' }).find(([k]) => k === filter)?.[1] || filter);
    const matchSearch = search === '' || s.id.toLowerCase().includes(search.toLowerCase()) || s.destination.toLowerCase().includes(search.toLowerCase()) || s.origin.toLowerCase().includes(search.toLowerCase()) || (s.customer || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Manajemen Pengiriman</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Lacak dan kelola semua pengiriman</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" onClick={exportCSV}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
            Ekspor CSV
          </button>
          <button className="btn btn-primary" onClick={openNew}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Pengiriman Baru
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {filters.map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)} style={{ padding: '6px 16px' }}>
            {s}
            {s !== 'Semua' && <span style={{ marginLeft: '4px', opacity: 0.7 }}>({shipments.filter(sh => sh.status === (filterLabels[s] || s)).length})</span>}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <input type="text" className="form-control" placeholder="Cari berdasarkan ID, rute, pelanggan..." style={{ width: '300px', padding: '8px 16px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Resi</th>
                <th>Pelanggan</th>
                <th>Rute</th>
                <th>Status</th>
                <th>Prioritas</th>
                <th>Pengemudi</th>
                <th>ETA</th>
                <th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: 'var(--on-surface-variant)' }}>Tidak ada pengiriman ditemukan.</td></tr>
              ) : (
                filteredShipments.map(s => {
                  const driver = s.driverId ? getDriverById(s.driverId) : null;
                  return (
                    <tr key={s.id}>
                      <td className="font-mono" style={{ color: 'var(--primary)', fontWeight: 600 }}>{s.id}</td>
                      <td className="font-body-md">{s.customer || '-'}</td>
                      <td className="font-body-md">{s.origin} → {s.destination}</td>
                      <td>
                        <select className="form-control" value={s.status} onChange={(e) => handleStatusChange(s.id, e.target.value)} style={{ padding: '4px 28px 4px 8px', fontSize: '11px', fontWeight: 700, border: 'none', width: 'auto', minWidth: '110px', background: 'transparent' }}>
                          {statusFlow.map(st => <option key={st} value={st}>{statusLabel(st)}</option>)}
                          <option value="Delayed">{statusLabel('Delayed')}</option>
                        </select>
                      </td>
                      <td><span className={`badge ${s.priority === 'Express' ? 'badge-delayed' : 'badge-pending'}`}>{s.priority === 'Express' ? 'Ekspres' : 'Standar'}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-container)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>person</span>
                          </div>
                          <span>{driver ? driver.name : 'Belum Ditugaskan'}</span>
                        </div>
                      </td>
                      <td className="font-body-md">{s.eta}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button className="icon-btn" style={{ width: 32, height: 32, color: '#3b82f6' }} onClick={() => handlePrintResi(s)} title="Lihat Resi (AWB)"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>receipt_long</span></button>
                          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEdit(s)} title="Edit"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span></button>
                          <button className="icon-btn" style={{ width: 32, height: 32, color: 'var(--error)' }} onClick={() => handleDelete(s.id)} title="Hapus"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-headline-md">{editingShipment ? `Edit ${editingShipment.id}` : 'Buat Pengiriman Baru'}</h3>
              <button className="icon-btn" onClick={closeModal}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nama Pelanggan</label>
                  <input className="form-control" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="PT Contoh Corp" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Asal</label><input className="form-control" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} placeholder="Jakarta, ID" required /></div>
                  <div className="form-group"><label className="form-label">Tujuan</label><input className="form-control" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder="Bandung, ID" required /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Pengemudi</label>
                    <select className="form-control" value={formData.driverId} onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}>
                      <option value="">-- Belum Ditugaskan --</option>
                      {drivers.filter(d => d.status === 'Online').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prioritas</label>
                    <select className="form-control" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                      <option value="Standard">Standar</option><option value="Express">Ekspres</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label className="form-label">ETA</label><input className="form-control" value={formData.eta} onChange={(e) => setFormData({ ...formData, eta: e.target.value })} placeholder="14:30" /></div>
                <div className="form-group"><label className="form-label">Catatan</label><textarea className="form-control" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Catatan tambahan..." rows="3" style={{ resize: 'vertical' }}></textarea></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-primary"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>{editingShipment ? 'Simpan' : 'Buat Pengiriman'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Resi Modal */}
      {viewingResi && createPortal(
        <div className="modal-overlay" onClick={() => setViewingResi(null)} style={{ display: 'block', overflowY: 'auto', padding: '40px 20px', alignItems: 'initial', justifyContent: 'initial' }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: '800px', maxWidth: '100%', maxHeight: 'none', margin: '0 auto', padding: '0', background: '#f8fafc', display: 'block', position: 'relative', borderRadius: '16px', overflow: 'visible' }}>
            <div className="modal-header" style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, borderRadius: '16px 16px 0 0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 className="font-headline-md" style={{ margin: 0 }}>Lihat Resi (AWB)</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={() => handleDownloadResi(viewingResi.id)} style={{ padding: '6px 12px', fontSize: '13px', margin: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Download PDF
                </button>
                <button className="icon-btn" onClick={() => setViewingResi(null)} style={{ margin: 0 }}><span className="material-symbols-outlined">close</span></button>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div id="resi-print-area" style={{ background: 'white', color: '#0f172a', padding: '40px', fontFamily: '"Inter", sans-serif', width: '100%', boxSizing: 'border-box', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                {/* Top Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em' }}>{settings?.companyName || 'Reguler Logistik'}</div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Logistics & Supply Chain Excellence</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking Number</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em', marginTop: '2px' }}>{viewingResi.id}</div>
                  </div>
                </div>

                {/* Barcode and Core Info */}
                <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>ORIGIN</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{viewingResi.origin.replace(', ID', '')}</div>
                    </div>
                    <div style={{ padding: '0 24px', color: '#cbd5e1' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_forward</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>DESTINATION</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{viewingResi.destination.replace(', ID', '')}</div>
                    </div>
                    <div style={{ background: '#1e3a8a', color: 'white', padding: '12px 24px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, opacity: 0.8, marginBottom: '2px' }}>SERVICE</div>
                      <div style={{ fontSize: '20px', fontWeight: 800 }}>{viewingResi.priority === 'Express' ? 'EXP' : 'REG'}</div>
                    </div>
                  </div>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                    <img src={`https://barcode.tec-it.com/barcode.ashx?data=${viewingResi.id}&code=Code128&dpi=96&dataseparator=`} alt="Barcode" style={{ height: '60px', objectFit: 'contain' }} />
                  </div>
                </div>

                {/* Sender & Recipient */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '24px', height: '24px', background: '#eff6ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
                      </div>
                      SENDER DETAILS
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{viewingResi.pengirim?.company || viewingResi.pengirim?.name || settings?.companyName || 'Reguler Logistik'}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{viewingResi.pengirim?.phone || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', marginTop: '4px' }}>
                      {viewingResi.pengirim?.alamat ? (
                        <>
                          {viewingResi.pengirim.alamat}<br/>
                          {viewingResi.pengirim.kecamatan} {viewingResi.pengirim.kota}<br/>
                          {viewingResi.pengirim.provinsi} {viewingResi.pengirim.kodePos}
                        </>
                      ) : viewingResi.origin}
                    </div>
                  </div>
                  <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '24px', height: '24px', background: '#ecfdf5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                      </div>
                      RECIPIENT DETAILS
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{viewingResi.penerima?.company || viewingResi.penerima?.name || viewingResi.customer}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{viewingResi.penerima?.phone || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', marginTop: '4px' }}>
                      {viewingResi.penerima?.alamat ? (
                        <>
                          {viewingResi.penerima.alamat}<br/>
                          {viewingResi.penerima.kecamatan} {viewingResi.penerima.kota}<br/>
                          {viewingResi.penerima.provinsi} {viewingResi.penerima.kodePos}
                        </>
                      ) : viewingResi.destination}
                    </div>
                  </div>
                </div>

                {/* T&C and Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '24px', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ width: '40%', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${viewingResi.id}`} alt="QR Code" style={{ width: '72px', height: '72px' }} />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>SCAN FOR E-RECEIPT</div>
                      <div style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.4' }}>
                        By signing, I agree to the terms and conditions.<br/>Official document generated by {settings?.companyName || 'Reguler Logistik'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '48px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ borderBottom: '1px solid #cbd5e1', width: '140px', marginBottom: '8px' }}></div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Courier Signature</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ borderBottom: '1px solid #cbd5e1', width: '140px', marginBottom: '8px' }}></div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Recipient Signature</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Shipments;
