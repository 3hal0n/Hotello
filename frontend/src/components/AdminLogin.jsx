import React, { useState } from 'react';
import '../pages/AdminDashboard.css';

const ADMIN_PASSWORD = 'Admin123';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError('');
      onLogin();
    } else {
      setError('Invalid password');
    }
  }

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
