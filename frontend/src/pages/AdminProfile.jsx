import React from 'react';
import '../admin-dashboard-global.css';

export default function AdminProfile() {
  return (
    <div className="bg-gray-50 min-h-screen text-slate-500">
      {/* Sidebar (reuse from dashboard) */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col">
        <div className="h-20 flex items-center px-8 py-6">
          <img src="/admin-logo.png" alt="Admin Logo" className="h-8 mr-2" />
          <span className="font-semibold text-lg text-slate-700">Hotel Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="mt-4">
            <li><a href="#" className="block px-6 py-3 text-slate-700 hover:bg-gray-100 rounded-lg mb-2">Dashboard</a></li>
            <li><a href="#" className="block px-6 py-3 text-slate-700 hover:bg-gray-100 rounded-lg mb-2">Bookings</a></li>
            <li><a href="#" className="block px-6 py-3 text-slate-700 hover:bg-gray-100 rounded-lg mb-2">Hotels</a></li>
            <li><a href="#" className="block px-6 py-3 text-blue-600 font-bold bg-blue-50 rounded-lg mb-2">Profile</a></li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="ml-64 p-8">
        <nav className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-700">Profile</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Logout</button>
        </nav>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Admin Profile</h2>
          <div className="flex items-center mb-6">
            <img src="/admin-avatar.png" alt="Admin" className="w-20 h-20 rounded-full mr-6" />
            <div>
              <div className="text-lg font-semibold text-slate-700">Admin User</div>
              <div className="text-slate-400">admin@hotel.com</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-500 mb-2">Full Name</label>
              <input className="w-full border rounded px-4 py-2" value="Admin User" readOnly />
            </div>
            <div>
              <label className="block text-slate-500 mb-2">Email</label>
              <input className="w-full border rounded px-4 py-2" value="admin@hotel.com" readOnly />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
