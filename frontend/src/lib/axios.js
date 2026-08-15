import axios from "axios";
import { env } from "../config/env";

const api = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401, not a retry, and not an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { store } = await import("../store");
        const { refreshAccessToken } = await import("../features/auth/slice/authSlice");
        
        const resultAction = await store.dispatch(refreshAccessToken());
        
        if (refreshAccessToken.fulfilled.match(resultAction)) {
          const payload = resultAction.payload.data || resultAction.payload;
          const token = payload.accessToken || payload.token;
          
          if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            processQueue(null, token);
            return api(originalRequest);
          }
        }
        
        throw new Error("Failed to refresh access token");
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        try {
          const { store } = await import("../store");
          const { logout } = await import("../features/auth/slice/authSlice");
          store.dispatch(logout());
        } catch (e) {
          console.error("Failed to dispatch logout:", e);
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;