import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = { name: '', category: '', price: '', cogs: '', stock: '' };
  const [formData, setFormData] = useState(initialForm);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        category: product.category || '',
        price: product.price,
        cogs: product.cogs || '',
        stock: product.stock
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      cogs: Number(formData.cogs),
      stock: Number(formData.stock)
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    handleCloseModal();
  };

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between mb-4">
        <h1 className="title mb-0">Manajemen Inventaris</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto', border: 'none' }}>
          <table className="table">
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga Jual</th>
                <th>HPP (Modal)</th>
                <th>Stok</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-muted">Belum ada produk di inventaris.</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>{product.category || '-'}</td>
                    <td className="text-success">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="text-warning">Rp {(product.cogs || 0).toLocaleString('id-ID')}</td>
                    <td>
                      <span className={`badge ${product.stock > 10 ? 'badge-success' : 'badge-danger'}`} style={{ color: product.stock <= 10 ? '#f87171' : '', background: product.stock <= 10 ? 'rgba(248, 113, 113, 0.1)' : '' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <div className="flex-center" style={{ gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem' }} onClick={() => handleOpenModal(product)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus ${product.name}?`)) deleteProduct(product.id);
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Sidebar Overlay for Form */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
            <div className="flex-between mb-4">
              <h2 style={{ fontSize: '1.25rem' }}>{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
              <button onClick={handleCloseModal} style={{ background: 'transparent', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nama Produk</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="grid-cols-2 mb-3">
                <div className="form-group mb-0">
                  <label className="form-label">Kategori</label>
                  <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} placeholder="Mkn, Mnm, dll" />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Stok Awal</label>
                  <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
                </div>
              </div>
              <div className="grid-cols-2 mb-4">
                <div className="form-group mb-0">
                  <label className="form-label">HPP (Modal / Item)</label>
                  <input type="number" className="form-control" name="cogs" value={formData.cogs} onChange={handleChange} required min="0" />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Harga Jual</label>
                  <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required min="0" />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="btn btn-primary"><Save size={18} /> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
