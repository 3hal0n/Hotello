import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminProfile from './AdminProfile';
import AdminTables from './AdminTables';

export default function AdminLayout() {
  // AdminDashboard now has its own internal navigation
  // This component just renders the dashboard
  return <AdminDashboard />;
}
