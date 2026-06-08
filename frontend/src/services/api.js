import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const authAPI = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Product APIs
export const productAPI = {
  getAll: async (params = {}) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/products', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

// Cart APIs
export const cartAPI = {
  getCart: async () => {
    const res = await api.get('/cart');
    return res.data;
  },
  addToCart: async (productId, quantity) => {
    const res = await api.post('/cart', { productId, quantity });
    return res.data;
  },
  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await api.delete('/cart/clear');
    return res.data;
  },
};

// User APIs
export const userAPI = {
  getAll: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export default api;
