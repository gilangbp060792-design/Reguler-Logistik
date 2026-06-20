import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import RegionPicker from '../components/RegionPicker';

const Customers = () => {
  const { customers, addCustomer } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', pic: '', phone: '', email: '', province: '', city: '', district: '', zip: '', npwp: '', term: 'Cash', limit: '', address: ''
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pic) return;
    
    addCustomer(formData);
    setFormData({ name: '', pic: '', phone: '', email: '', province: '', city: '', district: '', zip: '', npwp: '', term: 'Cash', limit: '', address: '' });
    toggleModal();
  };

  return (
    <div className="animate-slide-up" style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Master Customer</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Kelola data pelanggan dan klien bisnis</p>
        </div>
        <button 
          onClick={toggleModal}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'var(--primary)', color: 'white', 
            padding: '12px 24px', borderRadius: '8px', 
            fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
          }}
        >
          <span className="material-symbols-outlined">person_add</span>
          Tambah Customer
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container-high)', borderBottom: '1px solid var(--outline-variant)' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface)' }}>ID Customer</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface)' }}>Perusahaan / Toko</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface)' }}>PIC</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface)' }}>No HP</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface)' }}>Kota</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface)' }}>Termin</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust, idx) => (
              <tr key={cust.id} style={{ borderBottom: '1px solid var(--outline-variant)', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '16px', fontWeight: 500, color: 'var(--primary)' }}>{cust.id}</td>
                <td style={{ padding: '16px', fontWeight: 600 }}>{cust.name}</td>
                <td style={{ padding: '16px' }}>{cust.pic}</td>
                <td style={{ padding: '16px' }}>{cust.phone}</td>
                <td style={{ padding: '16px' }}>{cust.city}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600,
                    background: cust.term === 'Cash' ? '#dcfce7' : '#fef08a',
                    color: cust.term === 'Cash' ? '#166534' : '#854d0e'
                  }}>
                    {cust.term}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          {/* Modal Box */}
          <div className="animate-slide-up" style={{
            background: 'white', borderRadius: '16px', width: '100%', maxWidth: '700px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--outline-variant)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e1b4b' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>person_add</span>
                Tambah Customer Baru
              </h3>
              <button onClick={toggleModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form Content */}
            <form style={{ padding: '24px' }} onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Nama Perusahaan / Toko</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Nama PIC (In Charge)</label>
                  <input type="text" required value={formData.pic} onChange={(e) => setFormData({...formData, pic: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>No HP / WhatsApp</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', background: 'var(--surface-container-low)', padding: '16px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>Cari Kecamatan / Kelurahan (Auto Fill)</label>
                  <RegionPicker 
                    onSelect={(region) => {
                      setFormData({
                        ...formData,
                        province: region.provinsi,
                        city: region.kota,
                        district: region.kecamatan,
                        zip: region.kodePos
                      });
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Provinsi</label>
                  <input type="text" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Kota/Kabupaten</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Kecamatan</label>
                  <input type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Kode Pos</label>
                  <input type="text" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>NPWP</label>
                  <input type="text" value={formData.npwp} onChange={(e) => setFormData({...formData, npwp: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Termin Bayar</label>
                  <select value={formData.term} onChange={(e) => setFormData({...formData, term: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}>
                    <option>Cash</option>
                    <option>Net 14</option>
                    <option>Net 30</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Kredit Limit</label>
                  <input type="text" value={formData.limit} onChange={(e) => setFormData({...formData, limit: e.target.value})} placeholder="Rp 0" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Alamat Lengkap</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="4" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}></textarea>
              </div>

              {/* Footer / Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--outline-variant)', paddingTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={toggleModal}
                  style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Simpan Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
