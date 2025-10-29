import React from 'react';
import './Toast.css';

export default function Toast({ type = 'info', message, icon, onClose }) {
  return (
    <div className={`toast toast-${type}`}> 
      {icon && <span className="toast-icon">{icon}</span>}
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{marginLeft: '1rem', background: 'none', border: 'none', color: 'inherit', fontWeight: 'bold', cursor: 'pointer'}}>×</button>
      )}
    </div>
  );
}
