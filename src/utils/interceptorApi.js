import axios from "axios";


const API_BACK_URL = import.meta.env.VITE_BACK_URL;
// Create an axios instance
export const authApi = axios.create({
    baseURL: API_BACK_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  
  // Add request interceptor to show loading state
  authApi.interceptors.request.use(
    (config) => {
      // Add timestamp to track request duration
      config.metadata = { startTime: new Date() };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor to handle common responses
  authApi.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const duration = new Date() - response.config.metadata.startTime;
      if (duration > 3000) { // Log slow requests (over 3 seconds)
        console.warn(`Slow request to ${response.config.url}: ${duration}ms`);
      }
      return response;
    },
    (error) => {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
      }
      return Promise.reject(error);
    }
  );
