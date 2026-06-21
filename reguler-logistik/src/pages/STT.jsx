import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { AppContext } from '../context/AppContext';

const generateSTT = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LTPLW-';
  for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const SectionHeader = ({ title }) => (
  <div style={{ background: '#f8fafc', color: 'var(--primary)', padding: '12px 16px', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>
    {title}
  </div>
);

const FormRow = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
    <div style={{ width: '100px', fontSize: '12px', color: 'var(--on-surface)' }}>{label}</div>
    <div style={{ marginRight: '12px', color: 'var(--on-surface-variant)' }}>:</div>
    <input
      type={type}
      style={{
        flex: 1,
        border: 'none',
        borderBottom: '1px solid var(--outline-variant)',
        borderRadius: 0,
        padding: '4px 0',
        background: 'transparent',
        fontSize: '13px',
        color: 'var(--on-surface)',
        outline: 'none'
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const STT = () => {
  const { settings } = useContext(AppContext);
  const location = useLocation();
  const prefillData = location.state?.shipmentData || null;

  const [sttNumber] = useState(prefillData ? prefillData.id : generateSTT());
  const [saved, setSaved] = useState(false);

  const [pengirim, setPengirim] = useState({ 
    nama: prefillData ? settings.companyName || 'Reguler Logistik' : '', 
    alamat: prefillData ? prefillData.origin : '', 
    telp: '' 
  });
  
  const [penerima, setPenerima] = useState({ 
    nama: prefillData ? prefillData.customer : '', 
    alamat: prefillData ? prefillData.destination : '', 
    telp: '' 
  });
  
  const [info, setInfo] = useState({
    layanan: 'Darat (Trucking)',
    tujuan: prefillData ? prefillData.destination : '',
    driver: '',
    kendaraan: '',
    referensi: '',
    estPengiriman: prefillData?.eta || '',
    tipePembayaran: 'Tunai',
    totalBiaya: '',
  });

  const [items, setItems] = useState([
    { id: 1, resi: '', jumlah: '', berat: '', keterangan: '' }
  ]);

  const [catatan, setCatatan] = useState('');

  const handleAddItem = () => {
    const newItem = { id: Date.now(), resi: '', jumlah: '', berat: '', keterangan: '' };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totalJumlah = items.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0);
  const totalBerat = items.reduce((sum, item) => sum + (Number(item.berat) || 0), 0);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('print-area');
    const opt = {
      margin:       0.5,
      filename:     `STT_${sttNumber}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };



  return (
    <div className="animate-slide-up" style={{ paddingBottom: '40px' }}>
      <div id="print-area" className="card" style={{ padding: '40px', background: 'white', maxWidth: '1000px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {saved && (
          <div className="no-print" style={{ background: '#f1f5f9', color: 'var(--primary)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
            STT {sttNumber} berhasil disimpan!
          </div>
        )}

        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {settings?.appLogo ? (
              <img src={settings.appLogo} alt="Logo" style={{ maxHeight: '100px', maxWidth: '300px', objectFit: 'contain' }} />
            ) : (
              <>
                <div style={{ background: 'var(--primary)', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'white' }}>inventory_2</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {settings?.companyName || 'REGULER LOGISTIK'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>SOLUSI PENGIRIMAN TERPERCAYA</div>
                </div>
              </>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>SURAT TANDA TERIMA (STT)</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>No. STT</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', marginBottom: '8px' }}>{sttNumber}</div>
            {/* Barcode */}
            <div style={{ display: 'flex', justifyContent: 'center', height: '32px', alignItems: 'center' }}>
              <img src={`https://barcode.tec-it.com/barcode.ashx?data=${sttNumber}&code=Code128&dpi=96&dataseparator=`} alt="Barcode" style={{ height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        {/* Pengirim & Penerima */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <SectionHeader title="DATA PENGIRIM" />
            <div style={{ padding: '20px' }}>
              <FormRow label="Nama / PT" placeholder="Nama Pengirim" value={pengirim.nama} onChange={(e) => setPengirim({ ...pengirim, nama: e.target.value })} />
              <FormRow label="Alamat" placeholder="Alamat Lengkap Pengirim" value={pengirim.alamat} onChange={(e) => setPengirim({ ...pengirim, alamat: e.target.value })} />
              <FormRow label="No. Telp" placeholder="08..." value={pengirim.telp} onChange={(e) => setPengirim({ ...pengirim, telp: e.target.value })} />
            </div>
          </div>
          
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <SectionHeader title="DATA PENERIMA" />
            <div style={{ padding: '20px' }}>
              <FormRow label="Nama / PT" placeholder="Nama Penerima" value={penerima.nama} onChange={(e) => setPenerima({ ...penerima, nama: e.target.value })} />
              <FormRow label="Alamat" placeholder="Alamat Lengkap Penerima" value={penerima.alamat} onChange={(e) => setPenerima({ ...penerima, alamat: e.target.value })} />
              <FormRow label="No. Telp" placeholder="08..." value={penerima.telp} onChange={(e) => setPenerima({ ...penerima, telp: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Informasi Pengiriman */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
          <SectionHeader title="INFORMASI PENGIRIMAN" />
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <FormRow label="Layanan" placeholder="Darat (Trucking)" value={info.layanan} onChange={(e) => setInfo({ ...info, layanan: e.target.value })} />
              <FormRow label="Tujuan (Kota)" placeholder="Kota Tujuan" value={info.tujuan} onChange={(e) => setInfo({ ...info, tujuan: e.target.value })} />
              <FormRow label="Nama Driver" placeholder="Nama Driver Opsional" value={info.driver} onChange={(e) => setInfo({ ...info, driver: e.target.value })} />
              <FormRow label="Kendaraan" placeholder="Contoh: B 1234 CD" value={info.kendaraan} onChange={(e) => setInfo({ ...info, kendaraan: e.target.value })} />
            </div>
            <div>
              <FormRow label="No. Resi / DO Ref" placeholder="Referensi Eksternal (Opsional)" value={info.referensi} onChange={(e) => setInfo({ ...info, referensi: e.target.value })} />
              <FormRow label="Est. Pengiriman" type="date" value={info.estPengiriman} onChange={(e) => setInfo({ ...info, estPengiriman: e.target.value })} />
              <FormRow label="Tipe Pembayaran" placeholder="Tunai" value={info.tipePembayaran} onChange={(e) => setInfo({ ...info, tipePembayaran: e.target.value })} />
              <FormRow label="Total Biaya Rp" placeholder="0" type="number" value={info.totalBiaya} onChange={(e) => setInfo({ ...info, totalBiaya: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Detail Barang */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.05em' }}>DETAIL BARANG</span>
            <button 
              onClick={handleAddItem}
              className="no-print"
              style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              + Tambah Baris
            </button>
          </div>
          
          <div style={{ padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--outline-variant)' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface-variant)', width: '40px' }}>NO.</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface-variant)' }}>NO. RESI</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--on-surface-variant)', width: '80px' }}>JUMLAH</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--on-surface-variant)', width: '100px' }}>BERAT (KG)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--on-surface-variant)' }}>KETERANGAN</th>
                  <th style={{ padding: '12px 16px', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--on-surface-variant)' }}>{index + 1}</td>
                    <td style={{ padding: '8px 16px' }}>
                      <input type="text" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} placeholder="Masukkan No. Resi..." value={item.resi} onChange={(e) => updateItem(item.id, 'resi', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                      <input type="number" style={{ width: '60px', textAlign: 'center', border: 'none', outline: 'none', background: 'transparent' }} placeholder="0" value={item.jumlah} onChange={(e) => updateItem(item.id, 'jumlah', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                      <input type="number" style={{ width: '60px', textAlign: 'center', border: 'none', outline: 'none', background: 'transparent' }} placeholder="0" value={item.berat} onChange={(e) => updateItem(item.id, 'berat', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 16px' }}>
                      <input type="text" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} placeholder="Baik/Rusak" value={item.keterangan} onChange={(e) => updateItem(item.id, 'keterangan', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 16px', textAlign: 'right' }}>
                      <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', opacity: items.length > 1 ? 1 : 0.3 }} disabled={items.length <= 1}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                  <td colSpan="2" style={{ padding: '12px 16px', textAlign: 'right' }}>TOTAL KESELURUHAN</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{totalJumlah}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{totalBerat}</td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Catatan */}
        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--on-surface)' }}>Catatan / Kondisi Barang :</label>
          <textarea 
            style={{ width: '100%', border: '1px solid var(--outline-variant)', borderRadius: '8px', padding: '12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }} 
            rows="3" 
            placeholder="Contoh: Barang diterima dalam kondisi baik, tersegel..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--outline-variant)', paddingTop: '24px' }}>
          <button className="btn" onClick={handleDownloadPDF} style={{ padding: '12px 24px', background: 'var(--surface-container-high)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
            DOWNLOAD PDF
          </button>
          <button className="btn" onClick={handlePrint} style={{ padding: '12px 24px', background: '#334155', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
            PRINT & REVIEW
          </button>
          <button className="btn" onClick={handleSave} style={{ padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
            SIMPAN
          </button>
        </div>

      </div>
    </div>
  );
};

export default STT;
