import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  description: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  guests: number;
  images: string[];
  amenities: string[];
  host: mongoose.Types.ObjectId;
  rating: number;
  reviews: number;
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    beds: {
      type: Number,
      required: [true, 'Number of beds is required'],
      min: [1, 'Must have at least 1 bed'],
    },
    baths: {
      type: Number,
      required: [true, 'Number of baths is required'],
      min: [1, 'Must have at least 1 bath'],
    },
    guests: {
      type: Number,
      required: [true, 'Maximum guests is required'],
      min: [1, 'Must accommodate at least 1 guest'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one image is required',
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
    },
    reviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
propertySchema.index({ location: 1, price: 1, rating: -1 });

export default mongoose.model<IProperty>('Property', propertySchema);
