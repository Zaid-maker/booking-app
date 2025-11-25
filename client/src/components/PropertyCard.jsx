import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  return (
    <Link
      to={`/property/${property._id}`}
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden card-hover"
    >
      {/* Image Container with Overlay */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'}
          alt={property.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-4 flex items-center space-x-1 bg-linear-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-1 glass-dark text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{property.rating || '4.5'}</span>
        </div>

        {/* Quick View Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Property Name & Location */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {property.description}
        </p>

        {/* Property Features */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm font-semibold">{property.beds}</span>
            <span className="text-sm ml-1">beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            <span className="text-sm font-semibold">{property.baths}</span>
            <span className="text-sm ml-1">baths</span>
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-semibold">{property.guests}</span>
            <span className="text-sm ml-1">guests</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${property.price}
              </span>
              <span className="text-gray-500 text-sm ml-2">/ night</span>
            </div>
          </div>
          <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
            <span className="text-sm">Book Now</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
