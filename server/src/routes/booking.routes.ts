import { Hono } from 'hono';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth';

const bookingRoutes = new Hono();

// All booking routes are protected
bookingRoutes.use('*', authMiddleware);

bookingRoutes.post('/', createBooking);
bookingRoutes.get('/my-bookings', getUserBookings); // Specific route before :id
bookingRoutes.get('/:id', getBookingById);
bookingRoutes.patch('/:id/status', updateBookingStatus);
bookingRoutes.patch('/:id/cancel', cancelBooking);

export default bookingRoutes;
