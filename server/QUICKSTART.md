# 🚀 Quick Start Guide - Booking App Backend

## Prerequisites

1. **Install Bun** (if not already installed):

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Install MongoDB**:
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. **Start MongoDB**:

   ```bash
   # Windows (as service)
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

## Setup Steps

### 1. Install Dependencies

```bash
cd /d/javascript-projects/booking-app/server
bun install
```

### 2. Environment Configuration

The `.env` file is already configured with default values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/booking-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

```bash
bun run seed
```

This will create:

- 3 test users (user, host, admin)
- 8 sample properties
- 2 sample bookings

### 4. Start the Server

```bash
bun run dev
```

The server will start on `http://localhost:5000`

## ✅ Verify Installation

### Test the API

```bash
# Health check
curl http://localhost:5000

# Should return: {"message":"🚀 Booking App API","version":"1.0.0","status":"active"}
```

### Login with test account

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get properties

```bash
curl http://localhost:5000/api/properties
```

## 📝 Test Credentials

```
User:  john@example.com / password123
Host:  jane@example.com / password123
Admin: admin@example.com / password123
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error**: "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution**:

1. Make sure MongoDB is running
2. Check if MongoDB is running on port 27017: `netstat -an | grep 27017`
3. Update `MONGODB_URI` in `.env` if using a different port/host

### Port Already in Use

**Error**: "EADDRINUSE: address already in use :::5000"

**Solution**:

1. Change the `PORT` in `.env` to a different port (e.g., 5001)
2. Or kill the process using port 5000:

   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### Bun Not Found

**Solution**:

1. Restart your terminal after installing Bun
2. Or source your shell config:

   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

## 📚 Next Steps

1. **Test the API** - Use the examples in `API_TESTING.md`
2. **Start the Frontend** - Navigate to the client folder and run the React app
3. **Explore the Code** - Check out the controllers, models, and routes

## 🎯 Available Commands

```bash
bun run dev      # Start development server with hot reload
bun run start    # Start production server
bun run seed     # Seed database with sample data
```

## 📖 Documentation

- See `README.md` for complete API documentation
- See `API_TESTING.md` for API testing examples
- Check `src/` folder for code structure

## 🐛 Common Issues

1. **TypeError: Cannot read property 'split' of undefined**
   - Make sure you're sending the Authorization header: `Bearer YOUR_TOKEN`

2. **ValidationError**
   - Check your request body matches the model schema
   - See model files in `src/models/` for required fields

3. **CastError: Cast to ObjectId failed**
   - Make sure you're using valid MongoDB ObjectId strings
   - Get valid IDs from the GET endpoints first

---

**Need Help?** Check the logs for detailed error messages! 🔍
