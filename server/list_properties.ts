import mongoose from 'mongoose';
import Property from './src/models/Property';
import 'dotenv/config';

const listProperties = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-app');
        console.log('Connected to MongoDB');

        const properties = await Property.find({}, 'name type price');
        console.log('Properties:', properties);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listProperties();
