import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../utils/api';
import { toast } from '../utils/toast';

function ReviewCard({ review, onUpdate }) {
  const { user } = useAuth();
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful?.length || 0);

  const handleHelpful = async () => {
    if (!user) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }

    try {
      const result = await reviewsAPI.toggleHelpful(review._id);
      setIsHelpful(result.isHelpful);
      setHelpfulCount(result.helpful);
    } catch (error) {
      toast.error('Failed to update helpful status');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const StarDisplay = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              {review.user?.firstName} {review.user?.lastName}
            </h4>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <StarDisplay rating={review.rating} />
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Category Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Cleanliness', value: review.cleanliness, icon: '🧹' },
          { label: 'Accuracy', value: review.accuracy, icon: '✓' },
          { label: 'Check-in', value: review.checkIn, icon: '🔑' },
          { label: 'Communication', value: review.communication, icon: '💬' },
          { label: 'Location', value: review.location, icon: '📍' },
          { label: 'Value', value: review.value, icon: '💰' },
        ].map((cat) => (
          <div key={cat.label} className="flex items-center gap-2 text-sm">
            <span>{cat.icon}</span>
            <span className="text-gray-600">{cat.label}:</span>
            <span className="font-semibold text-gray-900">{cat.value}/5</span>
          </div>
        ))}
      </div>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Review ${idx + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Helpful Button */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleHelpful}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            isHelpful
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </button>
        
        {user && user._id === review.user?._id && (
          <button
            className="text-gray-500 hover:text-red-600 transition-colors ml-auto"
            onClick={() => onUpdate && onUpdate(review._id)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewCard;
