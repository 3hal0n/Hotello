import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminProfile from './AdminProfile';
import AdminTables from './AdminTables';

export default function AdminLayout() {
  const [page, setPage] = useState('dashboard');

  function renderPage() {
    switch (page) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'profile':
        return <AdminProfile />;
      case 'tables':
        return <AdminTables />;
      default:
        return <AdminDashboard />;
    }
  }

  return (
    <div>
      {/* Sidebar navigation */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col">
        <div className="h-20 flex items-center px-8 py-6">
          <img src="/admin-logo.png" alt="Admin Logo" className="h-8 mr-2" />
          <span className="font-semibold text-lg text-slate-700">Hotel Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="mt-4">
            <li><button onClick={() => setPage('dashboard')} className={`block w-full text-left px-6 py-3 rounded-lg mb-2 ${page==='dashboard' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700 hover:bg-gray-100'}`}>Dashboard</button></li>
            <li><button onClick={() => setPage('tables')} className={`block w-full text-left px-6 py-3 rounded-lg mb-2 ${page==='tables' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700 hover:bg-gray-100'}`}>Tables</button></li>
            <li><button onClick={() => setPage('profile')} className={`block w-full text-left px-6 py-3 rounded-lg mb-2 ${page==='profile' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700 hover:bg-gray-100'}`}>Profile</button></li>
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <main className="ml-64">
        {renderPage()}
      </main>
    </div>
  );
}
