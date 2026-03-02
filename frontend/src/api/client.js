import axios from "axios";
import { storage } from "../utils/storage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      storage.clearToken();
    }
    return Promise.reject(err);
  }
);

console.log("API baseURL:", import.meta.env.VITE_API_URL);