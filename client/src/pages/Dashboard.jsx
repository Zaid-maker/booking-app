import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../utils/api';
import { toast } from '../utils/toast';

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('confirmed');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getUserBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingsAPI.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      await fetchBookings(); // Refresh bookings
    } catch (err) {
      toast.error('Failed to cancel booking: ' + err.message);
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 text-lg">Manage your bookings and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 scale-in">
              <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-20 h-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-md flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  My Bookings
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-all flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-all flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Methods
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-all flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorites
                </button>
                <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scale-in">
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">Total Bookings</p>
                    <p className="text-4xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">Upcoming</p>
                    <p className="text-4xl font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed').length}</p>
                  </div>
                  <div className="bg-linear-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">Total Spent</p>
                    <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-yellow-500 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings */}
            <div className="bg-white rounded-2xl shadow-xl p-8 scale-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                My Bookings
              </h2>

              {/* Tabs */}
              <div className="flex space-x-2 mb-8 bg-gray-100 p-2 rounded-xl">
                <button
                  onClick={() => setActiveTab('confirmed')}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                    activeTab === 'confirmed'
                      ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  Confirmed
                  {bookings.filter(b => b.status === 'confirmed').length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === 'confirmed' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                    activeTab === 'completed'
                      ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  Completed
                  {bookings.filter(b => b.status === 'completed').length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === 'completed' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {bookings.filter(b => b.status === 'completed').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
                    activeTab === 'cancelled'
                      ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  Cancelled
                  {bookings.filter(b => b.status === 'cancelled').length > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === 'cancelled' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {bookings.filter(b => b.status === 'cancelled').length}
                    </span>
                  )}
                </button>
              </div>

              {/* Booking List */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                  <p className="text-gray-600">Loading your bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 text-lg font-semibold">{error}</p>
                </div>
              ) : filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking, index) => (
                    <div
                      key={booking._id}
                      className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 transition-all fade-in"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative">
                          <img
                            src={booking.property?.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'}
                            alt={booking.property?.name}
                            className="w-full md:w-40 h-40 object-cover rounded-xl"
                          />
                          {booking.property?.featured && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                {booking.property?.name}
                              </h3>
                              <p className="text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {booking.property?.location}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                                booking.status === 'confirmed'
                                  ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white'
                                  : booking.status === 'completed'
                                  ? 'bg-linear-to-r from-green-500 to-green-600 text-white'
                                  : 'bg-linear-to-r from-red-500 to-red-600 text-white'
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-xl">
                              <div className="text-xs text-gray-600 font-semibold mb-1">Check-in</div>
                              <div className="font-bold text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                              <div className="text-xs text-gray-600 font-semibold mb-1">Check-out</div>
                              <div className="font-bold text-gray-900">
                                {new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                            <div className="bg-linear-to-br from-pink-50 to-red-50 p-4 rounded-xl">
                              <div className="text-xs text-gray-600 font-semibold mb-1">Guests</div>
                              <div className="font-bold text-gray-900">
                                {booking.guests}
                              </div>
                            </div>
                            <div className="bg-linear-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                              <div className="text-xs text-gray-600 font-semibold mb-1">Total</div>
                              <div className="font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                ${booking.totalPrice.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            {booking.status === 'confirmed' && (
                              <button 
                                onClick={() => handleCancelBooking(booking._id)}
                                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold flex items-center"
                              >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 fade-in">
                  <div className="bg-linear-to-br from-gray-50 to-purple-50 rounded-3xl p-12 max-w-md mx-auto">
                    <svg
                      className="w-24 h-24 text-gray-400 mx-auto mb-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-gray-900 text-xl font-bold mb-3">
                      No {activeTab} bookings
                    </p>
                    <p className="text-gray-600 mb-6">
                      {activeTab === 'confirmed' ? 'Start exploring amazing properties!' : `You don't have any ${activeTab} bookings yet.`}
                    </p>
                    {activeTab === 'confirmed' && (
                      <button 
                        onClick={() => window.location.href = '/properties'}
                        className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                      >
                        Browse Properties
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
