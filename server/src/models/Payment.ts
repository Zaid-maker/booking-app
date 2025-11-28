import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    user: mongoose.Types.ObjectId;
    property: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed';
    stripePaymentIntentId: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            default: 'usd',
        },
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed'],
            default: 'pending',
        },
        stripePaymentIntentId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
