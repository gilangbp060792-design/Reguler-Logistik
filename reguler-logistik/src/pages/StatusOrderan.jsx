import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

const StatusOrderan = () => {
  const { shipments, updateShipment } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Pickup');
  const [scanMode, setScanMode] = useState('usb'); // 'usb' or 'camera'
  const [scanInput, setScanInput] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const inputRef = useRef(null);

  const tabs = [
    { id: 'Pickup', label: 'Pickup', icon: 'local_shipping', statusTarget: 'Picked Up', color: '#0891b2' },
    { id: 'Inbound', label: 'Inbound', icon: 'login', statusTarget: 'Inbound', color: '#8b5cf6' },
    { id: 'Outbound', label: 'Outbound', icon: 'logout', statusTarget: 'In-Transit', color: '#3b82f6' },
    { id: 'Onhold', label: 'Onhold', icon: 'pause_circle', statusTarget: 'Onhold', color: '#f59e0b' },
    { id: 'Delivery', label: 'Delivery POD', icon: 'task_alt', statusTarget: 'Delivered', color: '#10b981' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  // Keep focus on input for continuous scanning in USB mode
  useEffect(() => {
    if (scanMode === 'usb' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTab, scanMode]);

  useEffect(() => {
    let scanner = null;
    if (scanMode === 'camera') {
      if (window.Html5QrcodeScanner) {
        scanner = new window.Html5QrcodeScanner("reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }, false);
        
        scanner.render(
          (decodedText) => {
            // Play a small beep sound for feedback
            const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
            
            processBarcode(decodedText);
            
            // Briefly pause the scanner to prevent duplicate scans
            if (scanner) {
              scanner.pause(true);
              setTimeout(() => {
                if (scanner) scanner.resume();
              }, 2000);
            }
          },
          (error) => {
            // ignore background errors from scanning empty space
          }
        );
      } else {
        console.error("Html5QrcodeScanner is not loaded.");
      }
    }
    
    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [scanMode, activeTab]);

  const processBarcode = (barcode) => {
    if (!barcode) return;

    const shipment = shipments.find(s => s.id.toLowerCase() === barcode.toLowerCase());
    
    if (shipment) {
      // Update status
      updateShipment(shipment.id, { status: currentTab.statusTarget });
      
      // Add to recent scans list for visual feedback
      setRecentScans(prev => [
        { 
          id: shipment.id, 
          customer: shipment.customer, 
          time: new Date().toLocaleTimeString(),
          success: true,
          message: `Status diperbarui menjadi ${currentTab.label}`
        },
        ...prev
      ].slice(0, 50));
    } else {
      // Error - not found
      setRecentScans(prev => [
        { 
          id: barcode, 
          time: new Date().toLocaleTimeString(),
          success: false,
          message: 'Resi tidak ditemukan di sistem'
        },
        ...prev
      ].slice(0, 50));
    }
  };

  const handleScan = (e) => {
    e.preventDefault();
    processBarcode(scanInput.trim());
    setScanInput(''); // Clear for next scan
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '24px' }}>
        <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Update Status Orderan</h2>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>Scan barcode resi untuk memperbarui status paket secara massal</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setRecentScans([]); }}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `1px solid ${activeTab === tab.id ? tab.color : 'var(--outline-variant)'}`,
              background: activeTab === tab.id ? `${tab.color}15` : 'white',
              color: activeTab === tab.id ? tab.color : 'var(--on-surface-variant)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Scanner Column */}
        <div className="card" style={{ padding: '32px', textAlign: 'center', background: 'white' }}>
          <div style={{ width: '80px', height: '80px', background: `${currentTab.color}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: currentTab.color }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40 }}>barcode_scanner</span>
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>Mode Scan: {currentTab.label}</h3>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '24px' }}>
            Setiap resi yang discan akan otomatis diubah statusnya menjadi <strong>{currentTab.statusTarget}</strong>.
          </p>

          {/* Scanner Mode Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            <button 
              type="button"
              onClick={() => setScanMode('usb')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', background: scanMode === 'usb' ? 'white' : 'transparent', color: scanMode === 'usb' ? '#0f172a' : '#64748b', boxShadow: scanMode === 'usb' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>usb</span>
              USB / Bluetooth
            </button>
            <button 
              type="button"
              onClick={() => setScanMode('camera')}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', background: scanMode === 'camera' ? 'white' : 'transparent', color: scanMode === 'camera' ? '#0f172a' : '#64748b', boxShadow: scanMode === 'camera' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>photo_camera</span>
              Kamera
            </button>
          </div>

          {scanMode === 'usb' ? (
            <form onSubmit={handleScan}>
              <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Scan Barcode Resi di sini..."
                  style={{
                    width: '100%',
                    padding: '16px 24px 16px 56px',
                    fontSize: '18px',
                    borderRadius: '12px',
                    border: `2px solid ${currentTab.color}`,
                    outline: 'none',
                    boxShadow: `0 4px 12px ${currentTab.color}20`
                  }}
                  autoFocus
                />
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: currentTab.color, fontSize: 28 }}>qr_code_scanner</span>
              </div>
              
              <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '16px', fontStyle: 'italic' }}>
                * Pastikan kursor berada di dalam kotak teks saat melakukan scan menggunakan USB/Bluetooth Scanner
              </p>
            </form>
          ) : (
            <div style={{ maxWidth: '400px', margin: '0 auto', overflow: 'hidden', borderRadius: '12px', border: `2px solid ${currentTab.color}`, background: '#f8fafc', padding: '16px' }}>
              <div id="reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>
              <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)', marginTop: '16px', textAlign: 'center' }}>
                Arahkan kamera ke barcode resi (awalan RL- atau PLN-)
              </p>
            </div>
          )}
        </div>

        {/* Recent Scans Column */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--outline-variant)', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>history</span>
              Riwayat Scan Terakhir
            </h3>
            <span style={{ background: 'var(--surface-container-high)', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600 }}>
              {recentScans.length} Resi
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {recentScans.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--outline)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: '16px', opacity: 0.5 }}>receipt_long</span>
                <p>Belum ada data resi yang discan.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentScans.map((scan, i) => (
                  <div key={i} className="animate-slide-up" style={{ 
                    padding: '16px', 
                    borderRadius: '8px', 
                    background: scan.success ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${scan.success ? '#bbf7d0' : '#fecaca'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{ color: scan.success ? '#16a34a' : '#dc2626' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                        {scan.success ? 'check_circle' : 'error'}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{scan.id}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{scan.time}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: scan.success ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {scan.success && scan.customer && <span style={{ fontWeight: 600 }}>{scan.customer} - </span>}
                        {scan.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatusOrderan;
