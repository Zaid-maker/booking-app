import type { Context } from 'hono';
import Booking from '../models/Booking';
import Property from '../models/Property';

// Create booking
export const createBooking = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { propertyId, checkIn, checkOut, guests, totalPrice } = await c.req.json();

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    // Check if property is available
    if (!property.available) {
      return c.json({ error: 'Property is not available' }, 400);
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      property: propertyId,
      status: { $nin: ['cancelled'] },
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) },
        },
      ],
    });

    if (overlappingBooking) {
      return c.json({ error: 'Property is already booked for these dates' }, 400);
    }

    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      user: userId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'name location images price')
      .populate('user', 'firstName lastName email');

    return c.json(
      {
        message: 'Booking created successfully',
        booking: populatedBooking,
      },
      201
    );
  } catch (error: any) {
    console.error('Create booking error:', error);
    return c.json({ error: error.message || 'Failed to create booking' }, 500);
  }
};

// Get user bookings
export const getUserBookings = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { status } = c.req.query();

    let query: any = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('property', 'name location images price')
      .sort({ createdAt: -1 });

    return c.json({
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return c.json({ error: error.message || 'Failed to get bookings' }, 500);
  }
};

// Get single booking
export const getBookingById = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { id } = c.req.param();

    const booking = await Booking.findById(id)
      .populate('property', 'name location images price amenities')
      .populate('user', 'firstName lastName email');

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== userId) {
      return c.json({ error: 'Not authorized to view this booking' }, 403);
    }

    return c.json({ booking });
  } catch (error: any) {
    console.error('Get booking error:', error);
    return c.json({ error: error.message || 'Failed to get booking' }, 500);
  }
};

// Update booking status
export const updateBookingStatus = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { id } = c.req.param();
    const { status } = await c.req.json();

    const booking = await Booking.findById(id);

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    // Check if user owns this booking
    if (booking.user.toString() !== userId) {
      return c.json({ error: 'Not authorized to update this booking' }, 403);
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('property', 'name location images price')
      .populate('user', 'firstName lastName email');

    return c.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    return c.json({ error: error.message || 'Failed to update booking' }, 500);
  }
};

// Cancel booking
export const cancelBooking = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { id } = c.req.param();

    const booking = await Booking.findById(id);

    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    // Check if user owns this booking
    if (booking.user.toString() !== userId) {
      return c.json({ error: 'Not authorized to cancel this booking' }, 403);
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return c.json({ error: `Cannot cancel a ${booking.status} booking` }, 400);
    }

    booking.status = 'cancelled';
    await booking.save();

    return c.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    return c.json({ error: error.message || 'Failed to cancel booking' }, 500);
  }
};
