import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import connectDB from './src/utils/db';
import authRoutes from './src/routes/auth.routes';
import propertyRoutes from './src/routes/property.routes';
import bookingRoutes from './src/routes/booking.routes';

// Initialize Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Health check
app.get('/', (c) => {
  return c.json({
    message: '🚀 Booking App API',
    version: '1.0.0',
    status: 'active',
  });
});

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/properties', propertyRoutes);
app.route('/api/bookings', bookingRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json(
    {
      error: err.message || 'Internal server error',
    },
    500
  );
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default {
  port: PORT,
  fetch: app.fetch,
};