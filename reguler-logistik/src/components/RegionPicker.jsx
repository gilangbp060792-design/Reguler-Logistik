import React, { useState, useEffect, useRef } from 'react';

const RegionPicker = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Click outside to close dropdown
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 3) {
        setLoading(true);
        fetch(`https://kodepos.vercel.app/search?q=${query}`)
          .then(res => res.json())
          .then(data => {
            if (data.code === 'OK' && data.data) {
              setResults(data.data);
            } else {
              setResults([]);
            }
            setLoading(false);
            setShowDropdown(true);
          })
          .catch(err => {
            console.error(err);
            setLoading(false);
          });
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(`Kel. ${item.village}, Kec. ${item.district}, ${item.regency}`);
    setShowDropdown(false);
    if (onSelect) {
      onSelect({
        provinsi: item.province,
        kota: item.regency,
        kecamatan: item.district,
        kelurahan: item.village,
        kodePos: item.code
      });
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', borderRadius: '12px', padding: '0 16px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--outline)', fontSize: '20px' }}>search</span>
        <input
          type="text"
          className="form-control"
          style={{ border: 'none', background: 'transparent', padding: '12px 8px', boxShadow: 'none' }}
          placeholder="Ketik Kecamatan atau Kelurahan..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
        />
        {loading && <span className="material-symbols-outlined" style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }}>sync</span>}
      </div>

      {showDropdown && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, 
          background: 'white', border: '1px solid var(--outline-variant)', 
          borderRadius: '12px', marginTop: '4px', maxHeight: '300px', 
          overflowY: 'auto', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          {results.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleSelect(item)}
              style={{
                padding: '12px 16px', borderBottom: index !== results.length - 1 ? '1px solid var(--outline-variant)' : 'none',
                cursor: 'pointer', transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-container)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: '14px' }}>
                Kec. {item.district}, Kel. {item.village}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                {item.regency}, {item.province} • {item.code}
              </div>
            </div>
          ))}
        </div>
      )}
      {showDropdown && query.length >= 3 && results.length === 0 && !loading && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, 
          background: 'white', border: '1px solid var(--outline-variant)', 
          borderRadius: '12px', marginTop: '4px', padding: '16px', 
          textAlign: 'center', color: 'var(--on-surface-variant)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          Tidak ditemukan hasil untuk "{query}"
        </div>
      )}
    </div>
  );
};

export default RegionPicker;
