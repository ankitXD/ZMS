import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send cookies
});

// (optional) auto-refresh once on 401 and retry
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config ?? {};
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post("/admin/refresh"); // server sets new access cookie
        return api(original);             // retry request
      } catch (_) {
        // fall through
      }
    }
    return Promise.reject(err);
  }
);

export default api;
