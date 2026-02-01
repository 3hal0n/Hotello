import React from 'react';
import AdminDashboard from './AdminDashboard';
import AdminProfile from './AdminProfile';
import AdminTables from './AdminTables';

export default function AdminLayout({ adminToken, adminUser, onLogout }) {
  // AdminDashboard now has its own internal navigation
  // This component just renders the dashboard and passes through props
  return <AdminDashboard adminToken={adminToken} adminUser={adminUser} onLogout={onLogout} />;
}
