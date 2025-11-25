import type { Context } from 'hono';
import Property from '../models/Property';

// Get all properties
export const getAllProperties = async (c: Context) => {
  try {
    const { location, minPrice, maxPrice, beds, sortBy } = c.req.query();

    let query: any = { available: true };

    // Apply filters
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    if (beds) {
      query.beds = { $gte: Number(beds) };
    }

    // Apply sorting
    let sort: any = {};
    if (sortBy === 'price-low') {
      sort.price = 1;
    } else if (sortBy === 'price-high') {
      sort.price = -1;
    } else if (sortBy === 'rating') {
      sort.rating = -1;
    } else {
      sort.featured = -1;
    }

    const properties = await Property.find(query).sort(sort).populate('host', 'firstName lastName');

    return c.json({
      count: properties.length,
      properties,
    });
  } catch (error: any) {
    console.error('Get properties error:', error);
    return c.json({ error: error.message || 'Failed to get properties' }, 500);
  }
};

// Get single property
export const getPropertyById = async (c: Context) => {
  try {
    const { id } = c.req.param();

    const property = await Property.findById(id).populate('host', 'firstName lastName email');

    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    return c.json({ property });
  } catch (error: any) {
    console.error('Get property error:', error);
    return c.json({ error: error.message || 'Failed to get property' }, 500);
  }
};

// Create property
export const createProperty = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();

    const property = await Property.create({
      ...data,
      host: userId,
    });

    return c.json(
      {
        message: 'Property created successfully',
        property,
      },
      201
    );
  } catch (error: any) {
    console.error('Create property error:', error);
    return c.json({ error: error.message || 'Failed to create property' }, 500);
  }
};

// Update property
export const updateProperty = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const userId = c.get('userId');
    const data = await c.req.json();

    const property = await Property.findById(id);

    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    // Check if user is the host
    if (property.host.toString() !== userId) {
      return c.json({ error: 'Not authorized to update this property' }, 403);
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return c.json({
      message: 'Property updated successfully',
      property: updatedProperty,
    });
  } catch (error: any) {
    console.error('Update property error:', error);
    return c.json({ error: error.message || 'Failed to update property' }, 500);
  }
};

// Delete property
export const deleteProperty = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const userId = c.get('userId');

    const property = await Property.findById(id);

    if (!property) {
      return c.json({ error: 'Property not found' }, 404);
    }

    // Check if user is the host
    if (property.host.toString() !== userId) {
      return c.json({ error: 'Not authorized to delete this property' }, 403);
    }

    await Property.findByIdAndDelete(id);

    return c.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    console.error('Delete property error:', error);
    return c.json({ error: error.message || 'Failed to delete property' }, 500);
  }
};
