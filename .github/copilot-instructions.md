# Booking App - AI Agent Instructions

## Architecture Overview

**Monorepo Structure**: Root with `client/` (React) and `server/` (Bun/Hono) folders. Run both from root using `bun run dev` (uses concurrently).

**Tech Stack**:
- **Backend**: Bun runtime + Hono framework + MongoDB (Mongoose) + TypeScript
- **Frontend**: Vite + React 19 + Tailwind CSS 4 + React Router DOM
- **Auth**: JWT tokens (localStorage) with bcryptjs hashing

**Data Flow**: Client → API request (with JWT in Authorization header) → Hono routes → Controllers → Mongoose models → MongoDB

## Critical Project Conventions

### 1. Route Ordering (CRITICAL!)
In Hono, **specific routes MUST come before parameterized routes**:

```typescript
// ✅ CORRECT - /my-bookings before /:id
bookingRoutes.get('/my-bookings', getUserBookings);
bookingRoutes.get('/:id', getBookingById);

// ❌ WRONG - /:id will match "my-bookings" as an ID
bookingRoutes.get('/:id', getBookingById);
bookingRoutes.get('/my-bookings', getUserBookings);
```

### 2. Authentication Pattern
**Backend**: Use `authMiddleware` from `server/src/middleware/auth.ts`
- Per-route: `propertyRoutes.post('/', authMiddleware, createProperty)`
- All routes: `bookingRoutes.use('*', authMiddleware)` (applies to ALL booking routes)

**Frontend**: Use `<ProtectedRoute>` wrapper for authenticated pages:
```jsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### 3. User Feedback System
**No external toast libraries** - use custom `client/src/utils/toast.js`:
```javascript
import { toast } from '../utils/toast';
toast.success('Booking created!');
toast.error('Login failed');
```
DOM-based, auto-dismiss after 3s, positioned top-right. Never use `alert()`.

### 4. API Communication
All API calls go through `client/src/utils/api.js`:
- Automatically adds JWT token from localStorage to Authorization header
- Base URL: `http://localhost:5000/api` (configurable via VITE_API_URL)
- Organized by resource: `authAPI`, `propertiesAPI`, `bookingsAPI`

Example:
```javascript
const properties = await propertiesAPI.getAll({ featured: true });
const booking = await bookingsAPI.create({ propertyId, checkIn, checkOut });
```

### 5. State Management
**Auth state** managed by `client/src/context/AuthContext.jsx`:
- Provides: `user`, `loading`, `isAuthenticated`, `login()`, `register()`, `logout()`
- Token stored in localStorage, auto-loads user on mount
- Use `useAuth()` hook in components

No Redux/Zustand - React Context only.

## Key Development Workflows

### Starting Development
```bash
# From root (starts both client + server with live reload)
bun run dev

# Or separately:
cd server && bun run dev     # Port 5000
cd client && bun run dev     # Port 5173
```

### Database Seeding
```bash
cd server && bun run seed
```
Creates test users:
- `john@example.com` / `password123` (user)
- `jane@example.com` / `password123` (host)
- `admin@example.com` / `password123` (admin)

### Adding New Protected Routes

**Backend**:
```typescript
// In routes file
import { authMiddleware } from '../middleware/auth';
router.get('/protected', authMiddleware, controller);

// Access user in controller
const userId = c.get('userId'); // Set by authMiddleware
```

**Frontend**:
```jsx
// In App.jsx
<Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
```

## MongoDB Schema Patterns

### Property Model (`server/src/models/Property.ts`)
```typescript
{
  name, description, location, price, beds, baths, guests,
  images: string[],      // Array of image URLs
  amenities: string[],   // Array of amenity names
  host: ObjectId,        // Reference to User
  rating, reviews, featured, available
}
```

### Booking Model (`server/src/models/Booking.ts`)
```typescript
{
  property: ObjectId,    // Ref: Property
  user: ObjectId,        // Ref: User
  checkIn: Date,
  checkOut: Date,
  guests: number,
  totalPrice: number,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}
```
**Validator**: checkOut must be after checkIn (enforced at schema level)

### User Model (`server/src/models/User.ts`)
```typescript
{
  firstName, lastName, email, password (hashed),
  role: 'user' | 'admin' | 'host'
}
```
**Pre-save hook**: Auto-hashes password with bcryptjs
**Method**: `comparePassword(candidate)` for login

## Component Patterns

### Page Structure
All pages in `client/src/pages/`:
- `Home.jsx` - Landing page with hero + featured properties
- `Properties.jsx` - Filterable property listings
- `PropertyDetail.jsx` - Single property view + booking form
- `Dashboard.jsx` - User's bookings management
- `Login.jsx` / `Register.jsx` - Auth pages

### Reusable Components (`client/src/components/`)
- `Navbar.jsx` - Shows user name + logout when authenticated
- `SearchBar.jsx` - Redirects to `/properties?location=X` with URLSearchParams
- `PropertyCard.jsx` - Property preview card
- `ImageCarousel.jsx` - Multi-image viewer with arrows + dots
- `ProtectedRoute.jsx` - Auth guard component

### API Integration Pattern
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await propertiesAPI.getAll();
      setData(result.properties);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

## Common Gotchas

1. **Route Order**: Always put specific routes (`/my-bookings`) before parameterized routes (`/:id`)
2. **CORS**: Backend allows `CLIENT_URL` (default: `http://localhost:5173`) - update `.env` if port changes
3. **JWT in Hono**: Access user via `c.get('userId')` and `c.get('email')` (set by authMiddleware)
4. **Date Validation**: Frontend validates min dates, backend validates checkOut > checkIn
5. **Population**: Use `.populate('property').populate('user')` in booking queries for full details
6. **Bun vs npm**: Use `bun` commands in server, `npm` or `bun` in client (client uses npm by default)

## Environment Setup

### Server `.env` (server/.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booking-app
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

### Client `.env` (client/.env - optional)
```env
VITE_API_URL=http://localhost:5000/api
```

## Testing Workflow

1. Seed database: `cd server && bun run seed`
2. Start servers: `bun run dev` (from root)
3. Login with test credentials (see above)
4. Test flows:
   - Browse properties → Property detail → Create booking
   - Dashboard → View bookings → Cancel booking
   - Protected routes (try accessing /dashboard without login)
   - Search functionality (homepage → search → filtered results)

## Adding New Features

### New Backend Route
1. Create controller in `server/src/controllers/`
2. Add route in `server/src/routes/` (mind route order!)
3. Add to `server/server.ts`: `app.route('/api/resource', resourceRoutes)`

### New Frontend Page
1. Create page in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Add API methods to `client/src/utils/api.js`
4. Use `useAuth()` for auth, `toast` for feedback

### Database Model Changes
After schema changes:
1. Drop collection or use migrations
2. Re-run `bun run seed` for test data
3. Update TypeScript interfaces
4. Update controllers using the model

## File Organization

```
booking-app/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── utils/            # api.js, toast.js
│   │   └── App.jsx           # Router setup
├── server/                    # Bun backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Hono route definitions
│   │   ├── middleware/       # authMiddleware
│   │   ├── utils/            # jwt.ts, db.ts
│   │   └── seed.ts           # Database seeding
│   └── server.ts             # Entry point
└── package.json              # Root (concurrently scripts)
```
