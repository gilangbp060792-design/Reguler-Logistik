import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Initialize from localStorage or use defaults
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('umkm_products');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Kopi Susu Aren', price: 20000, cogs: 8000, stock: 50, category: 'Minuman' },
      { id: '2', name: 'Roti Bakar Coklat', price: 15000, cogs: 5000, stock: 30, category: 'Makanan' },
      { id: '3', name: 'Kentang Goreng', price: 18000, cogs: 6000, stock: 40, category: 'Snack' }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('umkm_transactions');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [cart, setCart] = useState([]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('umkm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('umkm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Inventory Actions
  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now().toString() }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Cart Actions
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => item.id === id ? { ...item, qty } : item));
  };

  const clearCart = () => setCart([]);

  // Checkout Action
  const checkout = (paymentAmount) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalCogs = cart.reduce((sum, item) => sum + ((item.cogs || 0) * item.qty), 0);
    
    if (cart.length === 0) return { success: false, message: 'Keranjang kosong' };
    if (paymentAmount < total) return { success: false, message: 'Uang pembayaran kurang' };

    const transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart],
      total,
      totalCogs,
      profit: total - totalCogs,
      paymentAmount,
      change: paymentAmount - total
    };

    // Update stock
    const newProducts = products.map(p => {
      const cartItem = cart.find(item => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.qty };
      }
      return p;
    });

    setProducts(newProducts);
    setTransactions([transaction, ...transactions]);
    clearCart();

    return { success: true, transaction };
  };

  return (
    <StoreContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      checkout,
      transactions
    }}>
      {children}
    </StoreContext.Provider>
  );
};
