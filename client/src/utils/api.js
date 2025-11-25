const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API request wrapper
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiRequest('/auth/me'),
};

// Properties API
export const propertiesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/properties${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiRequest(`/properties/${id}`),

  create: (propertyData) =>
    apiRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    }),

  update: (id, propertyData) =>
    apiRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    }),

  delete: (id) =>
    apiRequest(`/properties/${id}`, {
      method: 'DELETE',
    }),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getUserBookings: () => apiRequest('/bookings/my-bookings'), // Matches /my-bookings route

  getById: (id) => apiRequest(`/bookings/${id}`),

  updateStatus: (id, status) =>
    apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  cancel: (id) =>
    apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    }),
};
