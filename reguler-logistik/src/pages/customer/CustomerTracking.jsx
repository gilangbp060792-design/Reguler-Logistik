import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const Tracking = () => {
  const { shipments } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([
    { id: 'RL-2023-11024', status: 'In-Transit', origin: 'Jakarta', destination: 'Surabaya', time: '2 Jam yang lalu', message: 'Tiba di Sortasi Bekasi' },
    { id: 'RL-2023-10988', status: 'Delivered', origin: 'Bandung', destination: 'Medan', time: 'Kemarin, 14:20', message: 'Diterima oleh Bpk. Anto' },
    { id: 'RL-2023-11042', status: 'Pending', origin: 'Semarang', destination: 'Bali', time: 'Baru saja', message: 'Sedang Diproses Gudang' },
    { id: 'RL-2023-09881', status: 'Delayed', origin: 'Palembang', destination: 'Jakarta', time: '5 Jam yang lalu', message: 'Alamat Tidak Ditemukan' }
  ]);

  const stats = {
    transit: shipments.filter(s => s.status === 'In-Transit').length,
    delivering: shipments.filter(s => s.status === 'Picked Up').length,
    problem: shipments.filter(s => s.status === 'Delayed' || s.status === 'Onhold').length
  };

  const [trackedShipment, setTrackedShipment] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setErrorMsg('');
    const found = shipments.find(s => s.id.toLowerCase() === search.trim().toLowerCase());
    if (found) {
      setTrackedShipment(found);
      
      // Add to history if not already there
      const exists = history.find(h => h.id === found.id);
      if (!exists) {
        setHistory([{
          id: found.id,
          status: found.status,
          origin: found.origin?.split(',')[0] || 'Unknown',
          destination: found.destination?.split(',')[0] || 'Unknown',
          time: 'Baru saja',
          message: 'Pencarian Baru'
        }, ...history].slice(0, 4));
      }
    } else {
      setTrackedShipment(null);
      setErrorMsg(`Resi ${search} tidak ditemukan dalam sistem.`);
    }
  };

  const clearHistory = () => setHistory([]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'In-Transit': return <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600 }}>Transit</span>;
      case 'Delivered': return <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600 }}>Selesai</span>;
      case 'Pending': return <span style={{ background: '#ffedd5', color: '#9a3412', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600 }}>Proses</span>;
      case 'Delayed':
      case 'Onhold': return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600 }}>Bermasalah</span>;
      default: return <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600 }}>{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'In-Transit': return <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#3730a3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>inventory_2</span></div>;
      case 'Delivered': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #16a34a', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 24 }}>check_circle</span></div>;
      case 'Pending': return <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>inbox</span></div>;
      case 'Delayed':
      case 'Onhold': return <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-outlined" style={{ fontSize: 24 }}>error</span></div>;
      default: return null;
    }
  };

  return (
    <div className="animate-slide-up" style={{ background: '#f8fafc', minHeight: '100%', padding: '0 0 40px 0', margin: '-24px', width: 'calc(100% + 48px)' }}>
      
      {/* Top Banner Banner */}
      <div style={{ background: 'linear-gradient(90deg, #0052cc 0%, #1e40af 100%)', padding: '60px 24px', textAlign: 'center', borderRadius: '0 0 16px 16px', position: 'relative' }}>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, margin: '0 0 8px 0' }}>Lacak Paket Anda</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginBottom: '32px' }}>Masukkan nomor resi pengiriman untuk memantau status secara real-time.</p>
        
        <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', background: 'white', borderRadius: '8px', padding: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: '#64748b' }}>
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text" 
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', padding: '12px 0' }}
            placeholder="Contoh: RL-2023-88910..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" style={{ background: '#0f4296', color: 'white', border: 'none', borderRadius: '6px', padding: '0 32px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
            Lacak Resi
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
          <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 16px', borderRadius: '16px', fontSize: '11px', fontWeight: 500 }}>Support All Carriers</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 16px', borderRadius: '16px', fontSize: '11px', fontWeight: 500 }}>API Real-time Connection</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 16px', borderRadius: '16px', fontSize: '11px', fontWeight: 500 }}>Multi-tracking Enabled</span>
        </div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Main Content */}
        <div>
          {trackedShipment ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Hasil Pencarian: {trackedShipment.id}</h2>
                <button onClick={() => setTrackedShipment(null)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#0052cc', cursor: 'pointer' }}>
                  Kembali
                </button>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>STATUS TERKINI</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{trackedShipment.status}</span>
                      {getStatusBadge(trackedShipment.status)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>ESTIMASI TIBA</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{trackedShipment.eta || '-'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>ASAL PENGIRIMAN</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{trackedShipment.origin}</div>
                  </div>
                  <div style={{ padding: '0 24px', color: '#cbd5e1', display: 'flex', alignItems: 'center' }}>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>TUJUAN PENGIRIMAN</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{trackedShipment.destination}</div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  <div style={{ position: 'absolute', top: '8px', bottom: '8px', left: '7px', width: '2px', background: '#e2e8f0' }}></div>
                  
                  {['Delivered', 'In-Transit', 'Picked Up', 'Pending'].map((step, idx) => {
                    // Logic to determine if step is completed/active based on current status
                    const stepsOrder = ['Pending', 'Picked Up', 'In-Transit', 'Delivered'];
                    const currentIdx = stepsOrder.indexOf(trackedShipment.status === 'Delayed' || trackedShipment.status === 'Onhold' ? 'In-Transit' : trackedShipment.status);
                    const stepIdx = stepsOrder.indexOf(step);
                    
                    const isCompleted = currentIdx >= stepIdx;
                    const isActive = currentIdx === stepIdx;
                    
                    if (!isCompleted && !isActive) return null; // Don't show future steps
                    
                    let title = '';
                    let desc = '';
                    switch(step) {
                      case 'Pending': title = 'Pesanan Dibuat'; desc = 'Menunggu penugasan kurir'; break;
                      case 'Picked Up': title = 'Kurir Menjemput'; desc = 'Paket telah diambil oleh kurir'; break;
                      case 'In-Transit': title = 'Dalam Perjalanan'; desc = trackedShipment.status === 'Delayed' ? trackedShipment.notes || 'Terjadi keterlambatan' : 'Paket sedang menuju kota tujuan'; break;
                      case 'Delivered': title = 'Paket Selesai'; desc = 'Telah diterima di lokasi tujuan'; break;
                    }
                    
                    return (
                      <div key={step} style={{ position: 'relative', marginBottom: idx === 3 ? 0 : '24px' }}>
                        <div style={{ 
                          position: 'absolute', left: '-25px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', 
                          background: isActive ? '#0052cc' : (isCompleted ? '#10b981' : '#cbd5e1'), 
                          border: `3px solid white`, boxShadow: '0 0 0 1px #e2e8f0', zIndex: 2
                        }}></div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: isActive ? '#0052cc' : '#0f172a', marginBottom: '2px' }}>{title}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>{desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Riwayat Pencarian Terakhir</h2>
                <button onClick={clearHistory} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#0052cc', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  Bersihkan Riwayat
                </button>
              </div>

              {errorMsg && (
                <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined">error</span> {errorMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {history.map((h, i) => (
                  <div key={i} onClick={() => { setSearch(h.id); handleSearch({ preventDefault: () => {} }); }} style={{ border: `1px solid ${h.status === 'Delayed' || h.status === 'Onhold' ? '#fecaca' : '#e2e8f0'}`, borderLeft: h.status === 'Delayed' || h.status === 'Onhold' ? '4px solid #dc2626' : undefined, borderRadius: '8px', background: 'white', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }} className="hover-border-primary">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0052cc' }}>#{h.id}</span>
                      {getStatusBadge(h.status)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                      {h.origin} <span style={{ margin: '0 4px' }}>→</span> {h.destination}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {getStatusIcon(h.status)}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: h.status === 'Delayed' || h.status === 'Onhold' ? '#991b1b' : '#0f172a' }}>{h.message}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{h.time}</div>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>arrow_forward</span>
                    </div>
                  </div>
                ))}
              </div>


            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
