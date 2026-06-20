import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const Drivers = () => {
  const { drivers, addDriver, updateDriver, deleteDriver, fleet } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const initialForm = { name: '', email: '', password: '', phone: '', status: 'Online', rating: 4.5, vehicleId: '' };
  const [form, setForm] = useState(initialForm);

  const openNew = () => { setEditing(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, email: d.email || '', password: d.password || '', phone: d.phone, status: d.status, rating: d.rating, vehicleId: d.vehicleId || '' }); setShowModal(true); };
  const close = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, rating: Number(form.rating), vehicleId: form.vehicleId || null };
    if (editing) { updateDriver(editing.id, data); } else { addDriver(data); }
    close();
  };

  const handleDelete = (id) => { if (window.confirm('Hapus pengemudi ini?')) deleteDriver(id); };
  const toggleStatus = (driver) => { updateDriver(driver.id, { status: driver.status === 'Online' ? 'Offline' : 'Online' }); };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Manajemen Pengemudi</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Kelola pengemudi pengiriman Anda</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>
          Tambah Pengemudi
        </button>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined">groups</span></div>
          <p className="stat-label">Total Pengemudi</p>
          <h2 className="stat-value">{drivers.length}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: '#16a34a' }}>person</span></div>
          <p className="stat-label">Online</p>
          <h2 className="stat-value" style={{ color: '#16a34a' }}>{drivers.filter(d => d.status === 'Online').length}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: 'var(--error)' }}>person_off</span></div>
          <p className="stat-label">Offline</p>
          <h2 className="stat-value" style={{ color: 'var(--error)' }}>{drivers.filter(d => d.status === 'Offline').length}</h2>
        </div>
        <div className="card stat-card">
          <div className="stat-header"><span className="stat-icon material-symbols-outlined" style={{ color: 'var(--secondary)' }}>star</span></div>
          <p className="stat-label">Rating Rata-rata</p>
          <h2 className="stat-value" style={{ color: 'var(--secondary)' }}>{drivers.length > 0 ? (drivers.reduce((s, d) => s + d.rating, 0) / drivers.length).toFixed(1) : '-'}</h2>
        </div>
      </div>

      <div className="grid-3">
        {drivers.map(d => {
          const vehicle = d.vehicleId ? fleet.find(v => v.id === d.vehicleId) : null;
          return (
            <div key={d.id} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--outline-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--primary)' }}>person</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md" style={{ fontSize: '16px' }}>{d.name}</h4>
                    <p className="font-mono" style={{ color: 'var(--on-surface-variant)' }}>{d.id}</p>
                  </div>
                </div>
                <span className={`badge ${d.status === 'Online' ? 'badge-online' : 'badge-offline'}`}>{d.status}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--on-surface-variant)' }}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>phone</span>{d.phone}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--on-surface-variant)' }}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>star</span>{d.rating} / 5.0</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--on-surface-variant)' }}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_shipping</span>{d.totalDeliveries} pengiriman</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--on-surface-variant)' }}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>directions_car</span>{vehicle ? `${vehicle.brand} (${vehicle.plate})` : 'Belum ada kendaraan'}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--outline-variant)', paddingTop: '16px' }}>
                <button className={`btn ${d.status === 'Online' ? 'btn-outline' : 'btn-success'}`} style={{ flex: 1, padding: '8px' }} onClick={() => toggleStatus(d)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{d.status === 'Online' ? 'person_off' : 'person'}</span>
                  {d.status === 'Online' ? 'Set Offline' : 'Set Online'}
                </button>
                <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => openEdit(d)} title="Edit"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span></button>
                <button className="icon-btn" style={{ width: 36, height: 36, color: 'var(--error)' }} onClick={() => handleDelete(d.id)} title="Hapus"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span></button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-headline-md">{editing ? `Edit ${editing.name}` : 'Tambah Pengemudi Baru'}</h3>
              <button className="icon-btn" onClick={close}><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group"><label className="form-label">Nama Lengkap</label><input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="John Doe" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Email Login</label><input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="driver@reguler.com" /></div>
                  <div className="form-group"><label className="form-label">Password Login</label><input type="text" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Minimal 6 karakter" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Nomor Telepon</label><input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+62 812-3456-7890" /></div>
                  <div className="form-group"><label className="form-label">Rating</label><input type="number" step="0.1" min="0" max="5" className="form-control" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group"><label className="form-label">Status</label><select className="form-control" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Online</option><option>Offline</option></select></div>
                  <div className="form-group"><label className="form-label">Kendaraan</label><select className="form-control" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}><option value="">-- Tidak ada --</option>{fleet.filter(v => v.status === 'Active').map(v => <option key={v.id} value={v.id}>{v.brand} ({v.plate})</option>)}</select></div>
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

export default Drivers;
