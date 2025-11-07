import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X, Search, DollarSign, TrendingUp, Plus, Edit2, Trash2, Eye, RefreshCw, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ adminToken, adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboardStats();
    else if (activeTab === 'hotels') fetchHotels();
    else if (activeTab === 'bookings') fetchBookings();
    else if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to load dashboard stats');
      }
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/hotels`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setHotels(data.data || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load hotels');
      }
    } catch (err) {
      setError('Failed to load hotels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load bookings');
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/hotels/${hotelId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        setHotels(hotels.filter((h) => h._id !== hotelId));
        alert('Hotel deleted successfully');
      } else {
        alert('Failed to delete hotel');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting hotel');
    }
  };

  const revenueData = stats?.recentBookings?.slice(0, 7).reverse().map((booking, idx) => ({
    name: `Day ${idx + 1}`, revenue: booking.totalPrice || 0
  })) || [];

  const hotelDistributionData = stats?.topHotels?.slice(0, 5).map((h) => ({
    name: h.name?.substring(0, 20) || 'Unknown', value: h.bookingCount || 0
  })) || [];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'hotels', icon: Hotel, label: 'Hotels' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'users', icon: Users, label: 'Users' }
  ];

  const statCards = [
    { title: 'Total Hotels', value: stats?.totalHotels || 0, color: 'from-blue-500 to-blue-600', icon: Hotel },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, color: 'from-purple-500 to-purple-600', icon: Calendar },
    { title: 'Total Users', value: stats?.totalUsers || 0, color: 'from-green-500 to-green-600', icon: Users },
    { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, color: 'from-amber-500 to-amber-600', icon: DollarSign }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-purple-700 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">Hotel Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-blue-600' : 'hover:bg-white/10'}`}>
              <tab.icon size={20} />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'hotels' && 'Hotels Management'}
              {activeTab === 'bookings' && 'Bookings Management'}
              {activeTab === 'users' && 'Users Management'}
            </h2>
            <p className="text-gray-600">Welcome back, {adminUser?.username || 'Admin'}</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform`}>
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon size={32} />
                      <TrendingUp size={20} className="opacity-75" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                    <p className="opacity-90">{stat.title}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="text-blue-600" />
                    Revenue Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <PieChartIcon className="text-purple-600" />
                    Top Hotels
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={hotelDistributionData} cx="50%" cy="50%" labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100} dataKey="value">
                        {hotelDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <div className="flex gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input type="text" placeholder="Search hotels..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  <Plus size={20} /> Add Hotel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={hotel.images?.[0] || '/placeholder-hotel.jpg'} alt={hotel.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{hotel.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-600 font-bold text-lg">${hotel.pricePerNight}</span>
                        <span className="text-gray-500 text-sm">/ night</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100">
                          <Eye size={16} /> View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100">
                          <Edit2 size={16} /> Edit
                        </button>
                        <button onClick={() => handleDeleteHotel(hotel._id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHotels.length === 0 && (
                <div className="text-center py-12">
                  <Hotel className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No hotels found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Guest</th>
                    <th className="text-left py-3 px-4">Hotel</th>
                    <th className="text-left py-3 px-4">Check-in</th>
                    <th className="text-left py-3 px-4">Check-out</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{booking._id.slice(-8)}</td>
                      <td className="py-3 px-4">{booking.userId?.email || 'N/A'}</td>
                      <td className="py-3 px-4">{booking.hotelId?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">${booking.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No bookings found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.name || 'N/A'}</td>
                      <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{user.bookingCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No users found</p>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
