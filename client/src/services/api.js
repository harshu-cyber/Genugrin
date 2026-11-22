import axios from 'axios';

// Default API URL from environment variable or fallback to local backend port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('genugrin_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on admin routes, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('genugrin_admin_token');
        localStorage.removeItem('genugrin_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// High-level API Service methods
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/products/${id}`),
  deleteImage: (id, publicId) => api.delete(`/products/${id}/images/${publicId}`),
  toggleStatus: (id, data) => api.patch(`/products/${id}/status`, data),
};

export const categoryService = {
  getAll: (params) => api.get('/categories', { params }),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (formData) => api.post('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const enquiryService = {
  submit: (data) => api.post('/enquiries', data),
  getAll: (params) => api.get('/enquiries', { params }),
  getById: (id) => api.get(`/enquiries/${id}`),
  update: (id, data) => api.put(`/enquiries/${id}`, data),
  delete: (id) => api.delete(`/enquiries/${id}`),
  exportCSVUrl: (params) => {
    const query = new URLSearchParams(params).toString();
    return `${API_BASE_URL}/enquiries/export/csv?${query}`;
  },
};

export const contentService = {
  getAll: () => api.get('/content'),
  getBySection: (sectionKey) => api.get(`/content/${sectionKey}`),
  updateSection: (sectionKey, data) => api.put(`/content/${sectionKey}`, data),
};

export const settingsService = {
  get: () => api.get('/settings'),
  update: (formData) => api.put('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
