import axios from 'axios';

const API_BACK_URL = import.meta.env.VITE_BACK_URL;

export const loginAxios = axios.create({
  baseURL: API_BACK_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
  // Disable automatic transformations
  transformResponse: [(data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }]
});

// ---- Helper: read cookie ----
function readCookie(name) {
  if (typeof document === 'undefined') return undefined; // guard SSR
  const match = document.cookie.split('; ').find(c => c.startsWith(name + '='));
  return match?.split('=')[1];
}

// ---- Request interceptor (timing + CSRF header) ----
loginAxios.interceptors.request.use((config) => {
  config.metadata = { startTime: performance.now() };

  // Attach CSRF token from cookie if available
  const xsrf = readCookie('XSRF-TOKEN');
  if (xsrf) {
    config.headers['X-XSRF-TOKEN'] = xsrf;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// // Add request interceptor with timing
// loginAxios.interceptors.request.use((config) => {
//   config.metadata = { startTime: performance.now() };
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// Add response interceptor with timing
loginAxios.interceptors.response.use((response) => {
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