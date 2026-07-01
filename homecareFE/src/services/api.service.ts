import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import KeycloakService from './keycloak';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Gateway Address
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Check all outgoing requests to attach the token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const kc = KeycloakService.keycloak;

    // If user is authenticated, automatically check and refresh the token if it expires in less than 30s
    if (kc.authenticated) {
      try {
        await kc.updateToken(30);
      } catch (error) {
        console.error("Unable to refresh token automatically before request:", error);
        kc.login(); // Redirect to login if token is completely expired
        return Promise.reject(new Error("Session expired, redirecting to login..."));
      }
    }

    // Attach JWT Token to Authorization Header
    const token = kc.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor: Handle 401, 403 errors globally and automatically refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.config && (error.config as any).skipToast) {
      return Promise.reject(error);
    }
    const originalRequest = error.config as any; // Cast as any to attach dynamic _retry property

    // If receiving 401 (Unauthorized) from Gateway/Microservice and haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const kc = KeycloakService.keycloak;

      // If user is not authenticated (a guest), do not attempt to refresh or redirect to login.
      // Let the page capture the error and gracefully fall back to mock data.
      if (!kc.authenticated) {
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Mark as retried to avoid infinite loops
      console.warn("Received 401 error from server, refreshing token via keycloak.updateToken...");

      try {
        // Pass -1 to force Keycloak to refresh the token regardless of remaining validity
        const refreshed = await kc.updateToken(-1); //bắt buộc làm mới

        if (refreshed) {
          console.log("Token successfully updated after 401 error!");
        }

        // Attach the new token and retry the original Request
        if (kc.token) {
          originalRequest.headers.Authorization = `Bearer ${kc.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refreshing token after 401 error failed, redirecting to login:", refreshError);
        kc.login();
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 (Forbidden access)
    if (error.response?.status === 403) {
      const serverData = error.response?.data as any;
      if (serverData?.error === 'BLOCKED') {
        window.location.href = '/blocked';
        return Promise.reject(error);
      }
      console.error("You do not have permission to access this resource!");
      toast.error("Bạn không có quyền truy cập tài nguyên này!");
    } else {
      // Display other server errors using react-hot-toast
      const serverData = error.response?.data as any;
      const message = serverData?.message || serverData?.error || error.message || "Đã có lỗi xảy ra!";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;