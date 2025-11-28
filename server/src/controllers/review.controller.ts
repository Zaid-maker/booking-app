import { Context } from 'hono';
import Review from '../models/Review';
import Booking from '../models/Booking';
import Property from '../models/Property';

// Create a review
export const createReview = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { bookingId, rating, comment, cleanliness, accuracy, checkIn, communication, location, value, images } = await c.req.json();

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return c.json({ message: 'Booking not found' }, 404);
    }

    if (booking.user.toString() !== userId) {
      return c.json({ message: 'You can only review your own bookings' }, 403);
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return c.json({ message: 'You can only review completed bookings' }, 400);
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return c.json({ message: 'You have already reviewed this booking' }, 400);
    }

    // Create review
    const review = await Review.create({
      property: booking.property,
      user: userId,
      booking: bookingId,
      rating,
      comment,
      cleanliness,
      accuracy,
      checkIn,
      communication,
      location,
      value,
      images: images || [],
    });

    await review.populate('user', 'firstName lastName');

    return c.json({
      success: true,
      message: 'Review created successfully',
      review,
    }, 201);
  } catch (error: any) {
    console.error('Create review error:', error);
    return c.json({ message: error.message || 'Failed to create review' }, 500);
  }
};

// Get reviews for a property
export const getPropertyReviews = async (c: Context) => {
  try {
    const { propertyId } = c.req.param();
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ property: propertyId });

    // Get rating breakdown
    const ratingStats = await Review.aggregate([
      { $match: { property: propertyId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgCleanliness: { $avg: '$cleanliness' },
          avgAccuracy: { $avg: '$accuracy' },
          avgCheckIn: { $avg: '$checkIn' },
          avgCommunication: { $avg: '$communication' },
          avgLocation: { $avg: '$location' },
          avgValue: { $avg: '$value' },
          total: { $sum: 1 },
        },
      },
    ]);

    const ratingBreakdown = await Review.aggregate([
      { $match: { property: propertyId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return c.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: ratingStats[0] || null,
      ratingBreakdown,
    });
  } catch (error: any) {
    console.error('Get property reviews error:', error);
    return c.json({ message: error.message || 'Failed to fetch reviews' }, 500);
  }
};

// Get user's reviews
export const getUserReviews = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('property', 'name location images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ user: userId });

    return c.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get user reviews error:', error);
    return c.json({ message: error.message || 'Failed to fetch reviews' }, 500);
  }
};

// Check if user can review a booking
export const canReview = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { bookingId } = c.req.param();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return c.json({ canReview: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== userId) {
      return c.json({ canReview: false, message: 'Not your booking' });
    }

    if (booking.status !== 'completed') {
      return c.json({ canReview: false, message: 'Booking not completed' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return c.json({ canReview: false, message: 'Already reviewed' });
    }

    return c.json({ canReview: true });
  } catch (error: any) {
    console.error('Can review error:', error);
    return c.json({ message: error.message || 'Failed to check review status' }, 500);
  }
};

// Update review
export const updateReview = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { reviewId } = c.req.param();
    const { rating, comment, cleanliness, accuracy, checkIn, communication, location, value, images } = await c.req.json();

    const review = await Review.findById(reviewId);
    if (!review) {
      return c.json({ message: 'Review not found' }, 404);
    }

    if (review.user.toString() !== userId) {
      return c.json({ message: 'You can only update your own reviews' }, 403);
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.cleanliness = cleanliness || review.cleanliness;
    review.accuracy = accuracy || review.accuracy;
    review.checkIn = checkIn || review.checkIn;
    review.communication = communication || review.communication;
    review.location = location || review.location;
    review.value = value || review.value;
    if (images) review.images = images;

    await review.save();
    await review.populate('user', 'firstName lastName');

    return c.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error: any) {
    console.error('Update review error:', error);
    return c.json({ message: error.message || 'Failed to update review' }, 500);
  }
};

// Delete review
export const deleteReview = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { reviewId } = c.req.param();

    const review = await Review.findById(reviewId);
    if (!review) {
      return c.json({ message: 'Review not found' }, 404);
    }

    if (review.user.toString() !== userId) {
      return c.json({ message: 'You can only delete your own reviews' }, 403);
    }

    await Review.findByIdAndDelete(reviewId);

    return c.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete review error:', error);
    return c.json({ message: error.message || 'Failed to delete review' }, 500);
  }
};

// Toggle helpful vote
export const toggleHelpful = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { reviewId } = c.req.param();

    const review = await Review.findById(reviewId);
    if (!review) {
      return c.json({ message: 'Review not found' }, 404);
    }

    const userIdObj = userId;
    const helpfulIndex = review.helpful.findIndex(id => id.toString() === userIdObj);

    if (helpfulIndex > -1) {
      review.helpful.splice(helpfulIndex, 1);
    } else {
      review.helpful.push(userIdObj);
    }

    await review.save();

    return c.json({
      success: true,
      helpful: review.helpful.length,
      isHelpful: helpfulIndex === -1,
    });
  } catch (error: any) {
    console.error('Toggle helpful error:', error);
    return c.json({ message: error.message || 'Failed to toggle helpful' }, 500);
  }
};
