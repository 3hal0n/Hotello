import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X, Search, DollarSign, TrendingUp, Plus, Edit2, Trash2, Eye, RefreshCw } from 'lucide-react';

import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';import {



export default function AdminDashboard({ adminToken, adminUser, onLogout }) {  LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X, Search,import { import { 

  const [activeTab, setActiveTab] = useState('dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(true);  DollarSign, TrendingUp, TrendingDown, Plus, Edit2, Trash2, Eye,

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);  Filter, Download, RefreshCw, BarChart3, PieChart, Activity  LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X, Search,  LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X,

  const [hotels, setHotels] = useState([]);

  const [bookings, setBookings] = useState([]);} from 'lucide-react';

  const [users, setUsers] = useState([]);

  const [error, setError] = useState('');import {  DollarSign, TrendingUp, TrendingDown, Plus, Edit2, Trash2, Eye,  DollarSign, ShoppingCart, Star, Trash2

  const [searchTerm, setSearchTerm] = useState('');

  LineChart, Line, BarChart, Bar, PieChart as RechartPie, Pie, Cell,

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart  Filter, Download, RefreshCw, BarChart3, PieChart, Activity} from 'lucide-react';

  useEffect(() => {

    if (activeTab === 'dashboard') fetchDashboardStats();} from 'recharts';

    else if (activeTab === 'hotels') fetchHotels();

    else if (activeTab === 'bookings') fetchBookings();} from 'lucide-react';

    else if (activeTab === 'users') fetchUsers();

  }, [activeTab]);export default function AdminDashboard({ adminToken, adminUser, onLogout }) {



  const fetchDashboardStats = async () => {  const [activeTab, setActiveTab] = useState('dashboard');import {export default function AdminDashboard({ adminToken, adminUser, onLogout }) {

    try {

      setLoading(true);  const [sidebarOpen, setSidebarOpen] = useState(true);

      const res = await fetch(`${API_BASE}/api/admin/stats`, {

        headers: { Authorization: `Bearer ${adminToken}` }  const [loading, setLoading] = useState(true);  LineChart, Line, BarChart, Bar, PieChart as RechartPie, Pie, Cell,  const [activeTab, setActiveTab] = useState('dashboard');

      });

      const data = await res.json();  const [stats, setStats] = useState(null);

      setStats(data);

      setError('');  const [hotels, setHotels] = useState([]);  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart  const [sidebarOpen, setSidebarOpen] = useState(true);

    } catch (err) {

      setError('Failed to load dashboard stats');  const [bookings, setBookings] = useState([]);

    } finally {

      setLoading(false);  const [users, setUsers] = useState([]);} from 'recharts';  const [loading, setLoading] = useState(true);

    }

  };  const [error, setError] = useState('');



  const fetchHotels = async () => {  const [searchTerm, setSearchTerm] = useState('');  const [stats, setStats] = useState(null);

    try {

      setLoading(true);

      const res = await fetch(`${API_BASE}/api/admin/hotels`, {

        headers: { Authorization: `Bearer ${adminToken}` }  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';export default function AdminDashboard({ adminToken, adminUser, onLogout }) {  const [hotels, setHotels] = useState([]);

      });

      const data = await res.json();

      setHotels(data);

      setError('');  useEffect(() => {  const [activeTab, setActiveTab] = useState('dashboard');  const [bookings, setBookings] = useState([]);

    } catch (err) {

      setError('Failed to load hotels');    if (activeTab === 'dashboard') {

    } finally {

      setLoading(false);      fetchDashboardStats();  const [sidebarOpen, setSidebarOpen] = useState(true);  const [users, setUsers] = useState([]);

    }

  };    } else if (activeTab === 'hotels') {



  const fetchBookings = async () => {      fetchHotels();  const [loading, setLoading] = useState(true);  const [error, setError] = useState('');

    try {

      setLoading(true);    } else if (activeTab === 'bookings') {

      const res = await fetch(`${API_BASE}/api/admin/bookings`, {

        headers: { Authorization: `Bearer ${adminToken}` }      fetchBookings();  const [stats, setStats] = useState(null);

      });

      const data = await res.json();    } else if (activeTab === 'users') {

      setBookings(data);

      setError('');      fetchUsers();  const [hotels, setHotels] = useState([]);  useEffect(() => {

    } catch (err) {

      setError('Failed to load bookings');    }

    } finally {

      setLoading(false);  }, [activeTab]);  const [bookings, setBookings] = useState([]);    if (activeTab === 'dashboard') {

    }

  };



  const fetchUsers = async () => {  const fetchDashboardStats = async () => {  const [users, setUsers] = useState([]);      fetchDashboardStats();

    try {

      setLoading(true);    try {

      const res = await fetch(`${API_BASE}/api/admin/users`, {

        headers: { Authorization: `Bearer ${adminToken}` }      setLoading(true);  const [error, setError] = useState('');    } else if (activeTab === 'hotels') {

      });

      const data = await res.json();      const res = await fetch(`${API_BASE}/api/admin/stats`, {

      setUsers(data);

      setError('');        headers: { Authorization: `Bearer ${adminToken}` }  const [searchTerm, setSearchTerm] = useState('');      fetchHotels();

    } catch (err) {

      setError('Failed to load users');      });

    } finally {

      setLoading(false);      const data = await res.json();  const [selectedHotel, setSelectedHotel] = useState(null);    } else if (activeTab === 'bookings') {

    }

  };      setStats(data);



  const handleDeleteHotel = async (hotelId) => {      setError('');  const [showHotelModal, setShowHotelModal] = useState(false);      fetchBookings();

    if (!confirm('Are you sure you want to delete this hotel?')) return;

    try {    } catch (err) {

      const res = await fetch(`${API_BASE}/api/admin/hotels/${hotelId}`, {

        method: 'DELETE',      setError('Failed to load dashboard stats');    } else if (activeTab === 'users') {

        headers: { Authorization: `Bearer ${adminToken}` }

      });      console.error(err);

      if (res.ok) {

        setHotels(hotels.filter(h => h._id !== hotelId));    } finally {  useEffect(() => {      fetchUsers();

        alert('Hotel deleted successfully');

      }      setLoading(false);

    } catch (err) {

      alert('Error deleting hotel');    }    if (activeTab === 'dashboard') {    }

    }

  };  };



  const revenueData = stats?.recentBookings?.slice(0, 7).reverse().map((booking, idx) => ({      fetchDashboardStats();  }, [activeTab]);

    name: `Day ${idx + 1}`,

    revenue: booking.totalPrice || 0  const fetchHotels = async () => {

  })) || [];

    try {    } else if (activeTab === 'hotels') {

  const hotelDistributionData = stats?.topHotels?.slice(0, 5).map(h => ({

    name: h.name?.substring(0, 20) || 'Unknown',      setLoading(true);

    value: h.bookingCount || 0

  })) || [];      const res = await fetch(`${API_BASE}/api/admin/hotels`, {      fetchHotels();  const authHeaders = () => ({



  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];        headers: { Authorization: `Bearer ${adminToken}` }

  const filteredHotels = hotels.filter(hotel =>

    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||      });    } else if (activeTab === 'bookings') {    'Authorization': `Bearer ${adminToken}`,

    hotel.location?.toLowerCase().includes(searchTerm.toLowerCase())

  );      const data = await res.json();



  return (      setHotels(data);      fetchBookings();    'Content-Type': 'application/json'

    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}      setError('');

      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-purple-700 text-white transition-all duration-300 flex flex-col`}>

        <div className="p-6 flex items-center justify-between">    } catch (err) {    } else if (activeTab === 'users') {  });

          {sidebarOpen && <h1 className="text-2xl font-bold">Hotel Admin</h1>}

          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10">      setError('Failed to load hotels');

            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}

          </button>      console.error(err);      fetchUsers();

        </div>

    } finally {

        <nav className="flex-1 px-4 space-y-2">

          {[      setLoading(false);    }  async function fetchDashboardStats() {

            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },

            { id: 'hotels', icon: Hotel, label: 'Hotels' },    }

            { id: 'bookings', icon: Calendar, label: 'Bookings' },

            { id: 'users', icon: Users, label: 'Users' }  };  }, [activeTab]);    setLoading(true);

          ].map(tab => (

            <button

              key={tab.id}

              onClick={() => setActiveTab(tab.id)}  const fetchBookings = async () => {    try {

              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${

                activeTab === tab.id ? 'bg-white text-blue-600' : 'hover:bg-white/10'    try {

              }`}

            >      setLoading(true);  const authHeaders = () => ({      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/dashboard/stats`, {

              <tab.icon size={20} />

              {sidebarOpen && <span>{tab.label}</span>}      const res = await fetch(`${API_BASE}/api/admin/bookings`, {

            </button>

          ))}        headers: { Authorization: `Bearer ${adminToken}` }    'Authorization': `Bearer ${adminToken}`,        headers: authHeaders()

        </nav>

      });

        <div className="p-4 border-t border-white/20">

          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">      const data = await res.json();    'Content-Type': 'application/json'      });

            <LogOut size={20} />

            {sidebarOpen && <span>Logout</span>}      setBookings(data);

          </button>

        </div>      setError('');  });      const data = await res.json();

      </aside>

    } catch (err) {

      {/* Main Content */}

      <main className="flex-1 overflow-auto">      setError('Failed to load bookings');      if (data.success) {

        <div className="p-8">

          <div className="mb-8">      console.error(err);

            <h2 className="text-3xl font-bold text-gray-800 mb-2">

              {activeTab === 'dashboard' && 'Dashboard Overview'}    } finally {  async function fetchDashboardStats() {        setStats(data.data);

              {activeTab === 'hotels' && 'Hotels Management'}

              {activeTab === 'bookings' && 'Bookings Management'}      setLoading(false);

              {activeTab === 'users' && 'Users Management'}

            </h2>    }    setLoading(true);      } else {

            <p className="text-gray-600">Welcome back, {adminUser?.username || 'Admin'}</p>

          </div>  };



          {error && (    setError('');        setError(data.message);

            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>

          )}  const fetchUsers = async () => {



          {/* Dashboard Tab */}    try {    try {      }

          {activeTab === 'dashboard' && (

            <div className="space-y-6">      setLoading(true);

              {/* Stats Cards */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">      const res = await fetch(`${API_BASE}/api/admin/users`, {      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/dashboard/stats`, {    } catch (err) {

                {[

                  { title: 'Total Hotels', value: stats?.totalHotels || 0, color: 'from-blue-500 to-blue-600', icon: Hotel },        headers: { Authorization: `Bearer ${adminToken}` }

                  { title: 'Total Bookings', value: stats?.totalBookings || 0, color: 'from-purple-500 to-purple-600', icon: Calendar },

                  { title: 'Total Users', value: stats?.totalUsers || 0, color: 'from-green-500 to-green-600', icon: Users },      });        headers: authHeaders()      console.error('Error fetching stats:', err);

                  { title: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, color: 'from-amber-500 to-amber-600', icon: DollarSign }

                ].map((stat, idx) => (      const data = await res.json();

                  <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform`}>

                    <div className="flex items-center justify-between mb-4">      setUsers(data);      });      setError('Failed to load dashboard stats');

                      <stat.icon size={32} />

                      <TrendingUp size={20} className="opacity-75" />      setError('');

                    </div>

                    <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>    } catch (err) {      const data = await res.json();    } finally {

                    <p className="opacity-90">{stat.title}</p>

                  </div>      setError('Failed to load users');

                ))}

              </div>      console.error(err);      if (data.success) {      setLoading(false);



              {/* Charts */}    } finally {

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-white rounded-xl shadow-lg p-6">      setLoading(false);        setStats(data.data);    }

                  <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend</h3>

                  <ResponsiveContainer width="100%" height={300}>    }

                    <AreaChart data={revenueData}>

                      <defs>  };      } else {  }

                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">

                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>

                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>

                        </linearGradient>  const handleDeleteHotel = async (hotelId) => {        setError(data.message || 'Failed to load dashboard stats');

                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />    if (!confirm('Are you sure you want to delete this hotel?')) return;

                      <XAxis dataKey="name" />

                      <YAxis />          }  async function fetchHotels() {

                      <Tooltip />

                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />    try {

                    </AreaChart>

                  </ResponsiveContainer>      const res = await fetch(`${API_BASE}/api/admin/hotels/${hotelId}`, {    } catch (err) {    setLoading(true);

                </div>

        method: 'DELETE',

                <div className="bg-white rounded-xl shadow-lg p-6">

                  <h3 className="text-xl font-bold text-gray-800 mb-4">Top Hotels</h3>        headers: { Authorization: `Bearer ${adminToken}` }      console.error('Error fetching stats:', err);    try {

                  <ResponsiveContainer width="100%" height={300}>

                    <PieChart>      });

                      <Pie

                        data={hotelDistributionData}            setError('Failed to connect to server');      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/hotels`, {

                        cx="50%"

                        cy="50%"      if (res.ok) {

                        labelLine={false}

                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}        setHotels(hotels.filter(h => h._id !== hotelId));    } finally {        headers: authHeaders()

                        outerRadius={100}

                        dataKey="value"        alert('Hotel deleted successfully');

                      >

                        {hotelDistributionData.map((entry, index) => (      } else {      setLoading(false);      });

                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

                        ))}        alert('Failed to delete hotel');

                      </Pie>

                      <Tooltip />      }    }      const data = await res.json();

                    </PieChart>

                  </ResponsiveContainer>    } catch (err) {

                </div>

              </div>      console.error(err);  }      if (data.success) {

            </div>

          )}      alert('Error deleting hotel');



          {/* Hotels Tab */}    }        setHotels(data.data);

          {activeTab === 'hotels' && (

            <div className="space-y-6">  };

              <div className="flex gap-4 items-center justify-between">

                <div className="relative flex-1 max-w-md">  async function fetchHotels() {      }

                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

                  <input  // Prepare chart data

                    type="text"

                    placeholder="Search hotels..."  const revenueData = stats?.recentBookings?.slice(0, 7).reverse().map((booking, idx) => ({    setLoading(true);    } catch (err) {

                    value={searchTerm}

                    onChange={(e) => setSearchTerm(e.target.value)}    name: `Day ${idx + 1}`,

                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"

                  />    revenue: booking.totalPrice || 0    setError('');      console.error('Error fetching hotels:', err);

                </div>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">  })) || [];

                  <Plus size={20} />

                  Add Hotel    try {    } finally {

                </button>

              </div>  const hotelDistributionData = stats?.topHotels?.slice(0, 5).map(h => ({



              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">    name: h.name?.substring(0, 20) || 'Unknown',      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/hotels`, {      setLoading(false);

                {filteredHotels.map((hotel) => (

                  <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">    value: h.bookingCount || 0

                    <img src={hotel.images?.[0] || '/placeholder-hotel.jpg'} alt={hotel.name} className="w-full h-48 object-cover" />

                    <div className="p-4">  })) || [];        headers: authHeaders()    }

                      <h4 className="text-lg font-bold text-gray-800 mb-2">{hotel.name}</h4>

                      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>

                      <div className="flex items-center gap-2 mb-3">

                        <span className="text-blue-600 font-bold text-lg">${hotel.pricePerNight}</span>  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];      });  }

                        <span className="text-gray-500 text-sm">/ night</span>

                      </div>

                      <div className="flex gap-2">

                        <button className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100">  const filteredHotels = hotels.filter(hotel =>      const data = await res.json();

                          <Eye size={16} />

                          View    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||

                        </button>

                        <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100">    hotel.location?.toLowerCase().includes(searchTerm.toLowerCase())      if (data.success) {  async function fetchBookings() {

                          <Edit2 size={16} />

                          Edit  );

                        </button>

                        <button onClick={() => handleDeleteHotel(hotel._id)} className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100">        setHotels(data.data);    setLoading(true);

                          <Trash2 size={16} />

                          Delete  return (

                        </button>

                      </div>    <div className="flex h-screen bg-gray-50">      } else {    try {

                    </div>

                  </div>      {/* Sidebar */}

                ))}

              </div>      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-purple-700 text-white transition-all duration-300 flex flex-col`}>        setError(data.message || 'Failed to load hotels');      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/bookings`, {

            </div>

          )}        <div className="p-6 flex items-center justify-between">



          {/* Bookings Tab */}          {sidebarOpen && <h1 className="text-2xl font-bold">Hotel Admin</h1>}      }        headers: authHeaders()

          {activeTab === 'bookings' && (

            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/10">

              <table className="w-full">

                <thead>            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}    } catch (err) {      });

                  <tr className="border-b-2 border-gray-200">

                    <th className="text-left py-3 px-4">ID</th>          </button>

                    <th className="text-left py-3 px-4">Guest</th>

                    <th className="text-left py-3 px-4">Hotel</th>        </div>      console.error('Error fetching hotels:', err);      const data = await res.json();

                    <th className="text-left py-3 px-4">Check-in</th>

                    <th className="text-left py-3 px-4">Check-out</th>

                    <th className="text-left py-3 px-4">Amount</th>

                    <th className="text-left py-3 px-4">Status</th>        <nav className="flex-1 px-4 space-y-2">      setError('Failed to connect to server');      if (data.success) {

                  </tr>

                </thead>          <button

                <tbody>

                  {bookings.map((booking) => (            onClick={() => setActiveTab('dashboard')}    } finally {        setBookings(data.data);

                    <tr key={booking._id} className="border-b hover:bg-gray-50">

                      <td className="py-3 px-4 font-mono text-sm">{booking._id.slice(-8)}</td>            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${

                      <td className="py-3 px-4">{booking.userId?.email || 'N/A'}</td>

                      <td className="py-3 px-4">{booking.hotelId?.name || 'N/A'}</td>              activeTab === 'dashboard' ? 'bg-white text-blue-600' : 'hover:bg-white/10'      setLoading(false);      }

                      <td className="py-3 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>

                      <td className="py-3 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>            }`}

                      <td className="py-3 px-4 font-semibold text-green-600">${booking.totalPrice}</td>

                      <td className="py-3 px-4">          >    }    } catch (err) {

                        <span className={`px-3 py-1 rounded-full text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>

                          {booking.status}            <LayoutDashboard size={20} />

                        </span>

                      </td>            {sidebarOpen && <span>Dashboard</span>}  }      console.error('Error fetching bookings:', err);

                    </tr>

                  ))}          </button>

                </tbody>

              </table>    } finally {

            </div>

          )}          <button



          {/* Users Tab */}            onClick={() => setActiveTab('hotels')}  async function fetchBookings() {      setLoading(false);

          {activeTab === 'users' && (

            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${

              <table className="w-full">

                <thead>              activeTab === 'hotels' ? 'bg-white text-blue-600' : 'hover:bg-white/10'    setLoading(true);    }

                  <tr className="border-b-2 border-gray-200">

                    <th className="text-left py-3 px-4">Email</th>            }`}

                    <th className="text-left py-3 px-4">Name</th>

                    <th className="text-left py-3 px-4">Joined</th>          >    setError('');  }

                    <th className="text-left py-3 px-4">Bookings</th>

                  </tr>            <Hotel size={20} />

                </thead>

                <tbody>            {sidebarOpen && <span>Hotels</span>}    try {

                  {users.map((user) => (

                    <tr key={user._id} className="border-b hover:bg-gray-50">          </button>

                      <td className="py-3 px-4">{user.email}</td>

                      <td className="py-3 px-4">{user.name || 'N/A'}</td>      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/bookings`, {  async function fetchUsers() {

                      <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>

                      <td className="py-3 px-4">{user.bookingCount || 0}</td>          <button

                    </tr>

                  ))}            onClick={() => setActiveTab('bookings')}        headers: authHeaders()    setLoading(true);

                </tbody>

              </table>            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${

            </div>

          )}              activeTab === 'bookings' ? 'bg-white text-blue-600' : 'hover:bg-white/10'      });    try {



          {loading && (            }`}

            <div className="flex items-center justify-center py-12">

              <RefreshCw className="animate-spin text-blue-600" size={32} />          >      const data = await res.json();      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/users`, {

            </div>

          )}            <Calendar size={20} />

        </div>

      </main>            {sidebarOpen && <span>Bookings</span>}      if (data.success) {        headers: authHeaders()

    </div>

  );          </button>

}

        setBookings(data.data);      });

          <button

            onClick={() => setActiveTab('users')}      } else {      const data = await res.json();

            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${

              activeTab === 'users' ? 'bg-white text-blue-600' : 'hover:bg-white/10'        setError(data.message || 'Failed to load bookings');      if (data.success) {

            }`}

          >      }        setUsers(data.data);

            <Users size={20} />

            {sidebarOpen && <span>Users</span>}    } catch (err) {      }

          </button>

        </nav>      console.error('Error fetching bookings:', err);    } catch (err) {



        <div className="p-4 border-t border-white/20">      setError('Failed to connect to server');      console.error('Error fetching users:', err);

          <button

            onClick={onLogout}    } finally {    } finally {

            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all"

          >      setLoading(false);      setLoading(false);

            <LogOut size={20} />

            {sidebarOpen && <span>Logout</span>}    }    }

          </button>

        </div>  }  }

      </aside>



      {/* Main Content */}

      <main className="flex-1 overflow-auto">  async function fetchUsers() {  async function deleteHotel(id) {

        <div className="p-8">

          {/* Header */}    setLoading(true);    if (!confirm('Are you sure you want to delete this hotel?')) return;

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-gray-800 mb-2">    setError('');    

              {activeTab === 'dashboard' && 'Dashboard Overview'}

              {activeTab === 'hotels' && 'Hotels Management'}    try {    try {

              {activeTab === 'bookings' && 'Bookings Management'}

              {activeTab === 'users' && 'Users Management'}      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/users`, {      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/hotels/${id}`, {

            </h2>

            <p className="text-gray-600">Welcome back, {adminUser?.username || 'Admin'}</p>        headers: authHeaders()        method: 'DELETE',

          </div>

      });        headers: authHeaders()

          {error && (

            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">      const data = await res.json();      });

              {error}

            </div>      if (data.success) {      const data = await res.json();

          )}

        setUsers(data.data);      if (data.success) {

          {/* Dashboard Tab */}

          {activeTab === 'dashboard' && (      } else {        fetchHotels();

            <div className="space-y-6">

              {/* Stats Cards */}        setError(data.message || 'Failed to load users');      } else {

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform animate-fade-in">      }        alert('Failed to delete hotel');

                  <div className="flex items-center justify-between mb-4">

                    <Hotel size={32} />    } catch (err) {      }

                    <TrendingUp size={20} className="opacity-75" />

                  </div>      console.error('Error fetching users:', err);    } catch (err) {

                  <h3 className="text-3xl font-bold mb-1">{stats?.totalHotels || 0}</h3>

                  <p className="text-blue-100">Total Hotels</p>      setError('Failed to connect to server');      console.error('Error deleting hotel:', err);

                </div>

    } finally {      alert('Error deleting hotel');

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.1s' }}>

                  <div className="flex items-center justify-between mb-4">      setLoading(false);    }

                    <Calendar size={32} />

                    <Activity size={20} className="opacity-75" />    }  }

                  </div>

                  <h3 className="text-3xl font-bold mb-1">{stats?.totalBookings || 0}</h3>  }

                  <p className="text-purple-100">Total Bookings</p>

                </div>  const menuItems = [



                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.2s' }}>  async function deleteHotel(id) {    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },

                  <div className="flex items-center justify-between mb-4">

                    <Users size={32} />    if (!confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) return;    { id: 'hotels', label: 'Hotels', icon: Hotel },

                    <TrendingUp size={20} className="opacity-75" />

                  </div>        { id: 'bookings', label: 'Bookings', icon: Calendar },

                  <h3 className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</h3>

                  <p className="text-green-100">Total Users</p>    try {    { id: 'users', label: 'Users', icon: Users },

                </div>

      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/hotels/${id}`, {  ];

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform animate-fade-in" style={{ animationDelay: '0.3s' }}>

                  <div className="flex items-center justify-between mb-4">        method: 'DELETE',

                    <DollarSign size={32} />

                    <BarChart3 size={20} className="opacity-75" />        headers: authHeaders()  return (

                  </div>

                  <h3 className="text-3xl font-bold mb-1">${stats?.totalRevenue?.toLocaleString() || 0}</h3>      });    <div className="flex h-screen bg-gray-100">

                  <p className="text-amber-100">Total Revenue</p>

                </div>      const data = await res.json();      {/* Sidebar */}

              </div>

      if (data.success) {      <aside className="max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent">

              {/* Charts */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        setHotels(hotels.filter(h => h._id !== id));        <div className="h-19.5">

                {/* Revenue Chart */}

                <div className="bg-white rounded-xl shadow-lg p-6">        alert('Hotel deleted successfully');          <a className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" href="#">

                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">

                    <TrendingUp className="text-blue-600" />      } else {            <img src="/admin-logo.png" className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8" alt="main_logo" />

                    Revenue Trend (Last 7 Bookings)

                  </h3>        alert(data.message || 'Failed to delete hotel');            <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">Soft UI Dashboard</span>

                  <ResponsiveContainer width="100%" height={300}>

                    <AreaChart data={revenueData}>      }          </a>

                      <defs>

                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">    } catch (err) {        </div>

                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>

                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>      console.error('Error deleting hotel:', err);        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

                        </linearGradient>

                      </defs>      alert('Error deleting hotel');        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">

                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                      <XAxis dataKey="name" stroke="#6B7280" />    }          <ul className="flex flex-col pl-0 mb-0">

                      <YAxis stroke="#6B7280" />

                      <Tooltip   }            <li className="mt-0.5 w-full">

                        contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}

                      />              <a className="py-2.7 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors" href="#">

                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />

                    </AreaChart>  const menuItems = [                <span className="mr-2"><i className="fas fa-home"></i></span>

                  </ResponsiveContainer>

                </div>    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },                Dashboard



                {/* Hotel Distribution */}    { id: 'hotels', label: 'Hotels', icon: Hotel },              </a>

                <div className="bg-white rounded-xl shadow-lg p-6">

                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">    { id: 'bookings', label: 'Bookings', icon: Calendar },            </li>

                    <PieChart className="text-purple-600" />

                    Top Hotels by Bookings    { id: 'users', label: 'Users', icon: Users },            <li className="mt-0.5 w-full">

                  </h3>

                  <ResponsiveContainer width="100%" height={300}>  ];              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">

                    <RechartPie>

                      <Pie                <span className="mr-2"><i className="fas fa-table"></i></span>

                        data={hotelDistributionData}

                        cx="50%"  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];                Tables

                        cy="50%"

                        labelLine={false}              </a>

                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}

                        outerRadius={100}  // Prepare chart data            </li>

                        fill="#8884d8"

                        dataKey="value"  const revenueData = stats?.recentBookings?.slice(0, 7).reverse().map((booking, index) => ({            <li className="mt-0.5 w-full">

                      >

                        {hotelDistributionData.map((entry, index) => (    name: new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">

                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

                        ))}    revenue: booking.totalPrice,                <span className="mr-2"><i className="fas fa-credit-card"></i></span>

                      </Pie>

                      <Tooltip />    bookings: 1                Billing

                    </RechartPie>

                  </ResponsiveContainer>  })) || [];              </a>

                </div>

              </div>            </li>



              {/* Recent Bookings */}  const hotelDistribution = stats?.topHotels?.map(hotel => ({            <li className="mt-0.5 w-full">

              <div className="bg-white rounded-xl shadow-lg p-6">

                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">    name: hotel.name.substring(0, 20),              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">

                  <Calendar className="text-blue-600" />

                  Recent Bookings    value: hotel.rating * 20,                <span className="mr-2"><i className="fas fa-vr-cardboard"></i></span>

                </h3>

                <div className="overflow-x-auto">    rating: hotel.rating                Virtual Reality

                  <table className="w-full">

                    <thead>  })) || [];              </a>

                      <tr className="border-b-2 border-gray-200">

                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Guest</th>            </li>

                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Hotel</th>

                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Check-in</th>  const filteredHotels = hotels.filter(hotel =>            <li className="mt-0.5 w-full">

                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Check-out</th>

                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">

                        <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>

                      </tr>    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())                <span className="mr-2"><i className="fas fa-globe"></i></span>

                    </thead>

                    <tbody>  );                RTL

                      {stats?.recentBookings?.slice(0, 5).map((booking, idx) => (

                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">              </a>

                          <td className="py-3 px-4">{booking.guestName || 'N/A'}</td>

                          <td className="py-3 px-4">{booking.hotelName || 'N/A'}</td>  return (            </li>

                          <td className="py-3 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>

                          <td className="py-3 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>    <div className="flex h-screen bg-gray-50 overflow-hidden">            <li className="w-full mt-4">

                          <td className="py-3 px-4 font-semibold text-green-600">${booking.totalPrice}</td>

                          <td className="py-3 px-4">      {/* Sidebar */}              <h6 className="pl-6 ml-2 text-xs font-bold leading-tight uppercase opacity-60">Account pages</h6>

                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${

                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col shadow-2xl`}>            </li>

                            }`}>

                              {booking.status}        {/* Sidebar Header */}            <li className="mt-0.5 w-full">

                            </span>

                          </td>        <div className="p-6 flex items-center justify-between border-b border-gray-700/50">              <a className="py-2.7 text-sm shadow-soft-xl ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors" href="#">

                        </tr>

                      ))}          {sidebarOpen && (                <span className="mr-2"><i className="fas fa-user"></i></span>

                    </tbody>

                  </table>            <div>                Profile

                </div>

              </div>              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">              </a>

            </div>

          )}                Hotello            </li>



          {/* Hotels Tab */}              </h1>          </ul>

          {activeTab === 'hotels' && (

            <div className="space-y-6">              <p className="text-xs text-gray-400 mt-1">Admin Portal</p>        </div>

              {/* Search and Actions */}

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">            </div>        <div className="mx-4 mt-8">

                <div className="relative flex-1 max-w-md">

                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />          )}          <div className="relative flex min-w-0 flex-col items-center break-words rounded-2xl border-0 bg-white bg-clip-border shadow-none">

                  <input

                    type="text"          <button             <div className="relative z-20 flex-auto w-full p-4 text-left text-white">

                    placeholder="Search hotels..."

                    value={searchTerm}            onClick={() => setSidebarOpen(!sidebarOpen)}               <div className="flex items-center justify-center w-8 h-8 mb-4 text-center bg-white bg-center rounded-lg icon shadow-soft-2xl">

                    onChange={(e) => setSearchTerm(e.target.value)}

                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"                <i className="fas fa-question text-blue-600"></i>

                  />

                </div>          >              </div>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">

                  <Plus size={20} />            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}              <div className="transition-all duration-200 ease-nav-brand">

                  Add Hotel

                </button>          </button>                <h6 className="mb-0 text-slate-700">Need help?</h6>

              </div>

        </div>                <p className="mt-0 mb-4 font-semibold leading-tight text-xs text-slate-400">Please check our docs</p>

              {/* Hotels Grid */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">                <a className="inline-block px-4 py-2 font-bold text-center uppercase align-middle transition-all bg-blue-600 border border-solid rounded-lg shadow-none cursor-pointer text-white" href="#">DOCUMENTATION</a>

                {filteredHotels.map((hotel) => (

                  <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">        {/* Navigation */}              </div>

                    <img 

                      src={hotel.images?.[0] || '/placeholder-hotel.jpg'}         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">            </div>

                      alt={hotel.name}

                      className="w-full h-48 object-cover"          {menuItems.map((item) => {          </div>

                    />

                    <div className="p-4">            const Icon = item.icon;        </div>

                      <h4 className="text-lg font-bold text-gray-800 mb-2">{hotel.name}</h4>

                      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>            const isActive = activeTab === item.id;      </aside>

                      <div className="flex items-center gap-2 mb-3">

                        <span className="text-blue-600 font-bold text-lg">${hotel.pricePerNight}</span>            return (      {/* Main Content */}

                        <span className="text-gray-500 text-sm">/ night</span>

                      </div>              <button      <main className="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200">

                      <div className="flex gap-2">

                        <button className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">                key={item.id}        {/* Top Navbar */}

                          <Eye size={16} />

                          View                onClick={() => setActiveTab(item.id)}        <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start">

                        </button>

                        <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors">                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${          <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">

                          <Edit2 size={16} />

                          Edit                  isActive            <nav>

                        </button>

                        <button                     ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50 scale-105'              <ol className="flex flex-wrap pt-1 pl-2 pr-4 mr-12 bg-transparent rounded-lg sm:mr-16">

                          onClick={() => handleDeleteHotel(hotel._id)}

                          className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"                    : 'hover:bg-gray-700/50 hover:scale-102'                <li className="text-sm text-slate-700">Pages</li>

                        >

                          <Trash2 size={16} />                }`}                <li className="text-sm text-slate-700">/</li>

                          Delete

                        </button>              >                <li className="text-sm text-slate-700 font-bold">Dashboard</li>

                      </div>

                    </div>                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />              </ol>

                  </div>

                ))}                {sidebarOpen && (              <h6 className="mb-0 font-bold capitalize text-slate-700">Dashboard</h6>

              </div>

                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>            </nav>

              {filteredHotels.length === 0 && (

                <div className="text-center py-12">                    {item.label}            <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">

                  <Hotel className="mx-auto text-gray-400 mb-4" size={48} />

                  <p className="text-gray-600">No hotels found</p>                  </span>              <input className="border rounded px-4 py-2 mr-4" placeholder="Type here..." />

                </div>

              )}                )}              <a className="text-blue-600 font-bold" href="#">Sign In</a>

            </div>

          )}                {isActive && sidebarOpen && (            </div>



          {/* Bookings Tab */}                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>          </div>

          {activeTab === 'bookings' && (

            <div className="bg-white rounded-xl shadow-lg p-6">                )}        </nav>

              <div className="overflow-x-auto">

                <table className="w-full">              </button>        {/* Cards Row 1 */}

                  <thead>

                    <tr className="border-b-2 border-gray-200">            );        <div className="w-full px-6 py-6 mx-auto">

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Booking ID</th>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Guest</th>          })}          <div className="flex flex-wrap -mx-3">

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Hotel</th>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Check-in</th>        </nav>            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Check-out</th>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Guests</th>              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>        {/* User Info & Logout */}                <div className="flex-auto">

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>

                    </tr>        <div className="p-4 border-t border-gray-700/50 space-y-2">                  <div className="flex flex-row -mx-3">

                  </thead>

                  <tbody>          {sidebarOpen && (                    <div className="flex-none w-2/3 max-w-full px-3">

                    {bookings.map((booking) => (

                      <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">            <div className="px-4 py-3 bg-gray-800/50 rounded-xl">                      <div className="text-xs font-bold text-slate-400">Today's Money</div>

                        <td className="py-3 px-4 font-mono text-sm">{booking._id.slice(-8)}</td>

                        <td className="py-3 px-4">{booking.userId?.email || 'N/A'}</td>              <p className="text-sm font-semibold text-white">{adminUser?.username}</p>                      <h5 className="font-bold text-blue-600">$53,000 <span className="text-xs text-green-500 font-semibold">+55%</span></h5>

                        <td className="py-3 px-4">{booking.hotelId?.name || 'N/A'}</td>

                        <td className="py-3 px-4">{new Date(booking.checkIn).toLocaleDateString()}</td>              <p className="text-xs text-gray-400">{adminUser?.email}</p>                    </div>

                        <td className="py-3 px-4">{new Date(booking.checkOut).toLocaleDateString()}</td>

                        <td className="py-3 px-4">{booking.guests || 0}</td>            </div>                    <div className="flex-none w-1/3 max-w-full px-3 text-right">

                        <td className="py-3 px-4 font-semibold text-green-600">${booking.totalPrice}</td>

                        <td className="py-3 px-4">          )}                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-blue-600 to-cyan-400">

                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${

                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :           <button                        <i className="fas fa-wallet text-white text-lg"></i>

                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :

                            'bg-red-100 text-red-700'            onClick={onLogout}                      </div>

                          }`}>

                            {booking.status}            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl transition-all"                    </div>

                          </span>

                        </td>          >                  </div>

                        <td className="py-3 px-4">

                          <button className="text-blue-600 hover:text-blue-800">            <LogOut className="w-5 h-5" />                </div>

                            <Eye size={18} />

                          </button>            {sidebarOpen && <span className="font-medium">Logout</span>}              </div>

                        </td>

                      </tr>          </button>            </div>

                    ))}

                  </tbody>        </div>            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">

                </table>

              </div>      </aside>              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">



              {bookings.length === 0 && (                <div className="flex-auto">

                <div className="text-center py-12">

                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />      {/* Main Content */}                  <div className="flex flex-row -mx-3">

                  <p className="text-gray-600">No bookings found</p>

                </div>      <main className="flex-1 overflow-auto">                    <div className="flex-none w-2/3 max-w-full px-3">

              )}

            </div>        {/* Header */}                      <div className="text-xs font-bold text-slate-400">Today's Users</div>

          )}

        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">                      <h5 className="font-bold text-blue-600">2,300 <span className="text-xs text-green-500 font-semibold">+3%</span></h5>

          {/* Users Tab */}

          {activeTab === 'users' && (          <div className="px-8 py-6">                    </div>

            <div className="bg-white rounded-xl shadow-lg p-6">

              <div className="overflow-x-auto">            <div className="flex items-center justify-between">                    <div className="flex-none w-1/3 max-w-full px-3 text-right">

                <table className="w-full">

                  <thead>              <div>                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">

                    <tr className="border-b-2 border-gray-200">

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">User ID</th>                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">                        <i className="fas fa-users text-white text-lg"></i>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Email</th>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Name</th>                  {menuItems.find(m => m.id === activeTab)?.label}                      </div>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Joined</th>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Bookings</th>                  <span className="text-sm font-normal px-3 py-1 bg-blue-100 text-blue-700 rounded-full">                    </div>

                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>

                    </tr>                    {activeTab === 'hotels' ? hotels.length :                   </div>

                  </thead>

                  <tbody>                     activeTab === 'bookings' ? bookings.length :                </div>

                    {users.map((user) => (

                      <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">                     activeTab === 'users' ? users.length : 'Live'}              </div>

                        <td className="py-3 px-4 font-mono text-sm">{user.clerkId?.slice(-8) || 'N/A'}</td>

                        <td className="py-3 px-4">{user.email}</td>                  </span>            </div>

                        <td className="py-3 px-4">{user.name || 'N/A'}</td>

                        <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>                </h2>            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">

                        <td className="py-3 px-4">{user.bookingCount || 0}</td>

                        <td className="py-3 px-4">                <p className="text-gray-600 mt-1 flex items-center gap-2">              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">

                          <button className="text-blue-600 hover:text-blue-800">

                            <Eye size={18} />                  <Activity className="w-4 h-4" />                <div className="flex-auto">

                          </button>

                        </td>                  Welcome back, {adminUser?.username}                  <div className="flex flex-row -mx-3">

                      </tr>

                    ))}                </p>                    <div className="flex-none w-2/3 max-w-full px-3">

                  </tbody>

                </table>              </div>                      <div className="text-xs font-bold text-slate-400">New Clients</div>

              </div>

              <div className="flex items-center gap-3">                      <h5 className="font-bold text-blue-600">+3,462 <span className="text-xs text-red-500 font-semibold">-2%</span></h5>

              {users.length === 0 && (

                <div className="text-center py-12">                <button                     </div>

                  <Users className="mx-auto text-gray-400 mb-4" size={48} />

                  <p className="text-gray-600">No users found</p>                  onClick={() => {                    <div className="flex-none w-1/3 max-w-full px-3 text-right">

                </div>

              )}                    if (activeTab === 'dashboard') fetchDashboardStats();                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-pink-500 to-orange-400">

            </div>

          )}                    else if (activeTab === 'hotels') fetchHotels();                        <i className="fas fa-user-plus text-white text-lg"></i>



          {loading && (                    else if (activeTab === 'bookings') fetchBookings();                      </div>

            <div className="flex items-center justify-center py-12">

              <RefreshCw className="animate-spin text-blue-600" size={32} />                    else if (activeTab === 'users') fetchUsers();                    </div>

            </div>

          )}                  }}                  </div>

        </div>

      </main>                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors"                </div>

    </div>

  );                  title="Refresh"              </div>

}

                >            </div>

                  <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />            <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">

                </button>              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">

              </div>                <div className="flex-auto">

            </div>                  <div className="flex flex-row -mx-3">

          </div>                    <div className="flex-none w-2/3 max-w-full px-3">

        </header>                      <div className="text-xs font-bold text-slate-400">Sales</div>

                      <h5 className="font-bold text-blue-600">$103,430 <span className="text-xs text-green-500 font-semibold">+5%</span></h5>

        {/* Content Area */}                    </div>

        <div className="p-8">                    <div className="flex-none w-1/3 max-w-full px-3 text-right">

          {error && (                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-orange-500 to-yellow-400">

            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 animate-fade-in">                        <i className="fas fa-shopping-cart text-white text-lg"></i>

              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">                      </div>

                <X className="w-5 h-5 text-red-600" />                    </div>

              </div>                  </div>

              <div className="flex-1">                </div>

                <h4 className="font-semibold text-red-900">Error</h4>              </div>

                <p className="text-sm text-red-700">{error}</p>            </div>

              </div>          </div>

              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">          {/* Cards Row 2: Documentation, Rocket, Work with the rockets */}

                <X className="w-5 h-5" />          <div className="flex flex-wrap -mx-3 mt-6">

              </button>            <div className="w-full max-w-full px-3 mb-6 lg:mb-0 lg:w-7/12 lg:flex-none">

            </div>              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl shadow-soft-xl p-4">

          )}                <div className="flex-auto">

                  <div className="flex flex-row -mx-3">

          {loading ? (                    <div className="flex-none w-2/3 max-w-full px-3">

            <div className="flex flex-col items-center justify-center py-32">                      <div className="text-xs font-bold text-slate-400">Built by developers</div>

              <div className="relative">                      <h5 className="font-bold text-slate-700">Soft UI Dashboard</h5>

                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>                      <p className="text-xs text-slate-400">From colors, cards, typography to complex elements, you will find the full documentation.</p>

                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>                      <a className="text-blue-600 font-bold" href="#">Read More</a>

              </div>                    </div>

              <p className="mt-4 text-gray-600 font-medium">Loading data...</p>                    <div className="flex-none w-1/3 max-w-full px-3 text-right">

            </div>                      <img src="/admin-rocket.png" alt="Rocket" className="w-20 h-20" />

          ) : (                    </div>

            <>                  </div>

              {/* Dashboard View */}                </div>

              {activeTab === 'dashboard' && stats && (              </div>

                <div className="space-y-6 animate-fade-in">            </div>

                  {/* Stats Cards */}            <div className="w-full max-w-full px-3 lg:w-5/12 lg:flex-none">

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl shadow-soft-xl p-4">

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">                <div className="flex-auto">

                      <div className="flex items-center justify-between mb-4">                  <h5 className="font-bold text-slate-700 mb-2">Work with the rockets</h5>

                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">                  <p className="text-xs text-slate-400 mb-2">Wealth creation is an evolutionarily recent positive-sum game. It is all about who takes the opportunity first.</p>

                          <Hotel className="w-6 h-6" />                  <a className="text-blue-600 font-bold" href="#">Read More</a>

                        </div>                </div>

                        <TrendingUp className="w-5 h-5 text-white/60" />              </div>

                      </div>            </div>

                      <h3 className="text-white/80 text-sm font-medium">Total Hotels</h3>          </div>

                      <p className="text-4xl font-bold mt-2">{stats.totalHotels}</p>        </div>

                      <p className="text-white/60 text-sm mt-2">Active properties</p>      </main>

                    </div>    </div>

  );

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">}

                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-white/60" />
                      </div>
                      <h3 className="text-white/80 text-sm font-medium">Total Bookings</h3>
                      <p className="text-4xl font-bold mt-2">{stats.totalBookings}</p>
                      <p className="text-white/60 text-sm mt-2">All time reservations</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Users className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-white/60" />
                      </div>
                      <h3 className="text-white/80 text-sm font-medium">Total Users</h3>
                      <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
                      <p className="text-white/60 text-sm mt-2">Registered customers</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-white/60" />
                      </div>
                      <h3 className="text-white/80 text-sm font-medium">Total Revenue</h3>
                      <p className="text-4xl font-bold mt-2">${stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-white/60 text-sm mt-2">All time earnings</p>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
                          <p className="text-sm text-gray-500 mt-1">Last 7 bookings</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Hotel Distribution Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Top Hotels</h3>
                          <p className="text-sm text-gray-500 mt-1">By performance score</p>
                        </div>
                        <PieChart className="w-8 h-8 text-purple-600" />
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartPie>
                          <Pie
                            data={hotelDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {hotelDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartPie>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Bookings Table */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
                      <p className="text-sm text-gray-500 mt-1">Latest reservations</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hotel</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {stats.recentBookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {booking.hotelId?.name || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {booking.hotelId?.location || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-green-600">${booking.totalPrice}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                  Confirmed
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotels Management */}
              {activeTab === 'hotels' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Search and Actions Bar */}
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search hotels by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Hotel
                    </button>
                  </div>

                  {/* Hotels Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHotels.map((hotel) => (
                      <div key={hotel._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all group">
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                          {hotel.images?.[0] ? (
                            <img 
                              src={hotel.images[0]} 
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Hotel className="w-16 h-16 text-white/50" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 flex items-center gap-1">
                            ⭐ {hotel.rating}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                          <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                            <span>📍</span> {hotel.location}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">${hotel.pricePerNight}</p>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5 text-blue-600" />
                              </button>
                              <button 
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5 text-green-600" />
                              </button>
                              <button 
                                onClick={() => deleteHotel(hotel._id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities?.length > 3 && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                +{hotel.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredHotels.length === 0 && (
                    <div className="text-center py-20">
                      <Hotel className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-gray-600">No hotels found</p>
                      <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Management */}
              {activeTab === 'bookings' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">All Bookings</h3>
                      <p className="text-sm text-gray-500 mt-1">{bookings.length} total reservations</p>
                    </div>
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hotel</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-in</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-out</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guests</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-gray-900">{booking.hotelId?.name || 'N/A'}</p>
                                <p className="text-sm text-gray-500">{booking.hotelId?.location || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {new Date(booking.checkInDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {new Date(booking.checkOutDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {booking.guests}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-semibold text-green-600">${booking.totalPrice}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                {booking.status || 'Confirmed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Users Management */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">All Users</h3>
                      <p className="text-sm text-gray-500 mt-1">{users.length} registered customers</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-sm text-gray-900">
                              {user.clerkId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
