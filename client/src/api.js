import axios from 'axios';

// Choose baseURL based on environment:
// - During dev (Vite) keep '/api' to use dev proxy
// - In production use VITE_API_BASE if provided
// - When running inside Capacitor (file://), set VITE_LOCAL_IP to your machine IP (for emulator/device testing)
const getBaseURL = () => {
  if (import.meta.env.DEV) return '/api';
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
  if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
    const localIp = import.meta.env.VITE_LOCAL_IP; // set this in your environment (e.g. 192.168.1.10)
    if (localIp) return `http://${localIp}:5000`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
