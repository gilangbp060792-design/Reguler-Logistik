import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const DriverScanner = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const shipmentId = state?.shipmentId;
  const { updateShipment } = useContext(AppContext);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('Delivered');
  const [holdReason, setHoldReason] = useState('');

  // Canvas Signature Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      ctx.scale(ratio, ratio);
      ctx.strokeStyle = '#003d9b';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (shipmentId) {
      updateShipment(shipmentId, {
        status: deliveryStatus === 'Delivered' ? 'Delivered' : 'Onhold',
        holdReason: deliveryStatus === 'Delivered' ? '' : holdReason,
        holdPhoto: photoCaptured ? 'captured.jpg' : null
      });
    }
    setShowSuccess(true);
  };

  const handleCameraClick = () => {
    setPhotoCaptured(true);
  };

  const handleReturnHome = () => {
    navigate('/driver/home');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navigation Anchor */}
      <header className="bg-surface sticky top-0 z-50 flex justify-between items-center w-full h-16 px-container-margin border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/driver/home')}
            className="w-touch-target-min h-touch-target-min flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Konfirmasi Pengiriman</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="material-symbols-outlined text-on-surface-variant ml-2">help_outline</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 bg-surface-container-lowest relative pb-24 px-container-margin pt-6 overflow-y-auto">
        
        {/* Shipment Info Banner */}
        {shipmentId ? (
          <div className="bg-primary-container text-on-primary-container px-4 py-3 mb-6 rounded-xl flex items-center justify-between shadow-sm border border-primary/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">package_2</span>
              <span className="font-label-md text-label-md font-bold tracking-wider">RESI: {shipmentId}</span>
            </div>
            <span className="bg-primary text-on-primary px-2 py-0.5 rounded font-label-md text-[10px]">AKTIF</span>
          </div>
        ) : (
          <div className="bg-surface-container text-on-surface-variant px-4 py-3 mb-6 rounded-xl flex items-center justify-between shadow-sm border border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              <span className="font-label-md text-label-md font-bold tracking-wider">TIDAK ADA RESI TERPILIH</span>
            </div>
          </div>
        )}

        {/* Shipment Brief */}
        <section className="mb-8 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID Pengiriman</span>
              <p className="font-mono-data text-mono-data text-primary">REG-88294-TX</p>
            </div>
            <div className="bg-secondary-container px-3 py-1 rounded-full">
              <span className="font-label-md text-label-md text-on-secondary-container">DI PERJALANAN</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <div>
              <p className="font-body-md font-bold text-on-surface">Modern Retail Hub</p>
              <p className="font-body-md text-on-surface-variant">102 Industrial Way, Austin, TX</p>
            </div>
          </div>
        </section>

        {/* POD Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Status Toggle */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">rule</span>
              STATUS PENGIRIMAN
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setDeliveryStatus('Delivered')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${deliveryStatus === 'Delivered' ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant bg-surface'}`}
              >
                <span className="material-symbols-outlined">check_circle</span>
                <span className="font-label-md font-bold">Berhasil Terkirim</span>
              </div>
              <div 
                onClick={() => setDeliveryStatus('Delayed')}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${deliveryStatus === 'Delayed' ? 'border-error bg-error-container text-on-error-container' : 'border-outline-variant bg-surface'}`}
              >
                <span className="material-symbols-outlined">pause_circle</span>
                <span className="font-label-md font-bold">Gagal / On Hold</span>
              </div>
            </div>
          </div>

          {/* Receiver Name */}
          {deliveryStatus === 'Delivered' && (
            <div className="space-y-2 animate-fade-in">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="receiver-name">
                <span className="material-symbols-outlined text-[16px]">person</span>
                NAMA PENERIMA
              </label>
              <input 
                className="w-full px-4 py-3 bg-white border border-outline rounded-lg font-body-lg focus:ring-0 focus:border-primary transition-all shadow-sm" 
                id="receiver-name" 
                placeholder="Masukkan nama lengkap" 
                type="text" 
                required
              />
            </div>
          )}

          {/* Hold Reason */}
          {deliveryStatus === 'Delayed' && (
            <div className="space-y-2 animate-fade-in">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2" htmlFor="hold-reason">
                <span className="material-symbols-outlined text-[16px]">error</span>
                ALASAN ON HOLD
              </label>
              <textarea 
                className="w-full px-4 py-3 bg-white border border-outline rounded-lg font-body-lg focus:ring-0 focus:border-primary transition-all shadow-sm" 
                id="hold-reason" 
                placeholder="Misal: Rumah kosong, pelanggan pindah, alamat tidak ditemukan" 
                rows="3"
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                required
              ></textarea>
            </div>
          )}

          {/* Photo Attachment */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              FOTO PENGIRIMAN
            </label>
            <div 
              onClick={handleCameraClick}
              className={`relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed h-48 flex flex-col items-center justify-center transition-all hover:bg-surface-container ${photoCaptured ? 'border-primary bg-surface-container' : 'border-outline-variant bg-surface-container-lowest hover:border-primary'}`}
            >
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzp5xjGvBzAO5U8ZdO0e5gHEYqFeANYLn6v7PgyHwuoOUNqnQZccYaTxwAelMPlbKR3loKcDWa-1TO8ieM4pe-z76nKb2ibI7i-jc1fBXP_YMoh5sb70vx_z54U1wVQyAJdxceWxpwv4q6yOD74LXOnXkZ3r8kdtH7sQ1b6QjAmJw8w3-O4UcTTWegjvvntU4eYFMhyPALsvuNH6DwrsVAeLztJmmAielt6mEqKkftbaGq6C_MZLbKZoXOg06ICUo0wljJimRtvRg')" }}
              ></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-md group-active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-3xl">{photoCaptured ? 'check_circle' : 'add_a_photo'}</span>
                </div>
                <p className="font-body-md font-bold text-primary">{photoCaptured ? 'Foto Diambil' : 'Ambil Foto'}</p>
                <p className="font-label-md text-on-surface-variant">{photoCaptured ? 'Ketuk untuk mengulang' : 'Wajib untuk Bukti'}</p>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          {deliveryStatus === 'Delivered' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">draw</span>
                  TANDA TANGAN DIGITAL
                </label>
                <button className="text-primary font-label-md hover:underline decoration-2 underline-offset-4" onClick={clearSignature} type="button">HAPUS</button>
              </div>
              <div className="relative bg-white border border-outline rounded-xl overflow-hidden shadow-sm">
                <canvas 
                  ref={canvasRef}
                  className="signature-pad w-full h-40 touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
                  onTouchMove={(e) => { e.preventDefault(); draw(e); }}
                  onTouchEnd={(e) => { e.preventDefault(); stopDrawing(); }}
                ></canvas>
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                  <div className="w-3/4 h-px bg-outline-variant mx-auto mb-1"></div>
                  <span className="font-label-md text-[10px] text-outline tracking-widest uppercase">Tanda tangan di atas garis</span>
                </div>
              </div>
            </div>
          )}

          {/* Primary CTA */}
          <div className="pt-6">
            <button className={`w-full h-14 text-white font-headline-md rounded-xl shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform active:opacity-90 ${deliveryStatus === 'Delivered' ? 'bg-secondary-container hover:bg-secondary' : 'bg-error hover:bg-red-600'}`} type="submit">
              <span className="material-symbols-outlined">{deliveryStatus === 'Delivered' ? 'verified' : 'report'}</span>
              {deliveryStatus === 'Delivered' ? 'Kirim Bukti (POD)' : 'Laporkan On Hold'}
            </button>
            <p className="mt-4 text-center text-on-surface-variant font-label-md">
              {deliveryStatus === 'Delivered' 
                ? 'Dengan mengirim, Anda mengonfirmasi bahwa paket dikirim dalam kondisi baik.'
                : 'Dengan melaporkan On Hold, paket akan ditandai tertunda dan perlu diproses ulang.'}
            </p>
          </div>
        </form>
      </main>

      {/* Bottom Navigation Shell (Filter: Active on Tasks) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-around items-center h-[72px] bg-surface border-t border-outline-variant shadow-sm px-4 pb-2 z-40 md:hidden">
        <button onClick={handleReturnHome} className="appearance-none border-none outline-none bg-transparent flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-label-md-mobile">Beranda</span>
        </button>
        <button className="appearance-none border-none outline-none flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
          <span className="font-label-md text-label-md-mobile">Tugas Saya</span>
        </button>
        <button className="appearance-none border-none outline-none bg-transparent flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">qr_code_scanner</span>
          <span className="font-label-md text-label-md-mobile">Pemindai</span>
        </button>
        <button className="appearance-none border-none outline-none bg-transparent flex flex-col items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md text-label-md-mobile">Profil</span>
        </button>
      </nav>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-on-surface/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">task_alt</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Pengiriman Dikonfirmasi</h2>
            <p className="font-body-md text-on-surface-variant mb-8">Bukti pengiriman untuk REG-88294-TX telah berhasil diunggah ke konsol pusat.</p>
            <button 
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-on-primary-fixed-variant transition-colors" 
              onClick={handleReturnHome}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverScanner;
