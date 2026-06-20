import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Search, ShoppingBag, ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

const Kasir = () => {
  const { products, cart, addToCart, removeFromCart, updateCartQty, clearCart, checkout } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    const amount = parseInt(paymentAmount);
    if (isNaN(amount) || amount < totalCart) {
      alert('Jumlah pembayaran tidak valid atau kurang dari total belanja.');
      return;
    }
    
    const result = checkout(amount);
    if (result.success) {
      alert(`Transaksi Berhasil! \nKembalian: Rp ${(result.transaction.change).toLocaleString('id-ID')}`);
      setPaymentAmount('');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', height: '100%' }}>
      
      {/* Product Section */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h1 className="title">Kasir (POS)</h1>
        
        <div className="glass-card mb-4" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search size={20} className="text-muted" />
          <input 
            type="text" 
            placeholder="Cari produk..." 
            className="form-control"
            style={{ border: 'none', background: 'transparent', padding: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid-cols-3" style={{ overflowY: 'auto', paddingRight: '0.5rem', alignContent: 'start' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }} onClick={() => addToCart(product)}>
              <div style={{ height: '120px', background: 'var(--bg-glass)', borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={40} className="text-muted" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                <div className="flex-between">
                  <span className="text-success font-weight-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                  <span className="badge badge-success">Stok: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              Produk tidak ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', height: '100%', overflow: 'hidden' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingBag /> Keranjang Belanja
        </h2>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p>Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex-between">
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--accent-danger)', background: 'transparent' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex-between">
                  <span className="text-muted text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--border-radius-sm)' }}>
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={{ background: 'transparent', color: 'white' }}><Minus size={14} /></button>
                    <span style={{ width: '20px', textAlign: 'center', fontSize: '0.875rem' }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ background: 'transparent', color: 'white' }}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span className="text-success">Rp {totalCart.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="form-group mb-0">
              <label className="form-label">Jumlah Pembayaran (Rp)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Masukkan nominal uang" 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline w-full" onClick={clearCart}>Batal</button>
              <button className="btn btn-primary w-full" onClick={handleCheckout}>
                <CreditCard size={18} /> Bayar
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Kasir;
