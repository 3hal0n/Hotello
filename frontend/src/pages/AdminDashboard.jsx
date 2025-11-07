import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Hotel, Calendar, Users, LogOut, Menu, X,
  DollarSign, ShoppingCart, Star, Trash2
} from 'lucide-react';

export default function AdminDashboard({ adminToken, adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'hotels') {
      fetchHotels();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const authHeaders = () => ({
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  });

  async function fetchDashboardStats() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/dashboard/stats`, {
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }

  async function fetchHotels() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/hotels`, {
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setHotels(data.data);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/bookings`, {
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/users`, {
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteHotel(id) {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/hotels/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        fetchHotels();
      } else {
        alert('Failed to delete hotel');
      }
    } catch (err) {
      console.error('Error deleting hotel:', err);
      alert('Error deleting hotel');
    }
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent">
        <div className="h-19.5">
          <a className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" href="#">
            <img src="/admin-logo.png" className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8" alt="main_logo" />
            <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">Soft UI Dashboard</span>
          </a>
        </div>
        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">
            <li className="mt-0.5 w-full">
              <a className="py-2.7 shadow-soft-xl text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors" href="#">
                <span className="mr-2"><i className="fas fa-home"></i></span>
                Dashboard
              </a>
            </li>
            <li className="mt-0.5 w-full">
              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">
                <span className="mr-2"><i className="fas fa-table"></i></span>
                Tables
              </a>
            </li>
            <li className="mt-0.5 w-full">
              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">
                <span className="mr-2"><i className="fas fa-credit-card"></i></span>
                Billing
              </a>
            </li>
            <li className="mt-0.5 w-full">
              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">
                <span className="mr-2"><i className="fas fa-vr-cardboard"></i></span>
                Virtual Reality
              </a>
            </li>
            <li className="mt-0.5 w-full">
              <a className="py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors" href="#">
                <span className="mr-2"><i className="fas fa-globe"></i></span>
                RTL
              </a>
            </li>
            <li className="w-full mt-4">
              <h6 className="pl-6 ml-2 text-xs font-bold leading-tight uppercase opacity-60">Account pages</h6>
            </li>
            <li className="mt-0.5 w-full">
              <a className="py-2.7 text-sm shadow-soft-xl ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors" href="#">
                <span className="mr-2"><i className="fas fa-user"></i></span>
                Profile
              </a>
            </li>
          </ul>
        </div>
        <div className="mx-4 mt-8">
          <div className="relative flex min-w-0 flex-col items-center break-words rounded-2xl border-0 bg-white bg-clip-border shadow-none">
            <div className="relative z-20 flex-auto w-full p-4 text-left text-white">
              <div className="flex items-center justify-center w-8 h-8 mb-4 text-center bg-white bg-center rounded-lg icon shadow-soft-2xl">
                <i className="fas fa-question text-blue-600"></i>
              </div>
              <div className="transition-all duration-200 ease-nav-brand">
                <h6 className="mb-0 text-slate-700">Need help?</h6>
                <p className="mt-0 mb-4 font-semibold leading-tight text-xs text-slate-400">Please check our docs</p>
                <a className="inline-block px-4 py-2 font-bold text-center uppercase align-middle transition-all bg-blue-600 border border-solid rounded-lg shadow-none cursor-pointer text-white" href="#">DOCUMENTATION</a>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen rounded-xl transition-all duration-200">
        {/* Top Navbar */}
        <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start">
          <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
            <nav>
              <ol className="flex flex-wrap pt-1 pl-2 pr-4 mr-12 bg-transparent rounded-lg sm:mr-16">
                <li className="text-sm text-slate-700">Pages</li>
                <li className="text-sm text-slate-700">/</li>
                <li className="text-sm text-slate-700 font-bold">Dashboard</li>
              </ol>
              <h6 className="mb-0 font-bold capitalize text-slate-700">Dashboard</h6>
            </nav>
            <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
              <input className="border rounded px-4 py-2 mr-4" placeholder="Type here..." />
              <a className="text-blue-600 font-bold" href="#">Sign In</a>
            </div>
          </div>
        </nav>
        {/* Cards Row 1 */}
        <div className="w-full px-6 py-6 mx-auto">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">
                <div className="flex-auto">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div className="text-xs font-bold text-slate-400">Today's Money</div>
                      <h5 className="font-bold text-blue-600">$53,000 <span className="text-xs text-green-500 font-semibold">+55%</span></h5>
                    </div>
                    <div className="flex-none w-1/3 max-w-full px-3 text-right">
                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-blue-600 to-cyan-400">
                        <i className="fas fa-wallet text-white text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">
                <div className="flex-auto">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div className="text-xs font-bold text-slate-400">Today's Users</div>
                      <h5 className="font-bold text-blue-600">2,300 <span className="text-xs text-green-500 font-semibold">+3%</span></h5>
                    </div>
                    <div className="flex-none w-1/3 max-w-full px-3 text-right">
                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                        <i className="fas fa-users text-white text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">
                <div className="flex-auto">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div className="text-xs font-bold text-slate-400">New Clients</div>
                      <h5 className="font-bold text-blue-600">+3,462 <span className="text-xs text-red-500 font-semibold">-2%</span></h5>
                    </div>
                    <div className="flex-none w-1/3 max-w-full px-3 text-right">
                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-pink-500 to-orange-400">
                        <i className="fas fa-user-plus text-white text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl mb-4 xl:mb-0 shadow-soft-xl p-4">
                <div className="flex-auto">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div className="text-xs font-bold text-slate-400">Sales</div>
                      <h5 className="font-bold text-blue-600">$103,430 <span className="text-xs text-green-500 font-semibold">+5%</span></h5>
                    </div>
                    <div className="flex-none w-1/3 max-w-full px-3 text-right">
                      <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-orange-500 to-yellow-400">
                        <i className="fas fa-shopping-cart text-white text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Cards Row 2: Documentation, Rocket, Work with the rockets */}
          <div className="flex flex-wrap -mx-3 mt-6">
            <div className="w-full max-w-full px-3 mb-6 lg:mb-0 lg:w-7/12 lg:flex-none">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl shadow-soft-xl p-4">
                <div className="flex-auto">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div className="text-xs font-bold text-slate-400">Built by developers</div>
                      <h5 className="font-bold text-slate-700">Soft UI Dashboard</h5>
                      <p className="text-xs text-slate-400">From colors, cards, typography to complex elements, you will find the full documentation.</p>
                      <a className="text-blue-600 font-bold" href="#">Read More</a>
                    </div>
                    <div className="flex-none w-1/3 max-w-full px-3 text-right">
                      <img src="/admin-rocket.png" alt="Rocket" className="w-20 h-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full px-3 lg:w-5/12 lg:flex-none">
              <div className="relative flex flex-col min-w-0 break-words bg-white rounded-2xl shadow-soft-xl p-4">
                <div className="flex-auto">
                  <h5 className="font-bold text-slate-700 mb-2">Work with the rockets</h5>
                  <p className="text-xs text-slate-400 mb-2">Wealth creation is an evolutionarily recent positive-sum game. It is all about who takes the opportunity first.</p>
                  <a className="text-blue-600 font-bold" href="#">Read More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
