import React from 'react';

const TopBar = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="topbar">
      <div className="search-bar">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Cari pengiriman, pengemudi, atau nomor resi..."
          value={searchTerm || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" title="Notifikasi">
          <span className="material-symbols-outlined">notifications</span>
          <span className="dot"></span>
        </button>
        <button className="icon-btn" title="Bantuan">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
