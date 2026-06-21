import React, { useState, useContext } from 'react';
import html2pdf from 'html2pdf.js';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RegionPicker from '../components/RegionPicker';

const generateResi = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PLN-';
  for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const AddressForm = ({ data, setData, title, number, nameLabel, customers = [] }) => (
  <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{number}</div>
      <span className="font-label-md" style={{ letterSpacing: '0.05em', fontSize: '13px' }}>{title}</span>
    </div>
    <div style={{ padding: '20px' }}>
      <div className="form-group">
        <label className="form-label">ISI CEPAT (DARI MASTER)</label>
        <select 
          className="form-control" 
          style={{ color: 'var(--outline)' }}
          onChange={(e) => {
            const cust = customers.find(c => c.id === e.target.value);
            if (cust) {
              setData({
                ...data,
                name: cust.pic || '',
                company: cust.name || '',
                phone: cust.phone || '',
                provinsi: cust.province || '',
                kota: cust.city || '',
                kecamatan: cust.district || '',
                kodePos: cust.zip || '',
                alamat: cust.address || ''
              });
            }
          }}
        >
          <option value="">-- Pilih Customer dari Master --</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.pic})</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">{nameLabel || 'PENGIRIM / PIC'}</label>
          <input className="form-control" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="" />
        </div>
        <div className="form-group">
          <label className="form-label">TELEPON</label>
          <input className="form-control" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">PERUSAHAAN (OPSIONAL)</label>
        <input className="form-control" value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} placeholder="" />
      </div>
      
      <div className="form-group" style={{ background: 'var(--surface-container-low)', padding: '16px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
        <label className="form-label" style={{ color: 'var(--primary)', marginBottom: '12px' }}>CARI KECAMATAN / KELURAHAN (AUTO FILL)</label>
        <RegionPicker 
          onSelect={(region) => {
            setData({
              ...data,
              provinsi: region.provinsi,
              kota: region.kota,
              kecamatan: region.kecamatan,
              kodePos: region.kodePos
            });
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">PROVINSI</label>
          <input className="form-control" value={data.provinsi} onChange={(e) => setData({ ...data, provinsi: e.target.value })} placeholder="" />
        </div>
        <div className="form-group">
          <label className="form-label">KOTA</label>
          <input className="form-control" value={data.kota} onChange={(e) => setData({ ...data, kota: e.target.value })} placeholder="" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">KECAMATAN</label>
          <input className="form-control" value={data.kecamatan} onChange={(e) => setData({ ...data, kecamatan: e.target.value })} placeholder="" />
        </div>
        <div className="form-group">
          <label className="form-label">KODE POS</label>
          <input className="form-control" value={data.kodePos} onChange={(e) => setData({ ...data, kodePos: e.target.value })} placeholder="" />
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">ALAMAT LENGKAP</label>
        <textarea className="form-control" value={data.alamat} onChange={(e) => setData({ ...data, alamat: e.target.value })} rows="3" style={{ resize: 'vertical' }}></textarea>
      </div>
    </div>
  </div>
);

const LayananRow = ({ label, checked, fee, onToggle, onFeeChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--outline-variant)' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ width: 16, height: 16, accentColor: 'var(--primary)', appearance: 'auto' }} />
      <span className="font-body-md">{label}</span>
    </label>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>Rp</span>
      <input
        type="number"
        className="form-control"
        style={{ width: '100px', padding: '6px 8px', textAlign: 'right', fontSize: '13px' }}
        value={fee}
        onChange={(e) => {
          const val = e.target.value;
          onFeeChange(val);
          if (Number(val) > 0 && !checked) onToggle();
          else if ((!val || Number(val) === 0) && checked) onToggle();
        }}
      />
    </div>
  </div>
);

const OrderBaru = () => {
  const { addShipment, drivers, customers, settings } = useContext(AppContext);
  const location = useLocation();
  const prefillData = location.state?.shipmentData || null;

  const [resi] = useState(prefillData ? prefillData.id : generateResi());
  const [saved, setSaved] = useState(false);

  // Pengirim
  const [pengirim, setPengirim] = useState({ 
    name: prefillData ? settings.companyName || 'Reguler Logistik' : '', 
    phone: '', company: '', 
    provinsi: '', kota: prefillData ? prefillData.origin.replace(', ID', '') : '', kecamatan: '', kodePos: '', alamat: '' 
  });
  // Penerima
  const [penerima, setPenerima] = useState({ 
    name: prefillData ? prefillData.customer : '', 
    phone: '', company: '', 
    provinsi: '', kota: prefillData ? prefillData.destination.replace(', ID', '') : '', kecamatan: '', kodePos: '', alamat: '' 
  });
  // Barang
  const [barang, setBarang] = useState({ nama: prefillData ? 'Paket Barang' : '', panjang: '', lebar: '', tinggi: '' });
  // Layanan Tambahan
  const [layanan, setLayanan] = useState({
    doorToDoor: false, doorToDoorFee: 0,
    cekPaket: false, cekPaketFee: 0,
    kemasan: false, kemasanFee: 0,
    lainnya: false, lainnyaFee: 0,
    asuransi: false, asuransiFee: 0,
    biayaCOD: false, biayaCODFee: 0,
  });
  // Kalkulasi
  const [kalkulasi, setKalkulasi] = useState({ jumlahPaket: 0, berat: 0, ongkirDasar: 0 });
  // Pembayaran
  const [pembayaran, setPembayaran] = useState({ metode: 'Tunai', dfod: false, dfodFee: '', resiKembali: false, nomorResiKembali: '' });

  const totalLayanan = (layanan.doorToDoor ? Number(layanan.doorToDoorFee) : 0)
    + (layanan.cekPaket ? Number(layanan.cekPaketFee) : 0)
    + (layanan.kemasan ? Number(layanan.kemasanFee) : 0)
    + (layanan.lainnya ? Number(layanan.lainnyaFee) : 0)
    + (layanan.asuransi ? Number(layanan.asuransiFee) : 0)
    + (layanan.biayaCOD ? Number(layanan.biayaCODFee) : 0);

  const totalBiaya = Number(kalkulasi.ongkirDasar) + totalLayanan + (pembayaran.dfod ? Number(pembayaran.dfodFee || 0) : 0);

  const handleSave = () => {
    if (!pengirim.name || !penerima.name || !barang.nama) {
      alert('Mohon lengkapi data pengirim, penerima, dan informasi barang.');
      return;
    }

    addShipment({
      origin: `${pengirim.kota || pengirim.provinsi || 'N/A'}, ID`,
      destination: `${penerima.kota || penerima.provinsi || 'N/A'}, ID`,
      customer: pengirim.company || pengirim.name,
      priority: 'Standard',
      notes: `Barang: ${barang.nama} | Resi: ${resi} | Berat: ${kalkulasi.berat}kg | Total: Rp ${totalBiaya.toLocaleString('id-ID')}`,
      eta: '-',
      driverId: '',
      pengirim: pengirim,
      penerima: penerima,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printArea = document.getElementById('print-area');
    if (!printArea) return;
    
    // Temporarily show for html2pdf rendering
    printArea.classList.remove('print-only');
    printArea.style.display = 'block';
    
    const opt = {
      margin: 0,
      filename: `AWB_${resi}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(printArea).save().then(() => {
      // Restore styles
      printArea.classList.add('print-only');
      printArea.style.display = '';
    });
  };



  const AwbPrintLayout = () => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    return (
      <div id="print-area" className="print-only" style={{ background: 'white', color: '#0f172a', padding: '40px', fontFamily: '"Inter", sans-serif', width: '100%', minHeight: '100vh', boxSizing: 'border-box' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #f1f5f9', paddingBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em' }}>Reguler Logistik</div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Logistics & Supply Chain Excellence</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking Number</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em', marginTop: '2px' }}>{resi}</div>
          </div>
        </div>

        {/* Barcode and Core Info (Modern Card) */}
        <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>ORIGIN</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{pengirim.kota || pengirim.provinsi || 'N/A'}</div>
            </div>
            <div style={{ padding: '0 24px', color: '#cbd5e1' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>arrow_forward</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>DESTINATION</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{penerima.kota || penerima.provinsi || 'N/A'}</div>
            </div>
            <div style={{ background: '#1e3a8a', color: 'white', padding: '12px 24px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, opacity: 0.8, marginBottom: '2px' }}>SERVICE</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>REG</div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
            <img src={`https://barcode.tec-it.com/barcode.ashx?data=${resi}&code=Code128&dpi=96&dataseparator=`} alt="Barcode" style={{ height: '60px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>DATE</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{today}</div>
          </div>
          <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>WEIGHT</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{kalkulasi.berat || '0'} KG</div>
          </div>
          <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>DIMENSIONS</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              {barang.panjang || '0'}x{barang.lebar || '0'}x{barang.tinggi || '0'} CM
            </div>
          </div>
          <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>PIECES</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{kalkulasi.jumlahPaket || '1'} PKG</div>
          </div>
        </div>

        {/* Sender & Recipient Modern */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '24px', height: '24px', background: '#eff6ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
              </div>
              SENDER DETAILS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{pengirim.company || pengirim.name || '-'}</div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>{pengirim.phone || '-'}</div>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              {pengirim.alamat || '-'}<br />
              {pengirim.kecamatan ? pengirim.kecamatan + ', ' : ''}{pengirim.kota || pengirim.provinsi || '-'}<br />
              {pengirim.kodePos}
            </div>
          </div>
          <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '24px', height: '24px', background: '#ecfdf5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
              </div>
              RECIPIENT DETAILS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{penerima.company || penerima.name || '-'}</div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>{penerima.phone || '-'}</div>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              {penerima.alamat || '-'}<br />
              {penerima.kecamatan ? penerima.kecamatan + ', ' : ''}{penerima.kota || penerima.provinsi || '-'}<br />
              {penerima.kodePos}
            </div>
          </div>
        </div>

        {/* Items & Instructions */}
        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>PACKAGE CONTENTS</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                {kalkulasi.jumlahPaket || '1'}x {barang.nama || 'Items'}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                {layanan.asuransi && <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>INSURED</span>}
                {layanan.doorToDoor && <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>DOOR TO DOOR</span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>SPECIAL INSTRUCTIONS</div>
              <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: 500 }}>
                {layanan.kemasan ? 'Extra Packaging Required' : 'Standard Handling'}<br />
                {pembayaran.dfod && <span style={{ color: '#ef4444', fontWeight: 700, marginTop: '4px', display: 'block' }}>DFOD: Collect Rp {Number(pembayaran.dfodFee || 0).toLocaleString('id-ID')}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* T&C and Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '24px', borderTop: '1px dashed #cbd5e1' }}>
          <div style={{ width: '40%', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${resi}`} alt="QR Code" style={{ width: '72px', height: '72px' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>SCAN FOR E-RECEIPT</div>
              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: '1.4' }}>
                By signing, I agree to the terms and conditions.<br/>Official document generated by Reguler Logistik V4.2
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', width: '140px', marginBottom: '8px' }}></div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Courier Signature</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', width: '140px', marginBottom: '8px' }}></div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>Recipient Signature</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-slide-up">
      <div className="no-print">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Reguler Logistik</h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '2px' }}>Layanan Pengiriman</p>
        </div>
        <div className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Barcode-like lines */}
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: i % 2 === 0 ? '40px' : '30px', height: '3px', background: 'var(--primary)', borderRadius: '1px' }}></div>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="font-label-md" style={{ color: 'var(--secondary)', fontSize: '10px' }}>NO. RESI OTOMATIS</p>
            <p className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>{resi}</p>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} className="animate-slide-up">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
          Order berhasil disimpan! No. Resi: {resi}
        </div>
      )}

      {/* Main 3-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Column 1: Pengirim + Penerima */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AddressForm data={pengirim} setData={setPengirim} title="Informasi Pengirim" number="1" customers={customers} />
          <AddressForm data={penerima} setData={setPenerima} title="Informasi Penerima" number="2" customers={customers} />
        </div>

        {/* Column 2: Barang + Layanan Tambahan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Informasi Barang */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Informasi Barang</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="form-group">
                <label className="form-label">NAMA BARANG</label>
                <input className="form-control" value={barang.nama} onChange={(e) => setBarang({ ...barang, nama: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">DIMENSI (CM)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input className="form-control" style={{ width: '70px', textAlign: 'center' }} placeholder="P" value={barang.panjang} onChange={(e) => setBarang({ ...barang, panjang: e.target.value })} />
                  <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>x</span>
                  <input className="form-control" style={{ width: '70px', textAlign: 'center' }} placeholder="L" value={barang.lebar} onChange={(e) => setBarang({ ...barang, lebar: e.target.value })} />
                  <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>x</span>
                  <input className="form-control" style={{ width: '70px', textAlign: 'center' }} placeholder="T" value={barang.tinggi} onChange={(e) => setBarang({ ...barang, tinggi: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Layanan Tambahan */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>4</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Layanan Tambahan</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <LayananRow label="Door to Door" checked={layanan.doorToDoor} fee={layanan.doorToDoorFee} onToggle={() => setLayanan({ ...layanan, doorToDoor: !layanan.doorToDoor })} onFeeChange={(v) => setLayanan({ ...layanan, doorToDoorFee: v })} />
              <LayananRow label="Cek Paket" checked={layanan.cekPaket} fee={layanan.cekPaketFee} onToggle={() => setLayanan({ ...layanan, cekPaket: !layanan.cekPaket })} onFeeChange={(v) => setLayanan({ ...layanan, cekPaketFee: v })} />
              <LayananRow label="Kemasan" checked={layanan.kemasan} fee={layanan.kemasanFee} onToggle={() => setLayanan({ ...layanan, kemasan: !layanan.kemasan })} onFeeChange={(v) => setLayanan({ ...layanan, kemasanFee: v })} />
              <LayananRow label="Lainnya" checked={layanan.lainnya} fee={layanan.lainnyaFee} onToggle={() => setLayanan({ ...layanan, lainnya: !layanan.lainnya })} onFeeChange={(v) => setLayanan({ ...layanan, lainnyaFee: v })} />
              <LayananRow label="Asuransi" checked={layanan.asuransi} fee={layanan.asuransiFee} onToggle={() => setLayanan({ ...layanan, asuransi: !layanan.asuransi })} onFeeChange={(v) => setLayanan({ ...layanan, asuransiFee: v })} />
              <div style={{ borderBottom: 'none' }}>
                <LayananRow label="Biaya COD" checked={layanan.biayaCOD} fee={layanan.biayaCODFee} onToggle={() => setLayanan({ ...layanan, biayaCOD: !layanan.biayaCOD })} onFeeChange={(v) => setLayanan({ ...layanan, biayaCODFee: v })} />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Kalkulasi + Pembayaran */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Kalkulasi Biaya */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>5</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Kalkulasi Biaya</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-body-md">Jumlah Paket:</span>
                <input type="number" className="form-control" style={{ width: '100px', textAlign: 'right', padding: '6px 8px' }} value={kalkulasi.jumlahPaket} onChange={(e) => setKalkulasi({ ...kalkulasi, jumlahPaket: Number(e.target.value) })} min="0" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-body-md">Berat (Kg):</span>
                <input type="number" step="0.1" className="form-control" style={{ width: '100px', textAlign: 'right', padding: '6px 8px' }} value={kalkulasi.berat} onChange={(e) => setKalkulasi({ ...kalkulasi, berat: Number(e.target.value) })} min="0" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--outline-variant)' }}>
                <span className="font-body-md">Ongkir Dasar:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input type="number" className="form-control" style={{ width: '120px', textAlign: 'right', padding: '6px 8px' }} value={kalkulasi.ongkirDasar} onChange={(e) => setKalkulasi({ ...kalkulasi, ongkirDasar: Number(e.target.value) })} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>TOTAL BIAYA:</span>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Rp {totalBiaya.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>6</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Metode Pembayaran</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="metode" value="Tunai" checked={pembayaran.metode === 'Tunai'} onChange={() => setPembayaran({ ...pembayaran, metode: 'Tunai' })} style={{ accentColor: 'var(--primary)' }} />
                  <span className="font-body-md" style={{ fontWeight: 500 }}>Tunai</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="metode" value="Bulanan" checked={pembayaran.metode === 'Bulanan'} onChange={() => setPembayaran({ ...pembayaran, metode: 'Bulanan' })} style={{ accentColor: 'var(--primary)' }} />
                  <span className="font-body-md" style={{ fontWeight: 500 }}>Bulanan</span>
                </label>
              </div>

              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={pembayaran.dfod} onChange={() => setPembayaran({ ...pembayaran, dfod: !pembayaran.dfod })} style={{ accentColor: 'var(--primary)' }} />
                    <span className="font-body-md">DFOD</span>
                  </label>
                  <input className="form-control" style={{ width: '120px', padding: '6px 8px', textAlign: 'right' }} placeholder="Rp Biaya DF" value={pembayaran.dfodFee} onChange={(e) => setPembayaran({ ...pembayaran, dfodFee: e.target.value })} disabled={!pembayaran.dfod} />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={pembayaran.resiKembali} onChange={() => setPembayaran({ ...pembayaran, resiKembali: !pembayaran.resiKembali })} style={{ accentColor: 'var(--primary)' }} />
                  <span className="font-body-md">Layanan Resi Kembali</span>
                </label>

                {pembayaran.resiKembali && (
                  <input className="form-control" placeholder="Masukkan Nomor Resi Kembali..." value={pembayaran.nomorResiKembali} onChange={(e) => setPembayaran({ ...pembayaran, nomorResiKembali: e.target.value })} />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={handleDownload} style={{ padding: '12px 24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              DOWNLOAD PDF
            </button>
            <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '12px 24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
              PRINT & REVIEW
            </button>
            <button className="btn btn-success" onClick={handleSave} style={{ padding: '12px 24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
              SIMPAN
            </button>
          </div>
        </div>
      </div>
      </div>
      
      {/* Hidden Print Layout */}
      <AwbPrintLayout />
    </div>
  );
};

export default OrderBaru;
