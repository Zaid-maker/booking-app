import type { Context } from 'hono';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

// Register new user
export const register = async (c: Context) => {
  try {
    const { firstName, lastName, email, password } = await c.req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate token
    const token = generateToken((user._id as any).toString(), user.email);

    return c.json(
      {
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      201
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return c.json({ error: error.message || 'Registration failed' }, 500);
  }
};

// Login user
export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Generate token
    const token = generateToken((user._id as any).toString(), user.email);

    return c.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return c.json({ error: error.message || 'Login failed' }, 500);
  }
};

// Get current user
export const getMe = async (c: Context) => {
  try {
    const userId = c.get('userId');

    const user = await User.findById(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ error: error.message || 'Failed to get user' }, 500);
  }
};
