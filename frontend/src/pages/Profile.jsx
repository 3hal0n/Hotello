import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, MapPin, Calendar, CreditCard, Heart, Settings, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch user bookings
      const bookingsResponse = await fetch(`http://localhost:3001/api/bookings/user/${user?.id}`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

      // Fetch favorites (mock data for now)
      setFavorites([
        {
          _id: '1',
          name: 'Luxury Beach Resort',
          location: 'Bentota',
          image: '/hotel1.jpg',
          price: 250,
          rating: 4.8
        },
        {
          _id: '2',
          name: 'Mountain View Hotel',
          location: 'Ella',
          image: '/hotel2.jpg',
          price: 180,
          rating: 4.6
        }
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatus = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (now < checkIn) return { label: 'Upcoming', color: 'blue', icon: Clock };
    if (now >= checkIn && now <= checkOut) return { label: 'Active', color: 'green', icon: CheckCircle };
    return { label: 'Completed', color: 'gray', icon: CheckCircle };
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile Settings', icon: Settings }
  ];

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user?.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  {user?.fullName || 'Welcome Back'}
                </h1>
                <p className="text-blue-100 text-lg">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b sticky top-20 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">My Bookings</h2>
                    <Link
                      to="/hotels"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all font-semibold"
                    >
                      Book New Hotel
                    </Link>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                      <Link
                        to="/hotels"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Explore Hotels
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {bookings.map((booking) => {
                        const status = getBookingStatus(booking);
                        const StatusIcon = status.icon;
                        return (
                          <div
                            key={booking._id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                              {/* Hotel Image */}
                              <div className="md:col-span-1">
                                <img
                                  src={booking.hotel?.image || '/hotel1.jpg'}
                                  alt={booking.hotel?.name}
                                  className="w-full h-48 md:h-full object-cover rounded-xl"
                                />
                              </div>

                              {/* Booking Details */}
                              <div className="md:col-span-2 space-y-3">
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {booking.hotel?.name}
                                  </h3>
                                  <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{booking.hotel?.location}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Check-in</p>
                                    <p className="font-semibold text-gray-900">
                                      {new Date(booking.checkInDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Check-out</p>
                                    <p className="font-semibold text-gray-900">
                                      {new Date(booking.checkOutDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Guests</p>
                                    <p className="font-semibold text-gray-900">{booking.guests}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Booking ID</p>
                                    <p className="font-semibold text-gray-900 text-xs">
                                      #{booking._id.substring(0, 8)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Status & Actions */}
                              <div className="md:col-span-1 flex flex-col justify-between items-end">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${status.color}-100 text-${status.color}-700 font-semibold`}>
                                  <StatusIcon className="w-4 h-4" />
                                  {status.label}
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                  <p className="text-3xl font-bold text-gray-900">
                                    ${booking.totalPrice}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Favorite Hotels</h2>

                  {favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
                      <p className="text-gray-600 mb-6">Start adding hotels to your favorites!</p>
                      <Link
                        to="/hotels"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Explore Hotels
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((hotel) => (
                        <div
                          key={hotel._id}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                        >
                          <div className="relative">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                            </button>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{hotel.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="font-semibold">{hotel.rating}</span>
                              </div>
                              <div>
                                <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
                                <span className="text-gray-500 text-sm">/night</span>
                              </div>
                            </div>
                            <Link
                              to={`/hotels/${hotel._id}`}
                              className="mt-4 w-full block text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h2>

                  <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={user?.fullName || ''}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.primaryEmailAddress?.emailAddress || ''}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                      <input
                        type="text"
                        value={new Date(user?.createdAt).toLocaleDateString() || 'N/A'}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div className="pt-6 border-t">
                      <button
                        onClick={() => signOut()}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
