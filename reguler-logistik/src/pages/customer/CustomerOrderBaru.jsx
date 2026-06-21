import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import RegionPicker from '../../components/RegionPicker';

const generateResi = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'PLN-';
  for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const CustomerOrderBaru = () => {
  const { addShipment, settings } = useContext(AppContext);

  const [resi] = useState(generateResi());
  const [saved, setSaved] = useState(false);

  // Pengirim
  const [pengirim, setPengirim] = useState({ 
    name: settings.companyName || 'PT Maju Bersama', 
    phone: '', company: '', 
    provinsi: '', kota: '', kecamatan: '', kodePos: '', alamat: '' 
  });
  // Penerima
  const [penerima, setPenerima] = useState({ 
    name: '', 
    phone: '', company: '', 
    provinsi: '', kota: '', kecamatan: '', kodePos: '', alamat: '' 
  });
  // Barang
  const [barang, setBarang] = useState({ nama: '', panjang: '', lebar: '', tinggi: '' });
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

  const AddressForm = ({ data, setData, title, number, nameLabel }) => (
    <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{number}</div>
        <span className="font-label-md" style={{ letterSpacing: '0.05em', fontSize: '13px' }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group mb-4">
            <label className="form-label block font-label-md text-on-surface-variant mb-2">{nameLabel || 'PENGIRIM / PIC'}</label>
            <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="" />
          </div>
          <div className="form-group mb-4">
            <label className="form-label block font-label-md text-on-surface-variant mb-2">TELEPON</label>
            <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="" />
          </div>
        </div>
        <div className="form-group mb-4">
          <label className="form-label block font-label-md text-on-surface-variant mb-2">PERUSAHAAN (OPSIONAL)</label>
          <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.company} onChange={(e) => setData({ ...data, company: e.target.value })} placeholder="" />
        </div>
        
        <div className="form-group mb-4" style={{ background: 'var(--surface-container-low)', padding: '16px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
          <label className="form-label block font-label-md" style={{ color: 'var(--primary)', marginBottom: '12px' }}>CARI KECAMATAN / KELURAHAN (AUTO FILL)</label>
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
          <div className="form-group mb-4">
            <label className="form-label block font-label-md text-on-surface-variant mb-2">PROVINSI</label>
            <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.provinsi} onChange={(e) => setData({ ...data, provinsi: e.target.value })} placeholder="" />
          </div>
          <div className="form-group mb-4">
            <label className="form-label block font-label-md text-on-surface-variant mb-2">KOTA</label>
            <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.kota} onChange={(e) => setData({ ...data, kota: e.target.value })} placeholder="" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group mb-4">
            <label className="form-label block font-label-md text-on-surface-variant mb-2">KECAMATAN</label>
            <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.kecamatan} onChange={(e) => setData({ ...data, kecamatan: e.target.value })} placeholder="" />
          </div>
          <div className="form-group mb-4">
            <label className="form-label block font-label-md text-on-surface-variant mb-2">KODE POS</label>
            <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.kodePos} onChange={(e) => setData({ ...data, kodePos: e.target.value })} placeholder="" />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label block font-label-md text-on-surface-variant mb-2">ALAMAT LENGKAP</label>
          <textarea className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={data.alamat} onChange={(e) => setData({ ...data, alamat: e.target.value })} rows="3" style={{ resize: 'vertical' }}></textarea>
        </div>
      </div>
    </div>
  );

  const LayananRow = ({ label, checked, fee, onToggle, onFeeChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--outline-variant)' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <input type="checkbox" checked={checked} onChange={onToggle} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
        <span className="font-body-md text-on-surface">{label}</span>
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span className="font-body-md" style={{ color: 'var(--on-surface-variant)' }}>Rp</span>
        <input
          type="number"
          className="form-control px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary outline-none"
          style={{ width: '100px', textAlign: 'right', fontSize: '13px' }}
          value={fee}
          onChange={(e) => onFeeChange(Number(e.target.value))}
          disabled={!checked}
        />
      </div>
    </div>
  );

  return (
    <div className="animate-slide-up w-full max-w-[1200px]">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 className="font-headline-lg text-primary">Order Baru</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Buat pesanan pengiriman baru secara mandiri.</p>
        </div>
        <div className="card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface)', border: '1px solid var(--outline-variant)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Barcode-like lines */}
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: i % 2 === 0 ? '40px' : '30px', height: '3px', background: 'var(--primary)', borderRadius: '1px' }}></div>
            ))}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="font-label-md" style={{ color: 'var(--secondary)', fontSize: '10px' }}>NO. RESI OTOMATIS</p>
            <p className="font-mono-data" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>{resi}</p>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #bbf7d0' }} className="animate-slide-up">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
          Order berhasil dibuat! No. Resi: {resi}
        </div>
      )}

      {/* Main 3-Column Grid (Responsive) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Pengirim + Penerima */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AddressForm data={pengirim} setData={setPengirim} title="Informasi Pengirim" number="1" />
          <AddressForm data={penerima} setData={setPenerima} title="Informasi Penerima" number="2" />
        </div>

        {/* Column 2: Barang + Layanan Tambahan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Informasi Barang */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Informasi Barang</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="form-group mb-4">
                <label className="form-label block font-label-md text-on-surface-variant mb-2">NAMA BARANG</label>
                <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" value={barang.nama} onChange={(e) => setBarang({ ...barang, nama: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label block font-label-md text-on-surface-variant mb-2">DIMENSI (CM)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" style={{ textAlign: 'center' }} placeholder="P" value={barang.panjang} onChange={(e) => setBarang({ ...barang, panjang: e.target.value })} />
                  <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>x</span>
                  <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" style={{ textAlign: 'center' }} placeholder="L" value={barang.lebar} onChange={(e) => setBarang({ ...barang, lebar: e.target.value })} />
                  <span style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>x</span>
                  <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" style={{ textAlign: 'center' }} placeholder="T" value={barang.tinggi} onChange={(e) => setBarang({ ...barang, tinggi: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Layanan Tambahan */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Kalkulasi Biaya */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
            <div style={{ background: 'var(--primary)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>5</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Kalkulasi Biaya</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-body-md text-on-surface">Jumlah Paket:</span>
                <input type="number" className="form-control px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary outline-none" style={{ width: '100px', textAlign: 'right' }} value={kalkulasi.jumlahPaket} onChange={(e) => setKalkulasi({ ...kalkulasi, jumlahPaket: Number(e.target.value) })} min="0" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-body-md text-on-surface">Berat (Kg):</span>
                <input type="number" step="0.1" className="form-control px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary outline-none" style={{ width: '100px', textAlign: 'right' }} value={kalkulasi.berat} onChange={(e) => setKalkulasi({ ...kalkulasi, berat: Number(e.target.value) })} min="0" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--outline-variant)' }}>
                <span className="font-body-md text-on-surface">Ongkir Dasar:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input type="number" className="form-control px-3 py-1 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary outline-none" style={{ width: '120px', textAlign: 'right' }} value={kalkulasi.ongkirDasar} onChange={(e) => setKalkulasi({ ...kalkulasi, ongkirDasar: Number(e.target.value) })} min="0" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--on-surface)' }}>TOTAL BIAYA:</span>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Rp {totalBiaya.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
            <div style={{ background: 'var(--secondary-container)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>6</div>
              <span className="font-label-md" style={{ fontSize: '13px' }}>Metode Pembayaran</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="metode" value="Tunai" checked={pembayaran.metode === 'Tunai'} onChange={() => setPembayaran({ ...pembayaran, metode: 'Tunai' })} style={{ accentColor: 'var(--primary)' }} />
                  <span className="font-body-md text-on-surface" style={{ fontWeight: 500 }}>Tunai</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="metode" value="Bulanan" checked={pembayaran.metode === 'Bulanan'} onChange={() => setPembayaran({ ...pembayaran, metode: 'Bulanan' })} style={{ accentColor: 'var(--primary)' }} />
                  <span className="font-body-md text-on-surface" style={{ fontWeight: 500 }}>Bulanan</span>
                </label>
              </div>

              <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={pembayaran.dfod} onChange={() => setPembayaran({ ...pembayaran, dfod: !pembayaran.dfod })} style={{ accentColor: 'var(--primary)' }} />
                    <span className="font-body-md text-on-surface">DFOD</span>
                  </label>
                  <input className="form-control px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary outline-none" style={{ width: '120px', textAlign: 'right' }} placeholder="Rp Biaya DF" value={pembayaran.dfodFee} onChange={(e) => setPembayaran({ ...pembayaran, dfodFee: e.target.value })} disabled={!pembayaran.dfod} />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={pembayaran.resiKembali} onChange={() => setPembayaran({ ...pembayaran, resiKembali: !pembayaran.resiKembali })} style={{ accentColor: 'var(--primary)' }} />
                  <span className="font-body-md text-on-surface">Layanan Resi Kembali</span>
                </label>

                {pembayaran.resiKembali && (
                  <input className="form-control w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary outline-none" placeholder="Masukkan Nomor Resi Kembali..." value={pembayaran.nomorResiKembali} onChange={(e) => setPembayaran({ ...pembayaran, nomorResiKembali: e.target.value })} />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-6 py-3 rounded-lg font-label-md transition-colors w-full flex items-center justify-center gap-2 shadow-sm" onClick={handleSave}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
              KIRIM PERMINTAAN ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderBaru;
