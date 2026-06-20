import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const DriverLayout = () => {
  useEffect(() => {
    // Add required body classes for mobile views
    document.body.classList.add('bg-background', 'text-on-surface');

    // Add inline styles required for driver portal
    const styleBlock = document.createElement('style');
    styleBlock.id = 'driver-styles';
    styleBlock.innerHTML = `
      .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
          text-transform: none;
          letter-spacing: normal;
          word-wrap: normal;
          white-space: nowrap;
          direction: ltr;
      }
      body {
          font-family: 'Inter', sans-serif;
          background-color: #f9f9ff;
          -webkit-tap-highlight-color: transparent;
          min-height: max(884px, 100dvh);
      }
      .progress-gradient {
          background: linear-gradient(90deg, #0052cc 0%, #003d9b 100%);
      }
      .glass-header {
          backdrop-filter: blur(8px);
          background: rgba(249, 249, 255, 0.9);
      }
      .touch-ripple:active {
          transform: scale(0.98);
          transition: transform 0.1s ease;
      }
      .input-focus-ring:focus {
          outline: none;
          border-color: #003d9b !important;
          box-shadow: 0 0 0 2px rgba(0, 61, 155, 0.1);
      }
      .signature-pad {
          touch-action: none;
          cursor: crosshair;
          background-image: linear-gradient(#f1f3ff 1px, transparent 1px);
          background-size: 100% 20px;
      }
      .fade-in {
          animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleBlock);

    return () => {
      // Cleanup on unmount
      document.body.classList.remove('bg-background', 'text-on-surface');
      if (styleBlock.parentNode) {
        document.head.removeChild(styleBlock);
      }
    };
  }, []);

  return (
    <div className="font-body-md min-h-screen">
      <Outlet />
    </div>
  );
};

export default DriverLayout;
