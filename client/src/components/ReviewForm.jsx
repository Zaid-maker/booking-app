import { useState } from 'react';
import { reviewsAPI } from '../utils/api';
import { toast } from '../utils/toast';

function ReviewForm({ bookingId, propertyName, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 5,
  });

  const categories = [
    { key: 'cleanliness', label: 'Cleanliness', icon: '🧹' },
    { key: 'accuracy', label: 'Accuracy', icon: '✓' },
    { key: 'checkIn', label: 'Check-in', icon: '🔑' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'location', label: 'Location', icon: '📍' },
    { key: 'value', label: 'Value', icon: '💰' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.comment.length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    try {
      setLoading(true);
      await reviewsAPI.create({
        bookingId,
        ...formData,
      });
      toast.success('Review submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 w-32">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <svg
              className={`w-8 h-8 ${star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h3>
      <p className="text-gray-600 mb-6">{propertyName}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h4>
          <StarRating
            value={formData.rating}
            onChange={(val) => setFormData({ ...formData, rating: val })}
            label="Overall"
          />
        </div>

        {/* Category Ratings */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900">Rate by Category</h4>
          {categories.map((cat) => (
            <StarRating
              key={cat.key}
              value={formData[cat.key]}
              onChange={(val) => setFormData({ ...formData, [cat.key]: val })}
              label={`${cat.icon} ${cat.label}`}
            />
          ))}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Your Review
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows="5"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            placeholder="Share your experience with this property..."
            required
            minLength={10}
            maxLength={1000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.comment.length}/1000
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
