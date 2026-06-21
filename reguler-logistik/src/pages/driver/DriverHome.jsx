import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const DriverHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const { shipments, drivers } = useContext(AppContext);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const driverId = localStorage.getItem('rl_driver_id');
    if (!driverId) {
      navigate('/driver');
      return;
    }
    const found = drivers.find(d => d.id === driverId);
    if (found) {
      setDriver(found);
    } else {
      navigate('/driver');
    }
  }, [drivers, navigate]);

  if (!driver) return null;

  const myShipments = shipments.filter(s => s.driverId === driver.id);
  const pendingShipments = myShipments.filter(s => s.status === 'In-Transit' || s.status === 'Picked Up' || s.status === 'Pending');
  const completedShipments = myShipments.filter(s => s.status === 'Delivered' || s.status === 'Delayed' || s.status === 'Onhold');
  
  const totalShipments = myShipments.length;
  const progress = totalShipments === 0 ? 0 : Math.round((completedShipments.length / totalShipments) * 100);

  const handleStartTask = (id) => {
    navigate('/driver/scanner', { state: { shipmentId: id } });
  };

  const handleLogout = () => {
    localStorage.removeItem('rl_driver_id');
    navigate('/driver');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-success-container text-success';
      case 'Delayed':
      case 'Onhold': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-primary';
    }
  };

  const translateStatus = (status) => {
    switch(status) {
      case 'Delivered': return 'Selesai';
      case 'Delayed': return 'Terlambat';
      case 'Onhold': return 'Tertunda';
      case 'In-Transit': return 'Di Jalan';
      case 'Picked Up': return 'Diambil';
      case 'Pending': return 'Menunggu';
      default: return status;
    }
  };

  return (
    <>
      {/* Top Header / Progress Container */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-header px-4 pt-6 pb-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Reguler Logistik</h1>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-primary p-2 bg-primary-container/10 rounded-full">notifications</span>
              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden bg-surface-container">
                <span className="material-symbols-outlined text-3xl mt-1 text-primary">person</span>
              </div>
            </div>
          </div>

          {/* Today's Progress Card */}
          <div className="bg-surface-container-high rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Progres Hari Ini</p>
                <p className="font-headline-md text-headline-md text-on-surface">{completedShipments.length} / {totalShipments} Pengiriman</p>
              </div>
              <p className="font-label-md text-label-md text-primary font-bold">{progress}%</p>
            </div>
            <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
              <div className="progress-gradient h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-[220px] pb-24 px-4 max-w-md mx-auto">
        {activeTab === 'home' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-md text-headline-md">Tugas Tersisa</h2>
              <button className="flex items-center gap-1 text-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Tampilan Peta
              </button>
            </div>
            
            {pendingShipments.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4 opacity-50">task</span>
                <p>Semua tugas pengiriman sudah selesai!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingShipments.map(s => (
                  <div key={s.id} className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm touch-ripple">
                    <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary-container">local_shipping</span>
                        <span className="font-mono-data text-mono-data text-on-surface-variant">{s.id}</span>
                      </div>
                      <span className={`px-2 py-1 rounded font-label-md text-label-md ${getStatusColor(s.status)}`}>
                        {translateStatus(s.status)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-headline-md text-headline-md mb-1 leading-tight">{s.destination}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6">{s.customer || 'Pelanggan'} • {s.eta ? `ETA: ${s.eta}` : ''}</p>
                      <button 
                        onClick={() => handleStartTask(s.id)}
                        className="w-full bg-primary py-4 rounded-lg flex items-center justify-center gap-2 text-on-primary font-headline-md text-headline-md active:bg-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        Mulai Tugas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'tasks' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline-md text-headline-md">Tugas Selesai</h2>
            </div>
            
            {completedShipments.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4 opacity-50">history</span>
                <p>Belum ada tugas yang diselesaikan.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedShipments.map(s => (
                  <div key={s.id} className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm opacity-80">
                    <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary-container">inventory_2</span>
                        <span className="font-mono-data text-mono-data text-on-surface-variant">{s.id}</span>
                      </div>
                      <span className={`px-2 py-1 rounded font-label-md text-label-md ${getStatusColor(s.status)}`}>
                        {translateStatus(s.status)}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-headline-md text-headline-md mb-1 leading-tight">{s.destination}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{s.customer}</p>
                      {s.holdReason && (
                         <p className="font-body-md text-body-md text-error mt-2 border-t pt-2 border-error-container">Kendala: {s.holdReason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'scanner' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-[80px] text-primary mb-6">qr_code_scanner</span>
            <h2 className="font-headline-lg text-headline-lg mb-2">Pindai Resi</h2>
            <p className="font-body-md text-on-surface-variant mb-8 px-4">Pindai barcode pada paket untuk memproses pengiriman secara instan tanpa memilih dari daftar.</p>
            <button 
              onClick={() => handleStartTask('')}
              className="bg-primary text-on-primary py-4 px-8 rounded-full font-headline-md flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">camera_alt</span>
              Buka Kamera Pemindai
            </button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex flex-col space-y-6">
            <div className="bg-white border border-outline-variant rounded-xl p-6 text-center shadow-sm">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-primary-fixed overflow-hidden bg-surface-container mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-primary">person</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg mb-1">{driver.name}</h2>
              <p className="font-body-md text-on-surface-variant">{driver.id}</p>
              <p className="font-body-md text-primary font-bold mt-2">{driver.phone || '0812-3456-7890'}</p>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-error-container text-on-error-container py-4 rounded-xl flex items-center justify-center gap-2 font-headline-md active:bg-error active:text-white transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              Keluar Akun
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-around items-center h-[72px] bg-surface border-t border-outline-variant shadow-sm px-4 pb-2 z-50">
        <button 
          onClick={() => setActiveTab('home')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center rounded-full px-4 py-1 transition-transform active:scale-90 duration-150 ${activeTab === 'home' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className="font-label-md text-label-md-mobile">Beranda</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors active:scale-90 ${activeTab === 'tasks' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'tasks' ? { fontVariationSettings: "'FILL' 1" } : {}}>assignment</span>
          <span className="font-label-md text-label-md-mobile">Tugas Saya</span>
        </button>

        <button 
          onClick={() => setActiveTab('scanner')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors active:scale-90 ${activeTab === 'scanner' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'scanner' ? { fontVariationSettings: "'FILL' 1" } : {}}>qr_code_scanner</span>
          <span className="font-label-md text-label-md-mobile">Pemindai</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors active:scale-90 ${activeTab === 'profile' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
          <span className="font-label-md text-label-md-mobile">Profil</span>
        </button>
      </nav>
    </>
  );
};

export default DriverHome;
