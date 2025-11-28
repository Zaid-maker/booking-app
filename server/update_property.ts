import mongoose from 'mongoose';
import Property from './src/models/Property';
import 'dotenv/config';

const updateProperty = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-app');
        console.log('Connected to MongoDB');

        const property = await Property.findOne();
        if (property) {
            property.type = 'sale';
            await property.save();
            console.log(`Updated property "${property.name}" (${property._id}) to type: sale`);
        } else {
            console.log('No properties found');
        }

        console.log('Closing connection...');
        await mongoose.connection.close();
        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateProperty();
