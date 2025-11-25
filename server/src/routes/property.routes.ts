import { Hono } from 'hono';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/property.controller';
import { authMiddleware } from '../middleware/auth';

const propertyRoutes = new Hono();

// Public routes
propertyRoutes.get('/', getAllProperties);
propertyRoutes.get('/:id', getPropertyById);

// Protected routes
propertyRoutes.post('/', authMiddleware, createProperty);
propertyRoutes.put('/:id', authMiddleware, updateProperty);
propertyRoutes.delete('/:id', authMiddleware, deleteProperty);

export default propertyRoutes;
