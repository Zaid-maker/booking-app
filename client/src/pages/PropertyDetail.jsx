import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertiesAPI, bookingsAPI, reviewsAPI, paymentsAPI } from '../utils/api';
import { toast } from '../utils/toast';
import ImageCarousel from '../components/ImageCarousel';
import ReviewCard from '../components/ReviewCard';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentModal from '../components/PaymentModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    fetchProperty();
    fetchReviews();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertiesAPI.getById(id);
      setProperty(data.property);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await reviewsAPI.getPropertyReviews(id);
      setReviews(data.reviews || []);
      setReviewStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md">
            <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Property Not Found</h2>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
            >
              Browse All Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning('Please login to make a booking');
      navigate('/login');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    try {
      setBookingLoading(true);
      await bookingsAPI.create({
        propertyId: id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: Number(bookingData.guests),
        totalPrice: totalPrice,
      });
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to purchase property');
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const data = await paymentsAPI.createPaymentIntent(id);
      setClientSecret(data.clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error) {
      toast.error(error.message || 'Failed to initiate purchase');
    } finally {
      setBookingLoading(false);
    }
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const start = new Date(bookingData.checkIn);
      const end = new Date(bookingData.checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * (property?.price || 0);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        {/* Back Button */}
        <button
          onClick={() => navigate('/properties')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-700 font-semibold transition-all group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Properties
        </button>

        {/* Property Images */}
        <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <ImageCarousel images={property.images} alt={property.name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 scale-in">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {property.name}
                  </h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <svg
                      className="w-6 h-6 mr-2 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {property.location}
                  </p>
                </div>
                {property.featured && (
                  <span className="px-4 py-2 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-full">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-xl text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div className="text-2xl font-bold text-gray-900">{property.guests}</div>
                  <div className="text-sm text-gray-600">Guests</div>
                </div>
                <div className="bg-linear-to-br from-purple-50 to-pink-50 p-4 rounded-xl text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <div className="text-2xl font-bold text-gray-900">{property.beds}</div>
                  <div className="text-sm text-gray-600">Beds</div>
                </div>
                <div className="bg-linear-to-br from-pink-50 to-red-50 p-4 rounded-xl text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  <div className="text-2xl font-bold text-gray-900">{property.baths}</div>
                  <div className="text-sm text-gray-600">Baths</div>
                </div>
                <div className="bg-linear-to-br from-yellow-50 to-orange-50 p-4 rounded-xl text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="text-2xl font-bold text-gray-900">{property.rating}</div>
                  <div className="text-sm text-gray-600">{property.reviews} reviews</div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 scale-in">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                About this place
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Amenities Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 scale-in">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                What this place offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-4 bg-linear-to-br from-gray-50 to-blue-50/50 rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-3">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 scale-in">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                Reviews {reviewStats && `(${reviewStats.total})`}
              </h2>

              {reviewStats && reviewStats.total > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{reviewStats.avgRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{reviewStats.avgCleanliness.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Cleanliness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{reviewStats.avgAccuracy.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{reviewStats.avgCheckIn.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Check-in</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{reviewStats.avgCommunication.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Communication</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{reviewStats.avgLocation.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Location</div>
                  </div>
                </div>
              )}

              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} onUpdate={fetchReviews} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 scale-in border-2 border-purple-100">
              {/* Price Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ${property.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ night</span>
                </div>
                <div className="flex items-center mt-2">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
                  <span className="text-sm text-gray-600 ml-1">({property.reviews} reviews)</span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                {property.type === 'sale' ? (
                  <div>
                    <div className="text-lg text-gray-700 mb-6">
                      This property is for sale. Purchase it now to make it yours!
                    </div>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {bookingLoading ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Check-in
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          name="checkIn"
                          value={bookingData.checkIn}
                          onChange={handleBookingChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Check-out
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          name="checkOut"
                          value={bookingData.checkOut}
                          onChange={handleBookingChange}
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Guests
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <select
                          name="guests"
                          value={bookingData.guests}
                          onChange={handleBookingChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none bg-white"
                        >
                          {[...Array(property.guests)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {nights > 0 && (
                      <div className="border-t border-b border-gray-200 py-4 space-y-3">
                        <div className="flex justify-between text-gray-700">
                          <span>
                            ${property.price} × {nights} {nights === 1 ? 'night' : 'nights'}
                          </span>
                          <span className="font-semibold">${totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold">
                          <span className="text-gray-900">Total</span>
                          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            ${totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {bookingLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Reserve Now
                        </>
                      )}
                    </button>
                  </>
                )}

                {!isAuthenticated && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start">
                    <svg className="w-5 h-5 text-yellow-600 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-yellow-800">
                      Please <button onClick={() => navigate('/login')} className="font-semibold underline hover:text-yellow-900">login</button> to make a booking
                    </p>
                  </div>
                )}

                <div className="text-center text-sm text-gray-500">
                  You won't be charged yet
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            amount={property.price}
            onSuccess={(paymentIntent) => {
              console.log('Payment success:', paymentIntent);
              // Optionally redirect or show success message
            }}
          />
        </Elements>
      )}
    </div>
  );
}

export default PropertyDetail;
