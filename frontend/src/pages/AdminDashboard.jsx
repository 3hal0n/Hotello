import React, { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import { LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X, Search, DollarSign, TrendingUp, Plus, Edit2, Trash2, Eye, RefreshCw, BarChart3, PieChart as PieChartIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ adminToken, adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    name: '',
    description: '',
    location: '',
    pricePerNight: '',
    amenities: '',
    policies: '',
    rating: 4.5,
    images: []
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Detect mobile breakpoint to change sidebar behaviour
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // collapse sidebar by default on mobile
      setSidebarOpen(!mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showToast = (type, message, icon) => {
    setToast({ type, message, icon });
  };

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  useEffect(() => {
    if (!adminToken) {
      console.error('No admin token available');
      return;
    }
    if (activeTab === 'dashboard') fetchDashboardStats();
    else if (activeTab === 'hotels') fetchHotels();
    else if (activeTab === 'bookings') fetchBookings();
    else if (activeTab === 'users') fetchUsers();
  }, [activeTab, adminToken]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      console.log('Dashboard stats response:', data);
      if (data.success) {
        console.log('Stats data:', data.data);
        console.log('Revenue:', data.data.totalRevenue);
        console.log('Recent bookings:', data.data.recentBookings);
        console.log('Top hotels:', data.data.topHotels);
        setStats(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to load dashboard stats');
      }
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error('Stats fetch error:', err);
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
      console.log('Bookings response:', data);
      if (data.success) {
        console.log('First booking userDetails:', data.data[0]?.userDetails);
        setBookings(data.data || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load bookings');
      }
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Bookings fetch error:', err);
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
      console.log('Users response:', data);
      if (data.success) {
        console.log('First user with booking count:', data.data[0]);
        setUsers(data.data || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Users fetch error:', err);
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
        showToast('success', 'Hotel deleted successfully', <CheckCircle />);
      } else {
        showToast('error', 'Failed to delete hotel', <XCircle />);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error deleting hotel', <XCircle />);
    }
  };

  const openAddHotel = () => {
    setEditingHotel(null);
    setHotelForm({
      name: '',
      description: '',
      location: '',
      pricePerNight: '',
      amenities: '',
      policies: '',
      rating: 4.5,
      images: []
    });
    setShowHotelModal(true);
  };

  const openEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setHotelForm({
      name: hotel.name || '',
      description: hotel.description || '',
      location: hotel.location || '',
      pricePerNight: hotel.pricePerNight || '',
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(', ') : '',
      policies: hotel.policies || '',
      rating: hotel.rating || 4.5,
      images: hotel.images || []
    });
    setShowHotelModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    
    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ url: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    )
      .then(newImages => {
        setHotelForm({
          ...hotelForm,
          images: [...hotelForm.images, ...newImages]
        });
        setUploadingImage(false);
      })
      .catch(err => {
        console.error('Error uploading images:', err);
        showToast('error', 'Failed to upload images', <XCircle />);
        setUploadingImage(false);
      });
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      setHotelForm({
        ...hotelForm,
        images: [...hotelForm.images, { url: url.trim() }]
      });
    }
  };

  const removeImage = (index) => {
    setHotelForm({
      ...hotelForm,
      images: hotelForm.images.filter((_, i) => i !== index)
    });
  };

  const handleSaveHotel = async () => {
    try {
      const amenitiesArray = hotelForm.amenities.split(',').map(a => a.trim()).filter(a => a);
      const hotelData = {
        name: hotelForm.name,
        description: hotelForm.description,
        location: hotelForm.location,
        pricePerNight: Number(hotelForm.pricePerNight),
        amenities: amenitiesArray,
        policies: hotelForm.policies,
        rating: Number(hotelForm.rating),
        images: hotelForm.images || [],
        ownerId: adminUser?.id || '507f1f77bcf86cd799439011' // Placeholder owner ID
      };
      
      console.log('Saving hotel with images:', hotelData.images.length, 'images');

      const url = editingHotel 
        ? `${API_BASE}/api/admin/hotels/${editingHotel._id}`
        : `${API_BASE}/api/admin/hotels`;
      
      const method = editingHotel ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(hotelData)
      });

      const data = await res.json();

      if (data.success) {
        showToast('success', editingHotel ? 'Hotel updated!' : 'Hotel created!', <CheckCircle />);
        setShowHotelModal(false);
        fetchHotels(); // Refresh list
      } else {
        showToast('error', data.message || 'Failed to save hotel', <XCircle />);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error saving hotel', <XCircle />);
    }
  };

  // Revenue chart data with mock fallback
  let revenueData = stats?.recentBookings?.slice(0, 7).reverse().map((booking, idx) => ({
    name: `Day ${idx + 1}`, revenue: booking.totalAmount || 0
  })) || [];
  
  // If no real data, show mock data
  if (revenueData.length === 0 || revenueData.every(d => d.revenue === 0)) {
    revenueData = [
      { name: 'Mon', revenue: 45000 },
      { name: 'Tue', revenue: 52000 },
      { name: 'Wed', revenue: 61000 },
      { name: 'Thu', revenue: 58000 },
      { name: 'Fri', revenue: 72000 },
      { name: 'Sat', revenue: 85000 },
      { name: 'Sun', revenue: 68000 }
    ];
  }
  
  console.log('Revenue chart data:', revenueData);
  console.log('Stats object:', stats);
  console.log('Total revenue from stats:', stats?.totalRevenue);

  // Hotel distribution data with mock fallback
  let hotelDistributionData = stats?.topHotels?.slice(0, 5).map((h) => ({
    name: h.name?.substring(0, 20) || 'Unknown', value: h.bookingCount || 0
  })) || [];
  
  // If no real data, show mock data
  if (hotelDistributionData.length === 0 || hotelDistributionData.every(h => h.value === 0)) {
    hotelDistributionData = [
      { name: 'Cinnamon Grand', value: 25 },
      { name: 'Shangri-La', value: 20 },
      { name: 'Galle Face Hotel', value: 18 },
      { name: 'Jetwing Lighthouse', value: 15 },
      { name: 'Heritance Kandalama', value: 12 }
    ];
  }
  
  console.log('Hotel distribution data:', hotelDistributionData);
  console.log('Top hotels from stats:', stats?.topHotels);

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
    { title: 'Total Revenue', value: stats?.totalRevenue ? `LKR ${stats.totalRevenue.toLocaleString()}` : 'LKR 0', color: 'from-amber-500 to-amber-600', icon: DollarSign }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {toast && <Toast type={toast.type} message={toast.message} icon={toast.icon} onClose={() => setToast(null)} />}
      {/* Sidebar: behaves as fixed overlay on mobile, persistent on desktop */}
      <aside className={
        `${isMobile ? 'fixed inset-y-0 left-0 z-40 transition-transform' : ''} ` +
        `${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : (sidebarOpen ? 'w-64' : 'w-20')} bg-gradient-to-b from-blue-600 to-purple-700 text-white transition-all duration-300 flex flex-col`
      }>
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

      {/* Mobile overlay when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-30" />
      )}

      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-8">
          {/* Mobile menu button (when sidebar is hidden) */}
          {isMobile && !sidebarOpen && (
            <div className="mb-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white shadow-md">
                <Menu size={20} />
              </button>
            </div>
          )}
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
                  {revenueData.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-400">
                      <p>No revenue data available</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <PieChartIcon className="text-purple-600" />
                    Top Hotels
                  </h3>
                  {hotelDistributionData.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-gray-400">
                      <p>No hotel data available</p>
                    </div>
                  )}
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
                <button onClick={openAddHotel} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  <Plus size={20} /> Add Hotel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={hotel.images?.[0]?.url || hotel.images?.[0] || '/placeholder-hotel.jpg'} alt={hotel.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">{hotel.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-600 font-bold text-lg">LKR {hotel.pricePerNight?.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm">/ night</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            const url = `${window.location.origin}/hotels/${hotel._id}`;
                            window.open(url, '_blank');
                          }}
                          className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button 
                          onClick={() => openEditHotel(hotel)}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100"
                        >
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
                      <td className="py-3 px-4">
                        {booking.userDetails ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.userDetails.name || 'Unknown'}</span>
                            {booking.userDetails.email && (
                              <span className="text-xs text-gray-500">{booking.userDetails.email}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Guest User</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{booking.hotelId?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">LKR {booking.totalAmount?.toLocaleString() || '0'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${booking.status === 'booked' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded ${user.bookingCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {typeof user.bookingCount === 'number' ? user.bookingCount : 0}
                        </span>
                      </td>
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

      {/* Hotel Add/Edit Modal */}
      {showHotelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h3>
              <button onClick={() => setShowHotelModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name *</label>
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hotel name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter hotel description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={hotelForm.location}
                  onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Colombo, Sri Lanka"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Night ($) *</label>
                <input
                  type="number"
                  value={hotelForm.pricePerNight}
                  onChange={(e) => setHotelForm({ ...hotelForm, pricePerNight: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities * (comma-separated)</label>
                <input
                  type="text"
                  value={hotelForm.amenities}
                  onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., WiFi, Pool, Gym, Spa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policies</label>
                <textarea
                  value={hotelForm.policies}
                  onChange={(e) => setHotelForm({ ...hotelForm, policies: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter hotel policies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={hotelForm.rating}
                  onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <div className="space-y-3">
                  {/* Image Preview Grid */}
                  {hotelForm.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {hotelForm.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img.url || img} 
                            alt="Hotel" 
                            className="w-full h-24 object-cover rounded border-2 border-gray-200" 
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Options */}
                  <div className="flex gap-2">
                    <label className="flex-1">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-600 cursor-pointer text-center">
                        {uploadingImage ? '⏳ Uploading...' : '📁 Upload Images'}
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 text-gray-600 hover:text-green-600"
                    >
                      🔗 Add URL
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Upload local images or add image URLs</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t">
              <button
                onClick={() => setShowHotelModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHotel}
                disabled={!hotelForm.name || !hotelForm.description || !hotelForm.location || !hotelForm.pricePerNight || !hotelForm.amenities}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingHotel ? 'Update Hotel' : 'Create Hotel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
