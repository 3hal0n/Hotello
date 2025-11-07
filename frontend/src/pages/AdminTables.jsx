import React from 'react';

export default function AdminTables() {
  return (
    <div className="bg-gray-50 min-h-screen text-slate-500">
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 flex flex-col">
        <div className="h-20 flex items-center px-8 py-6">
          <img src="/admin-logo.png" alt="Admin Logo" className="h-8 mr-2" />
          <span className="font-semibold text-lg text-slate-700">Hotel Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="mt-4">
            <li><a href="#" className="block px-6 py-3 text-slate-700 hover:bg-gray-100 rounded-lg mb-2">Dashboard</a></li>
            <li><a href="#" className="block px-6 py-3 text-blue-600 font-bold bg-blue-50 rounded-lg mb-2">Tables</a></li>
            <li><a href="#" className="block px-6 py-3 text-slate-700 hover:bg-gray-100 rounded-lg mb-2">Hotels</a></li>
            <li><a href="#" className="block px-6 py-3 text-slate-700 hover:bg-gray-100 rounded-lg mb-2">Profile</a></li>
          </ul>
        </nav>
      </aside>
      <main className="ml-64 p-8">
        <nav className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-700">Tables</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Logout</button>
        </nav>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Bookings Table</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400">
                <th className="py-2">ID</th>
                <th className="py-2">User</th>
                <th className="py-2">Hotel</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">B001</td>
                <td className="py-2">john_doe</td>
                <td className="py-2">Luxury Beach Resort</td>
                <td className="py-2">2025-10-28</td>
                <td className="py-2">$250</td>
              </tr>
              <tr>
                <td className="py-2">B002</td>
                <td className="py-2">jane_smith</td>
                <td className="py-2">Mountain View Hotel</td>
                <td className="py-2">2025-10-28</td>
                <td className="py-2">$180</td>
              </tr>
              <tr>
                <td className="py-2">B003</td>
                <td className="py-2">alex_lee</td>
                <td className="py-2">City Center Inn</td>
                <td className="py-2">2025-10-27</td>
                <td className="py-2">$120</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
