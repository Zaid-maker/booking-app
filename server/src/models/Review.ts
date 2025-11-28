import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  cleanliness: number;
  accuracy: number;
  checkIn: number;
  communication: number;
  location: number;
  value: number;
  images: string[];
  helpful: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    cleanliness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    checkIn: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    communication: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    location: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 5,
        message: 'Maximum 5 images allowed per review',
      },
    },
    helpful: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying reviews
reviewSchema.index({ property: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

// Prevent duplicate reviews for same booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Update property rating after review save
reviewSchema.post('save', async function () {
  const Review = mongoose.model<IReview>('Review');
  const Property = mongoose.model('Property');

  const stats = await Review.aggregate([
    { $match: { property: this.property } },
    {
      $group: {
        _id: '$property',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(this.property, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviews: stats[0].totalReviews,
    });
  }
});

// Update property rating after review delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Review = mongoose.model<IReview>('Review');
    const Property = mongoose.model('Property');

    const stats = await Review.aggregate([
      { $match: { property: doc.property } },
      {
        $group: {
          _id: '$property',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Property.findByIdAndUpdate(doc.property, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviews: stats[0].totalReviews,
      });
    } else {
      await Property.findByIdAndUpdate(doc.property, {
        rating: 0,
        reviews: 0,
      });
    }
  }
});

export default mongoose.model<IReview>('Review', reviewSchema);
