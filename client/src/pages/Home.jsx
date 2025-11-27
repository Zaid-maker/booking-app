import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { propertiesAPI } from '../utils/api';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProperties = useCallback(async () => {
    try {
      const data = await propertiesAPI.getAll({ featured: true });
      setFeaturedProperties(data.properties || []);
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[calc(100vh-5rem)] min-h-[600px] flex items-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=75)',
        }}
      >
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/80 via-purple-900/70 to-pink-900/60"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white w-full">
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your <span className="gradient-text">Perfect Stay</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-3xl mx-auto">
              Discover amazing places to stay around the world. From cozy apartments to luxury villas.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">10k+</div>
                <div className="text-sm text-gray-300">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">50k+</div>
                <div className="text-sm text-gray-300">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">4.8★</div>
                <div className="text-sm text-gray-300">Average Rating</div>
              </div>
            </div>
            
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Featured Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Handpicked Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Carefully selected properties offering the best experience for your stay
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="h-64 bg-gray-200 skeleton"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded skeleton"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 skeleton"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 skeleton"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProperties.map((property, index) => (
                <div 
                  key={property._id} 
                  className="fade-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              View All Properties
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Perfect Stay Awaits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-linear-to-br from-blue-50 to-white hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="bg-linear-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Verified Properties</h3>
              <p className="text-gray-600 text-center">
                All properties are thoroughly verified and inspected to ensure quality and safety standards
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-linear-to-br from-purple-50 to-white hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="bg-linear-to-br from-purple-600 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">Best Prices</h3>
              <p className="text-gray-600 text-center">
                Competitive pricing with transparent rates and no hidden fees or surprise charges
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-linear-to-br from-pink-50 to-white hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="bg-linear-to-br from-pink-600 to-pink-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center">24/7 Support</h3>
              <p className="text-gray-600 text-center">
                Round-the-clock customer support team ready to assist you anytime, anywhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
            Join thousands of happy travelers who found their perfect stay with StayHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Browse Properties
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-lg font-bold border-2 border-white hover:bg-white hover:text-blue-600 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
