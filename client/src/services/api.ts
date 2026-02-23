import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get the Auth0 token function that was exposed globally
    const getAccessTokenSilently = (window as any).__getAccessTokenSilently;

    if (getAccessTokenSilently) {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get access token:', error);
        // Let the request proceed without token, server will return 401
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
