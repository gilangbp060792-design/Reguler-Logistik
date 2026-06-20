import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { settings, updateSettings, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, appLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setForm({ ...form, appLogo: null });
  };

  const handleSave = (e) => { e.preventDefault(); updateSettings(form); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const handleLogout = () => { logout(); navigate('/login'); };
  const handleResetData = () => {
    if (window.confirm('Ini akan menghapus SEMUA data aplikasi dan mengembalikan ke pengaturan awal. Lanjutkan?')) {
      localStorage.removeItem('rl_shipments'); localStorage.removeItem('rl_fleet'); localStorage.removeItem('rl_drivers');
      localStorage.removeItem('rl_activities'); localStorage.removeItem('rl_settings'); localStorage.removeItem('rl_auth');
      window.location.reload();
    }
  };

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Pengaturan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Kelola preferensi aplikasi Anda</p>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} className="animate-slide-up">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
          Pengaturan berhasil disimpan!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <section className="card">
          <h3 className="font-headline-md" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined">business</span>
            Profil Perusahaan
          </h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Logo Aplikasi</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '12px', border: '1px dashed var(--outline)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  background: 'var(--surface-container-lowest)'
                }}>
                  {form.appLogo ? (
                    <img src={form.appLogo} alt="App Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--outline)' }}>image</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input type="file" id="logoUpload" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                  <label htmlFor="logoUpload" className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-flex', padding: '6px 12px', fontSize: '13px', margin: 0, alignItems: 'center', gap: '4px', background: 'white' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span> Unggah Logo
                  </label>
                  {form.appLogo && (
                    <button type="button" onClick={handleRemoveLogo} style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '13px', cursor: 'pointer', textAlign: 'left', fontWeight: 500 }}>
                      Hapus Logo
                    </button>
                  )}
                  <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Disarankan: PNG/JPG (Maks 1MB)</span>
                </div>
              </div>
            </div>
            
            <div className="form-group"><label className="form-label">Nama Perusahaan</label><input className="form-control" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Alamat Perusahaan</label><textarea className="form-control" rows="3" value={form.companyAddress} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} style={{ resize: 'vertical' }}></textarea></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group"><label className="form-label">Zona Waktu</label><select className="form-control" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}><option value="Asia/Jakarta">Asia/Jakarta (WIB)</option><option value="Asia/Makassar">Asia/Makassar (WITA)</option><option value="Asia/Jayapura">Asia/Jayapura (WIT)</option></select></div>
              <div className="form-group"><label className="form-label">Bahasa</label><select className="form-control" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}><option value="id">Bahasa Indonesia</option><option value="en">English</option></select></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Simpan Perubahan</button>
          </form>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="card">
            <h3 className="font-headline-md" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined">notifications</span>
              Preferensi Notifikasi
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div><p className="font-body-md" style={{ fontWeight: 500 }}>Notifikasi Email</p><p className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>Terima pembaruan via email</p></div>
                <input type="checkbox" checked={form.emailNotif} onChange={(e) => { setForm({ ...form, emailNotif: e.target.checked }); updateSettings({ emailNotif: e.target.checked }); }} style={{ width: 20, height: 20, accentColor: 'var(--primary)' }} />
              </label>
              <div style={{ borderTop: '1px solid var(--outline-variant)' }}></div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div><p className="font-body-md" style={{ fontWeight: 500 }}>Notifikasi Push</p><p className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>Notifikasi push browser</p></div>
                <input type="checkbox" checked={form.pushNotif} onChange={(e) => { setForm({ ...form, pushNotif: e.target.checked }); updateSettings({ pushNotif: e.target.checked }); }} style={{ width: 20, height: 20, accentColor: 'var(--primary)' }} />
              </label>
              <div style={{ borderTop: '1px solid var(--outline-variant)' }}></div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div><p className="font-body-md" style={{ fontWeight: 500 }}>Notifikasi SMS</p><p className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>Terima peringatan via SMS</p></div>
                <input type="checkbox" checked={form.smsNotif} onChange={(e) => { setForm({ ...form, smsNotif: e.target.checked }); updateSettings({ smsNotif: e.target.checked }); }} style={{ width: 20, height: 20, accentColor: 'var(--primary)' }} />
              </label>
            </div>
          </section>

          <section className="card" style={{ borderColor: 'var(--error-container)' }}>
            <h3 className="font-headline-md" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)' }}>
              <span className="material-symbols-outlined">warning</span>
              Zona Berbahaya
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p className="font-body-md" style={{ fontWeight: 500 }}>Reset Semua Data</p><p className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>Hapus semua data dan kembalikan ke pengaturan awal</p></div>
                <button className="btn btn-danger" onClick={handleResetData} style={{ padding: '8px 16px' }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>restart_alt</span>Reset</button>
              </div>
              <div style={{ borderTop: '1px solid var(--outline-variant)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p className="font-body-md" style={{ fontWeight: 500 }}>Keluar</p><p className="font-label-md" style={{ color: 'var(--on-surface-variant)' }}>Keluar dari akun Anda</p></div>
                <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '8px 16px' }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>Keluar</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
