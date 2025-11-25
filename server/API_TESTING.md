# API Testing Guide

## Test the server

```bash
# Health check
curl http://localhost:5000

# Expected: {"message":"🚀 Booking App API","version":"1.0.0","status":"active"}
```

## Authentication

### Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Save the token from the response
TOKEN="your_token_here"
```

### Get current user

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Properties

### Get all properties

```bash
curl http://localhost:5000/api/properties
```

### Get properties with filters

```bash
# Filter by location
curl "http://localhost:5000/api/properties?location=Miami"

# Filter by price range
curl "http://localhost:5000/api/properties?minPrice=100&maxPrice=250"

# Filter by beds
curl "http://localhost:5000/api/properties?beds=3"

# Sort by price
curl "http://localhost:5000/api/properties?sortBy=price-low"
```

### Get single property

```bash
curl http://localhost:5000/api/properties/PROPERTY_ID
```

### Create property (requires auth)

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Beach House",
    "description": "Beautiful beach house with ocean views",
    "location": "California",
    "price": 250,
    "beds": 3,
    "baths": 2,
    "guests": 6,
    "images": ["https://example.com/image.jpg"],
    "amenities": ["WiFi", "Pool", "Kitchen"]
  }'
```

## Bookings

### Create booking (requires auth)

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "propertyId": "PROPERTY_ID",
    "checkIn": "2025-12-15",
    "checkOut": "2025-12-20",
    "guests": 4,
    "totalPrice": 1500
  }'
```

### Get user bookings (requires auth)

```bash
# All bookings
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl "http://localhost:5000/api/bookings?status=confirmed" \
  -H "Authorization: Bearer $TOKEN"
```

### Get single booking (requires auth)

```bash
curl http://localhost:5000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Cancel booking (requires auth)

```bash
curl -X PATCH http://localhost:5000/api/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer $TOKEN"
```
