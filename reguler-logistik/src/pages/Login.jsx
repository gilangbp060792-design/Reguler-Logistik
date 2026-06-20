import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 600);
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
              <h2>Manajemen Logistik Global yang Aman.</h2>
              <p className="subtitle">
                Akses dasbor Anda untuk mengelola pengiriman, melacak performa armada, dan mengoptimalkan rantai pasok secara real-time.
              </p>
            </div>
          </div>
          <div className="trust-bar">
            <div style={{ display: 'flex', gap: '-12px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--primary)', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>person</span>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--primary)', background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-12px', overflow: 'hidden' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>person</span>
              </div>
            </div>
            <p className="font-label-md">Dipercaya oleh 5.000+ profesional logistik di seluruh dunia.</p>
          </div>
        </section>

        {/* Right: Login Form */}
        <section className="login-form-section">
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div className="header">
              <h3>Selamat Datang Kembali</h3>
              <p>Silakan masukkan kredensial Anda untuk mengakses konsol admin.</p>
            </div>

            {error && (
              <div className="error-msg animate-slide-up">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="email">Email Korporat</label>
                <div className="form-control-icon">
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="nama@regulerlogistik.com"
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
                  Ingat perangkat ini selama 30 hari
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
                <button type="submit" className="authorize-btn" disabled={loading}>
                  <span>{loading ? 'MENGOTORISASI...' : 'MASUK'}</span>
                  {!loading && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>}
                </button>

                <button type="button" className="sso-btn">
                  <img alt="Google" width="20" height="20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYSWWt8hZ8R4jzATK4wsN7MXZZsoVYI8xHfGjONQY5fkA_JMUUF0tQ3bW52mwl4cGk8cBLfyLahjxgcq_2s-8El-nUiBMVdrBAU54lMyFrxPHzY7n-NduyGac1EODkuvLaLnZHQYOJfVTl7JfXfkt7malczqa2viRvBqhdn0SaixCrIDArzYPxcXCcHWN_n_LNhYjjkDA17oZfAfH3F3CAqy_dpYe2gPXZ3ooA_G1mAeeJpBwZF5AUk7rk64jdWi89Jy_SA89B10A" />
                  <span>Masuk dengan SSO</span>
                </button>
              </div>
            </form>

            <div className="login-footer">
              <p>Baru di Reguler Logistik? <a href="#">Hubungi Administrator Sistem</a></p>
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
          © 2024 Reguler Logistik. Sesi terenkripsi ujung-ke-ujung. ID Sistem: RL-AUTH-9921
        </p>
      </footer>
    </div>
  );
};

export default Login;
