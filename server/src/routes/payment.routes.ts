import { Hono } from 'hono';
import Stripe from 'stripe';
import { authMiddleware } from '../middleware/auth';
import Payment from '../models/Payment';
import Property from '../models/Property';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-01-27.acacia',
});

const paymentRoutes = new Hono();

paymentRoutes.post('/create-payment-intent', authMiddleware, async (c) => {
    try {
        const { propertyId } = await c.req.json();
        const userId = c.get('user').userId;

        const property = await Property.findById(propertyId);
        if (!property) {
            return c.json({ error: 'Property not found' }, 404);
        }

        if (property.type !== 'sale') {
            return c.json({ error: 'Property is not for sale' }, 400);
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(property.price * 100), // Stripe expects amount in cents
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                propertyId: property._id.toString(),
                userId: userId,
            },
        });

        // Create a pending payment record
        await Payment.create({
            user: userId,
            property: property._id,
            amount: property.price,
            currency: 'usd',
            status: 'pending',
            stripePaymentIntentId: paymentIntent.id,
        });

        return c.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        return c.json({ error: 'Failed to create payment intent' }, 500);
    }
});

export default paymentRoutes;
