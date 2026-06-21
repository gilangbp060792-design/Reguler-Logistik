import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Fleet = () => {
  const { fleet, addVehicle, updateVehicle, deleteVehicle, drivers } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialForm = { plate: '', type: 'Truck', brand: '', capacity: '', year: new Date().getFullYear(), status: 'Active', driverId: '', gpsUrl: '' };
  const [form, setForm] = useState(initialForm);

  const openNew = () => { setEditing(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (v) => { setEditing(v); setForm({ plate: v.plate, type: v.type, brand: v.brand, capacity: v.capacity, year: v.year, status: v.status, driverId: v.driverId || '', gpsUrl: v.gpsUrl || '' }); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, year: Number(form.year), driverId: form.driverId || null };
    if (editing) { updateVehicle(editing.id, data); } else { addVehicle(data); }
    close();
  };

  const handleDelete = (id) => { if (window.confirm('Hapus kendaraan ini?')) deleteVehicle(id); };

  const statusBadge = (s) => s === 'Active' ? 'badge-active' : s === 'Maintenance' ? 'badge-maintenance' : 'badge-inactive';
  const statusLabel = (s) => s === 'Active' ? 'Aktif' : s === 'Maintenance' ? 'Perawatan' : 'Nonaktif';
  const typeLabel = (t) => t === 'Truck' ? 'Truk' : t === 'Van' ? 'Van' : 'Motor';
  const typeIcon = (t) => t === 'Truck' ? 'local_shipping' : t === 'Van' ? 'airport_shuttle' : 'two_wheeler';

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Manajemen Armada</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Kelola armada kendaraan Anda</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          Tambah Kendaraan
        </button>
      </div>

      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined">directions_car</span></div>
          <p className="stat-label">Total Kendaraan</p>
          <h2 className="stat-value">{fleet.length}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: '#16a34a' }}>check_circle</span></div>
          <p className="stat-label">Aktif</p>
          <h2 className="stat-value" style={{ color: '#16a34a' }}>{fleet.filter(v => v.status === 'Active').length}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: 'var(--secondary)' }}>build</span></div>
          <p className="stat-label">Perawatan</p>
          <h2 className="stat-value" style={{ color: 'var(--secondary)' }}>{fleet.filter(v => v.status === 'Maintenance').length}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipe</th><th>Merek / Model</th><th>Plat Nomor</th><th>Kapasitas</th><th>Tahun</th><th>Status</th><th>Pengemudi</th><th style={{ textAlign: 'center' }}>Pelacakan GPS</th><th style={{ textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map(v => {
                const driver = v.driverId ? drivers.find(d => d.id === v.driverId) : null;
                return (
                  <tr key={v.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)' }}>{typeIcon(v.type)}</span>{typeLabel(v.type)}</div></td>
                    <td>{v.brand}</td>
                    <td className="font-mono">{v.plate}</td>
                    <td>{v.capacity}</td>
                    <td>{v.year}</td>
                    <td><span className={`badge ${statusBadge(v.status)}`}>{statusLabel(v.status)}</span></td>
                    <td>{driver ? driver.name : <span style={{ color: 'var(--outline)' }}>Belum Ditugaskan</span>}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', borderRadius: '50px' }} onClick={() => v.gpsUrl ? window.open(v.gpsUrl, '_blank') : alert(`Link GPS pihak ke-3 belum ditambahkan untuk kendaraan ${v.plate}`)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#16a34a' }}>my_location</span> Lacak
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEdit(v)}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span></button>
                        <button className="icon-btn" style={{ width: 32, height: 32, color: 'var(--error)' }} onClick={() => handleDelete(v.id)}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-headline-md">{editing ? `Edit ${editing.plate}` : 'Tambah Kendaraan'}</h3>
              <button className="icon-btn" onClick={close}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Tipe Kendaraan</label><select className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="Truck">Truk</option><option value="Van">Van</option><option value="Motorcycle">Motor</option></select></div>
                  <div className="form-group"><label className="form-label">Plat Nomor</label><input className="form-control" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} required placeholder="B 1234 ABC" /></div>
                </div>
                <div className="form-group"><label className="form-label">Merek / Model</label><input className="form-control" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required placeholder="Mitsubishi Colt Diesel" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Kapasitas</label><input className="form-control" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required placeholder="5 Ton" /></div>
                  <div className="form-group"><label className="form-label">Tahun</label><input type="number" className="form-control" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Link GPS Pihak Ke-3 (Opsional)</label><input type="url" className="form-control" value={form.gpsUrl} onChange={(e) => setForm({ ...form, gpsUrl: e.target.value })} placeholder="Contoh: https://maps.google.com/..." /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Status</label><select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="Active">Aktif</option><option value="Maintenance">Perawatan</option><option value="Inactive">Nonaktif</option></select></div>
                  <div className="form-group"><label className="form-label">Pengemudi</label><select className="form-control" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}><option value="">-- Belum Ditugaskan --</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={close}>Batal</button>
                <button type="submit" className="btn btn-primary"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>{editing ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fleet;
