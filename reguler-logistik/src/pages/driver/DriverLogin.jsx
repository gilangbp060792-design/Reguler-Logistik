import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const DriverLogin = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { drivers } = useContext(AppContext);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    const idOrEmail = e.target['driver-id'].value;
    const password = e.target['password'].value;

    const driver = drivers.find(d => 
      (d.id === idOrEmail || d.email === idOrEmail) && d.password === password
    );

    if (driver) {
      setLoading(true);
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate('/driver/home');
        }, 1500);
      }, 1000);
    } else {
      setError('ID / Email atau Password salah.');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between px-gutter py-12 relative overflow-hidden bg-background text-on-surface">
      {/* Atmospheric Background Element */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"></div>

      {/* Branding Section */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-on-primary !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Reguler Logistik</h1>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-1">Driver Portal</p>
        </div>
      </div>

      {/* Form Section */}
      <section className="w-full max-w-sm z-10 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm">
        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Driver ID Field */}
          <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="driver-id">
              ID DRIVER ATAU EMAIL
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">person</span>
              <input 
                className="w-full h-touch-target-min pl-10 pr-4 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline" 
                id="driver-id" 
                name="driver-id" 
                placeholder="e.g. DRV-99281" 
                required 
                type="text" 
                onFocus={(e) => e.target.parentElement.querySelector('span').style.color = '#003d9b'}
                onBlur={(e) => e.target.parentElement.querySelector('span').style.color = '#737685'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">
              PIN / KATA SANDI
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
              <input 
                className="w-full h-touch-target-min pl-10 pr-12 bg-surface border border-outline-variant rounded-lg font-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type={showPassword ? 'text' : 'password'}
                onFocus={(e) => e.target.parentElement.querySelector('span:first-child').style.color = '#003d9b'}
                onBlur={(e) => e.target.parentElement.querySelector('span:first-child').style.color = '#737685'}
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button className="w-full h-touch-target-min bg-primary text-on-primary font-headline-md text-headline-md rounded-lg shadow-sm hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
            Masuk
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>

          {/* Forgot Password */}
          <div className="text-center pt-2">
            <a className="font-label-md text-label-md text-primary hover:underline underline-offset-4 decoration-2" href="#">
              Lupa Kata Sandi?
            </a>
          </div>
        </form>
      </section>

      {/* Footer Info */}
      <footer className="w-full max-w-sm z-10 flex flex-col items-center space-y-4">
        {/* Support Contact */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant !text-lg">support_agent</span>
          <span className="font-label-md text-label-md text-on-surface-variant">Bantuan Armada: 1-800-LOG-REG</span>
        </div>
        {/* Version Info */}
        <div className="text-center">
          <p className="font-mono-data text-mono-data text-outline">v2.4.12-PROD</p>
          <p className="font-label-md text-label-md text-outline mt-1 px-8">Reguler Logistik System © 2024</p>
        </div>
      </footer>

      {/* Loading & Success Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-on-background/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col items-center space-y-4 shadow-xl border border-outline-variant animate-in fade-in zoom-in duration-300">
            {!success ? (
              <>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-headline-md text-headline-md text-primary">Mencocokkan data...</p>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-secondary !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-headline-md text-headline-md text-on-surface">Selamat datang, Pengemudi</p>
                <p className="font-body-md text-on-surface-variant">Menyinkronkan data manifes...</p>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default DriverLogin;
