// Alternative API service using fetch instead of axios
// This avoids webpack polyfill issues

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      // Return a proper response object instead of undefined
      return { data: { success: false, message: 'Unauthorized' } };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  changePassword: (passwordData) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),
};

// Tasks API
export const tasksAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return apiRequest(endpoint);
  },
  getById: (id) => apiRequest(`/tasks/${id}`),
  create: (taskData) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  update: (id, taskData) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }),
  delete: (id) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  }),
  getStats: () => apiRequest('/tasks/stats'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`),
  create: (categoryData) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  createDefaults: () => apiRequest('/categories/defaults', {
    method: 'POST',
  }),
  update: (id, categoryData) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  delete: (id) => apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  }),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return apiRequest(endpoint);
  },
  getById: (id) => apiRequest(`/users/${id}`),
  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
  // Remove the non-existent endpoint
  getStats: () => apiRequest('/tasks/stats'), // Use tasks stats instead
};

// Health check API
export const healthAPI = {
  check: () => apiRequest('/health'),
};

// Contacts API
export const contactsAPI = {
  create: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/contacts?${queryString}` : '/contacts';
    return apiRequest(endpoint);
  },
  getById: (id) => apiRequest(`/contacts/${id}`),
  update: (id, contactData) => apiRequest(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contactData),
  }),
  delete: (id) => apiRequest(`/contacts/${id}`, {
    method: 'DELETE',
  }),
  getStats: () => apiRequest('/contacts/stats'),
};