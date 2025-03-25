import axios from 'axios';

const API_BACK_URL = import.meta.env.VITE_BACK_URL;

export const loginAxios = axios.create({
  baseURL: API_BACK_URL,
  timeout: 2000, // Reduced timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  // Enable request compression
  decompress: true,
  // Connection pooling
  maxSockets: 50,
  keepAlive: true,
  // Disable automatic transformations
  transformResponse: [(data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }]
});

// Add request interceptor with timing
loginAxios.interceptors.request.use((config) => {
  config.metadata = { startTime: performance.now() };
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor with timing
loginAxios.interceptors.response.use((response) => {
  const duration = performance.now() - response.config.metadata.startTime;
  if (process.env.NODE_ENV === 'development') {
    const duration = performance.now() - response.config.metadata.startTime;
    if (duration > 150) {
      console.warn(`Slow request to ${response.config.url}: ${duration.toFixed(2)}ms`);
    }
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});