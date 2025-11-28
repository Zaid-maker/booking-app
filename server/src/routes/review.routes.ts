import { Hono } from 'hono';
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  canReview,
  updateReview,
  deleteReview,
  toggleHelpful,
} from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth';

const reviewRoutes = new Hono();

// Public routes
reviewRoutes.get('/property/:propertyId', getPropertyReviews);

// Protected routes
reviewRoutes.use('*', authMiddleware);
reviewRoutes.post('/', createReview);
reviewRoutes.get('/my-reviews', getUserReviews);
reviewRoutes.get('/can-review/:bookingId', canReview);
reviewRoutes.put('/:reviewId', updateReview);
reviewRoutes.delete('/:reviewId', deleteReview);
reviewRoutes.post('/:reviewId/helpful', toggleHelpful);

export default reviewRoutes;
