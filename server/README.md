# Booking App - Backend API

A modern backend server built with **Bun**, **Hono**, **MongoDB**, and **TypeScript** for the Booking App.

## 🚀 Features

- ✅ **Fast & Lightweight**: Built with Hono framework and Bun runtime
- 🔐 **Authentication**: JWT-based authentication with bcrypt password hashing
- 🏠 **Property Management**: CRUD operations for properties
- 📅 **Booking System**: Complete booking management with availability checking
- 🗃️ **MongoDB**: Database with Mongoose ODM
- 🔒 **Secure**: Protected routes with authentication middleware
- 📝 **TypeScript**: Full type safety
- 🌱 **Database Seeding**: Sample data for testing

## 📦 Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Language**: TypeScript

## 🛠️ Installation

### Prerequisites

- [Bun](https://bun.sh/) installed
- MongoDB running locally or connection string

### Setup

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update the values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/booking-app
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   ```

3. **Seed the database:**

   ```bash
   bun run seed
   ```

4. **Start the server:**

   ```bash
   bun run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Properties

- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/:id` - Update property (protected)
- `DELETE /api/properties/:id` - Delete property (protected)

### Bookings

- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `PATCH /api/bookings/:id/status` - Update booking status (protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (protected)

## 🔑 Test Credentials

After seeding the database, use these credentials:

```
User:  john@example.com / password123
Host:  jane@example.com / password123
Admin: admin@example.com / password123
```

## 🗂️ Project Structure

```
server/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── seed.ts          # Database seeding
├── server.ts            # Main server file
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## 🔧 Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run seed` - Seed database with sample data

## 📄 License

MIT
