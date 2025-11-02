// frontend/src/components/Toggle.jsx
import React from 'react';
import '../styles/Toggle.css';

function Toggle({ value, onChange }) {
  return (
    <div className="toggle-container">
      <div className="toggle-wrapper">
        <button
          className={`toggle-btn ${value === 'FULL' ? 'active' : ''}`}
          onClick={() => onChange('FULL')}
        >
          <span className="toggle-icon">🚫</span>
          <span className="toggle-label">Full Shutdowns</span>
        </button>
        <button
          className={`toggle-btn ${value === 'THROTTLED' ? 'active' : ''}`}
          onClick={() => onChange('THROTTLED')}
        >
          <span className="toggle-icon">⚡</span>
          <span className="toggle-label">Throttled Shutdowns</span>
        </button>
        <button
          className={`toggle-btn ${value === 'ALL' ? 'active' : ''}`}
          onClick={() => onChange('ALL')}
        >
          <span className="toggle-icon">📊</span>
          <span className="toggle-label">All Shutdowns</span>
        </button>
      </div>
      
      <div className="toggle-description">
        {value === 'FULL' && (
          <p>🔴 Viewing complete internet blackouts</p>
        )}
        {value === 'THROTTLED' && (
          <p>🟡 Viewing network throttling (5G→4G, 4G→3G, etc.)</p>
        )}
        {value === 'ALL' && (
          <p>🟢 Viewing all types of internet restrictions</p>
        )}
      </div>
    </div>
  );
}

export default Toggle;