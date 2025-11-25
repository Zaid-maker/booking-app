import 'dotenv/config';
import connectDB from './utils/db';
import User from './models/User';
import Property from './models/Property';
import Booking from './models/Booking';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Booking.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'host',
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    const hostId = users[1]!._id as any;
    const userId = users[0]!._id as any;

    // Create properties
    console.log('🏠 Creating properties...');
    const properties = await Property.create([
      {
        name: 'Luxury Beach Villa',
        description:
          'Experience luxury living in this stunning beachfront villa. Wake up to breathtaking ocean views, enjoy your private infinity pool, and relax in the spacious living areas.',
        location: 'Miami, Florida',
        price: 299,
        beds: 4,
        baths: 3,
        guests: 8,
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
        ],
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Kitchen', 'Air Conditioning', 'TV', 'Parking', 'Ocean View'],
        host: hostId,
        rating: 4.9,
        reviews: 127,
        featured: true,
        available: true,
      },
      {
        name: 'Mountain Cabin Retreat',
        description: 'Cozy cabin nestled in the mountains, perfect for winter getaways and summer adventures.',
        location: 'Aspen, Colorado',
        price: 199,
        beds: 3,
        baths: 2,
        guests: 6,
        images: [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200',
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200',
        ],
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Heating', 'Mountain View', 'Hiking Trails'],
        host: hostId,
        rating: 4.8,
        reviews: 89,
        featured: true,
        available: true,
      },
      {
        name: 'Downtown City Loft',
        description: 'Modern loft in the heart of the city with amazing skyline views and walking distance to everything.',
        location: 'New York, NY',
        price: 249,
        beds: 2,
        baths: 2,
        guests: 4,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
          'https://images.unsplash.com/photo-1502672260066-6bc35f0f1edb?w=1200',
        ],
        amenities: ['WiFi', 'Gym', 'Kitchen', 'Air Conditioning', 'City View', 'Elevator'],
        host: hostId,
        rating: 4.7,
        reviews: 156,
        featured: false,
        available: true,
      },
      {
        name: 'Countryside Farmhouse',
        description: 'Charming farmhouse surrounded by vineyards and rolling hills. Perfect for a peaceful retreat.',
        location: 'Tuscany, Italy',
        price: 179,
        beds: 5,
        baths: 3,
        guests: 10,
        images: [
          'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
        ],
        amenities: ['WiFi', 'Garden', 'Kitchen', 'Vineyard', 'Countryside View', 'BBQ'],
        host: hostId,
        rating: 4.9,
        reviews: 203,
        featured: false,
        available: true,
      },
      {
        name: 'Tropical Paradise Villa',
        description: 'Luxurious villa with private pool and tropical garden. Your own slice of paradise.',
        location: 'Bali, Indonesia',
        price: 220,
        beds: 3,
        baths: 2,
        guests: 6,
        images: [
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200',
        ],
        amenities: ['WiFi', 'Pool', 'Garden', 'Kitchen', 'Tropical View', 'Air Conditioning'],
        host: hostId,
        rating: 4.8,
        reviews: 94,
        featured: false,
        available: true,
      },
      {
        name: 'Lakeside Cottage',
        description: 'Peaceful cottage with direct lake access and mountain views. Perfect for fishing and relaxation.',
        location: 'Lake Tahoe, California',
        price: 159,
        beds: 2,
        baths: 1,
        guests: 4,
        images: [
          'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=1200',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        ],
        amenities: ['WiFi', 'Lake Access', 'Kitchen', 'Fireplace', 'Mountain View', 'Boat Dock'],
        host: hostId,
        rating: 4.6,
        reviews: 78,
        featured: false,
        available: true,
      },
      {
        name: 'Desert Oasis',
        description: 'Modern desert home with pool and stunning sunset views. Unique architectural design.',
        location: 'Scottsdale, Arizona',
        price: 189,
        beds: 3,
        baths: 2,
        guests: 6,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200',
        ],
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Air Conditioning', 'Desert View', 'Patio'],
        host: hostId,
        rating: 4.7,
        reviews: 112,
        featured: false,
        available: true,
      },
      {
        name: 'Historic City Apartment',
        description: 'Charming apartment in historic building near major attractions. Full of character and charm.',
        location: 'Paris, France',
        price: 279,
        beds: 2,
        baths: 1,
        guests: 4,
        images: [
          'https://images.unsplash.com/photo-1502672260066-6bc35f0f1edb?w=1200',
          'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=1200',
        ],
        amenities: ['WiFi', 'Kitchen', 'City View', 'Historic Building', 'Elevator'],
        host: hostId,
        rating: 4.9,
        reviews: 187,
        featured: false,
        available: true,
      },
    ]);

    console.log(`✅ Created ${properties.length} properties`);

    // Create sample bookings
    console.log('📅 Creating bookings...');
    const bookings = await Booking.create([
      {
        property: properties[0]!._id as any,
        user: userId,
        checkIn: new Date('2025-12-15'),
        checkOut: new Date('2025-12-20'),
        guests: 4,
        totalPrice: 1650,
        status: 'confirmed',
      },
      {
        property: properties[1]!._id as any,
        user: userId,
        checkIn: new Date('2025-11-01'),
        checkOut: new Date('2025-11-05'),
        guests: 3,
        totalPrice: 876,
        status: 'completed',
      },
    ]);

    console.log(`✅ Created ${bookings.length} bookings`);

    console.log('\n✨ Database seeded successfully!\n');
    console.log('Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User:  john@example.com / password123');
    console.log('Host:  jane@example.com / password123');
    console.log('Admin: admin@example.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
