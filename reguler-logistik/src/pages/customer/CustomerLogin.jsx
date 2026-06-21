import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('light');
    return () => {
      document.documentElement.classList.remove('light');
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/customer/dashboard');
    }, 1500);
  };

  return (
    <div className="login-container">
      <main className="login-card animate-fade-in">
        {/* Left: Branding */}
        <section className="login-branding">
          <div className="bg-overlay"></div>
          <div className="content">
            <div className="logo-row">
              <div className="logo-icon">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <h1>Reguler Logistik</h1>
            </div>
            <div style={{ maxWidth: '380px' }}>
              <h2>Portal Pelanggan Terintegrasi.</h2>
              <p className="subtitle">
                Akses portal Anda untuk mengelola pengiriman baru, melacak status pesanan secara real-time, dan mengatur profil perusahaan Anda.
              </p>
            </div>
          </div>
          <div className="trust-bar">
            <div style={{ display: 'flex', gap: '-12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--primary)', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>business</span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--primary)', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-12px', overflow: 'hidden' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>handshake</span>
              </div>
            </div>
            <p className="font-label-md">Dipercaya oleh ribuan mitra bisnis logistik B2B.</p>
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="login-form-section">
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div className="header">
              <h3>Selamat Datang di Portal</h3>
              <p>Silakan masukkan kredensial Anda untuk mengakses akun pelanggan.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="email">Email / Customer ID</label>
                <div className="form-control-icon">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    id="email"
                    type="text"
                    className="form-control"
                    placeholder="nama@perusahaan.com / CUST-XXXX"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Kata Sandi</label>
                  <a href="#" className="font-label-md" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Lupa Kata Sandi?</a>
                </div>
                <div className="form-control-icon">
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingRight: '48px' }}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)',
                      left: 'auto'
                    }}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>
                  Ingat perangkat ini
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
                <button type="submit" className="authorize-btn" disabled={loading}>
                  <span>{loading ? 'MEMUAT DASHBOARD...' : 'LOGIN TO PORTAL'}</span>
                  {!loading && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>}
                </button>
              </div>
            </form>

            <div className="login-footer">
              <p>Belum memiliki akun? <a href="#">Hubungi Admin Kami</a></p>
            </div>

            <div className="security-icons">
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>verified_user</span>
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>shield</span>
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>encrypted</span>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ position: 'fixed', bottom: '24px', width: '100%', textAlign: 'center', padding: '0 16px' }}>
        <p className="font-label-md" style={{ color: 'var(--on-surface-variant)', opacity: 0.6 }}>
          © 2024 Reguler Logistik Customer Portal. Semua koneksi terenkripsi (SSL 256-bit).
        </p>
      </footer>
    </div>
  );
};

export default CustomerLogin;
