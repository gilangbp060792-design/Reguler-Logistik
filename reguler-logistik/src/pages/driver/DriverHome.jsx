import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const handleStartTask = (id) => {
    // Navigate to scanner/POD page
    navigate('/driver/scanner');
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
              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  alt="A professional close-up portrait of a delivery logistics driver wearing a clean navy blue uniform and a company cap." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN-7OAkHSCXYP0M7QKfvYFvrNOnaThHrq266C7bNOXtxOec8CqKWa3kUYtpzb7zpWgJ-xdO5n1FtnNYnLYXJrYvw4vcK_EFXlUBQmjXaFjQWQWqKcZ1-izotzQmM2zSQcci_YtQv3_V9-CRN5dDWR63YqTeDsEH_xAARTzqnG4v9dW_wY0m4d7MDfyFqXcTI6QU5CS2X2ZtFsuPtFIYcQwx8D5f_uutKHhbjyg_1b0C0I95jXcEjC0ydeGYM1PctYMZG2ptjNlwdg" 
                />
              </div>
            </div>
          </div>

          {/* Today's Progress Card */}
          <div className="bg-surface-container-high rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Progres Hari Ini</p>
                <p className="font-headline-md text-headline-md text-on-surface">5 / 12 Pengiriman</p>
              </div>
              <p className="font-label-md text-label-md text-primary font-bold">42%</p>
            </div>
            <div className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden">
              <div className="progress-gradient h-full w-[42%] rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-[220px] pb-24 px-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-headline-md">Tugas Tersisa</h2>
          <button className="flex items-center gap-1 text-primary font-label-md text-label-md">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Tampilan Peta
          </button>
        </div>

        {/* Shipment List */}
        <div className="space-y-4">
          {/* Shipment Card 1 */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm touch-ripple">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">local_shipping</span>
                <span className="font-mono-data text-mono-data text-on-surface-variant">RL-2940-5821</span>
              </div>
              <span className="bg-surface-container px-2 py-1 rounded font-label-md text-label-md text-primary">Tertunda</span>
            </div>
            <div className="p-4">
              <h3 className="font-headline-md text-headline-md mb-1 leading-tight">721 Business Park Dr, Suite 400</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Central District • berjarak 2.4 km</p>
              <button 
                onClick={() => handleStartTask('RL-2940-5821')}
                className="w-full bg-primary py-4 rounded-lg flex items-center justify-center gap-2 text-on-primary font-headline-md text-headline-md active:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Mulai Tugas
              </button>
            </div>
          </div>

          {/* Shipment Card 2 */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm touch-ripple">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">local_shipping</span>
                <span className="font-mono-data text-mono-data text-on-surface-variant">RL-2940-5899</span>
              </div>
              <span className="bg-surface-container px-2 py-1 rounded font-label-md text-label-md text-primary">Tertunda</span>
            </div>
            <div className="p-4">
              <h3 className="font-headline-md text-headline-md mb-1 leading-tight">12 West Oak Blvd, Apt 14B</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Northside Heights • berjarak 4.1 km</p>
              <button 
                onClick={() => handleStartTask('RL-2940-5899')}
                className="w-full bg-primary py-4 rounded-lg flex items-center justify-center gap-2 text-on-primary font-headline-md text-headline-md active:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Mulai Tugas
              </button>
            </div>
          </div>

          {/* Shipment Card 3 */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm touch-ripple opacity-80">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">local_shipping</span>
                <span className="font-mono-data text-mono-data text-on-surface-variant">RL-2940-6012</span>
              </div>
              <span className="bg-error-container px-2 py-1 rounded font-label-md text-label-md text-error">Terlambat</span>
            </div>
            <div className="p-4">
              <h3 className="font-headline-md text-headline-md mb-1 leading-tight">Industrial Area, Warehouse B2</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Eastern Logistics Hub • berjarak 8.5 km</p>
              <button 
                onClick={() => handleStartTask('RL-2940-6012')}
                className="w-full bg-primary py-4 rounded-lg flex items-center justify-center gap-2 text-on-primary font-headline-md text-headline-md active:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Mulai Tugas
              </button>
            </div>
          </div>

          {/* Shipment Card 4 */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm touch-ripple">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container">local_shipping</span>
                <span className="font-mono-data text-mono-data text-on-surface-variant">RL-2940-6105</span>
              </div>
              <span className="bg-surface-container px-2 py-1 rounded font-label-md text-label-md text-primary">Tertunda</span>
            </div>
            <div className="p-4">
              <h3 className="font-headline-md text-headline-md mb-1 leading-tight">45 Waterfront Quay</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Bayside District • berjarak 12.2 km</p>
              <button 
                onClick={() => handleStartTask('RL-2940-6105')}
                className="w-full bg-primary py-4 rounded-lg flex items-center justify-center gap-2 text-on-primary font-headline-md text-headline-md active:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Mulai Tugas
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-around items-center h-[72px] bg-surface border-t border-outline-variant shadow-sm px-4 pb-2 z-50">
        {/* Home (Active) */}
        <button 
          onClick={() => setActiveTab('home')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center rounded-full px-4 py-1 transition-transform active:scale-90 duration-150 ${activeTab === 'home' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className="font-label-md text-label-md-mobile">Beranda</span>
        </button>
        
        {/* My Tasks */}
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors active:scale-90 ${activeTab === 'tasks' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'tasks' ? { fontVariationSettings: "'FILL' 1" } : {}}>assignment</span>
          <span className="font-label-md text-label-md-mobile">Tugas Saya</span>
        </button>

        {/* Scanner */}
        <button 
          onClick={() => setActiveTab('scanner')}
          className={`appearance-none border-none outline-none flex flex-col items-center justify-center px-4 py-1 rounded-full transition-colors active:scale-90 ${activeTab === 'scanner' ? 'bg-primary-container text-on-primary-container' : 'bg-transparent text-on-surface-variant hover:bg-surface-container'}`}
        >
          <span className="material-symbols-outlined" style={activeTab === 'scanner' ? { fontVariationSettings: "'FILL' 1" } : {}}>qr_code_scanner</span>
          <span className="font-label-md text-label-md-mobile">Pemindai</span>
        </button>

        {/* Profile */}
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
