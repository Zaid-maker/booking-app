import { Hono } from 'hono';
import { register, login, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const authRoutes = new Hono();

// Public routes
authRoutes.post('/register', register);
authRoutes.post('/login', login);

// Protected routes
authRoutes.get('/me', authMiddleware, getMe);

export default authRoutes;
