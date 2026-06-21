import React, { useState } from 'react';

const CustomerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'PT Maju Bersama',
    customerId: 'CUST-0001',
    email: 'contact@majubersama.com',
    phone: '+62 812 3456 7890',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan, 12190'
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-headline-lg text-primary">Informasi Data Customer</h2>
          <p className="font-body-md text-on-surface-variant mt-1">Kelola informasi profil dan kontak perusahaan Anda.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded font-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
            Edit Profil
          </button>
        )}
      </div>

      <div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-sm">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline-variant">
              <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center font-display text-2xl">
                {editForm.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-label-md text-on-surface-variant mb-1">CUSTOMER ID</div>
                <div className="font-mono-data text-primary font-bold">{profile.customerId}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Nama Perusahaan / PIC</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">Email</label>
                <input 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-md text-on-surface-variant mb-2">Nomor Telepon</label>
                <input 
                  type="text" 
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-md text-on-surface-variant mb-2">Alamat Lengkap</label>
                <textarea 
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-outline-variant">
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setEditForm({...profile}); }}
                className="px-6 py-2 rounded font-label-md text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 rounded font-label-md bg-primary text-on-primary hover:bg-primary-container transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline-variant">
              <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center font-display text-2xl">
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-headline-md text-on-surface font-bold">{profile.name}</h3>
                <div className="font-mono-data text-on-surface-variant mt-1">{profile.customerId}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="font-label-md text-on-surface-variant mb-1">Email</div>
                <div className="font-body-md text-on-surface font-medium">{profile.email}</div>
              </div>
              <div>
                <div className="font-label-md text-on-surface-variant mb-1">Nomor Telepon</div>
                <div className="font-body-md text-on-surface font-medium">{profile.phone}</div>
              </div>
              <div className="md:col-span-2">
                <div className="font-label-md text-on-surface-variant mb-1">Alamat Perusahaan</div>
                <div className="font-body-md text-on-surface font-medium">{profile.address}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
