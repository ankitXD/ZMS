import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const useAuthStore = create((set, get) => ({
  // Core state
  me: null,
  authUser: null, // alias used by template
  loading: false,
  error: null,

  // Template loader flag
  isAuthCheck: false, // used by template

  loggingIn: false,
  loginError: null,
  registering: false,
  registerError: null,
  updating: false,
  updateError: null,
  changingPassword: false,
  logoutLoading: false,

  hasRole: (...roles) => {
    const me = get().me;
    if (!me?.role) return false;
    return roles.length ? roles.includes(me.role) : !!me.role;
  },

  // Template method: checks auth on app start
  checkAuth: async () => {
    set({ isAuthCheck: true });
    try {
      // Try current-user
      const res = await axiosInstance.get("/admin/current-user");
      const admin = res?.data?.data?.admin || res?.data?.data || null;
      set({ me: admin, authUser: admin });
      return { ok: true, data: admin };
    } catch {
      // Try refresh, then current-user again
      try {
        const r = await axiosInstance.post("/admin/refresh");
        const token =
          r?.data?.data?.accessToken || r?.data?.accessToken || r?.data?.token;
        if (token) setAuthHeader(token);
        const res2 = await axiosInstance.get("/admin/current-user");
        const admin = res2?.data?.data?.admin || res2?.data?.data || null;
        set({ me: admin, authUser: admin });
        return { ok: true, data: admin };
      } catch {
        set({ me: null, authUser: null });
        return { ok: false };
      }
    } finally {
      set({ isAuthCheck: false });
    }
  },

  fetchCurrentAdmin: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/current-user");
      const admin = data?.data?.admin || data?.data || null;
      set({ me: admin, authUser: admin });
      return { ok: true, data: admin };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ error: msg, me: null, authUser: null });
      return { ok: false, message: msg };
    } finally {
      set({ loading: false });
    }
  },

  refreshAccessToken: async () => {
    try {
      const { data } = await axiosInstance.post("/admin/refresh");
      const token =
        data?.data?.accessToken || data?.accessToken || data?.token || null;
      if (token) setAuthHeader(token);
      return { ok: true, token };
    } catch (e) {
      return { ok: false, message: e?.response?.data?.message || e.message };
    }
  },

  loginAdmin: async ({ email, password }) => {
    if (!email || !password) {
      const msg = "Email and password are required";
      toast.error(msg);
      return { ok: false, message: msg };
    }
    set({ loggingIn: true, loginError: null });
    try {
      const { data } = await axiosInstance.post("/admin/login", {
        email,
        password,
      });
      const admin = data?.data?.admin || data?.data || null;
      const token =
        data?.data?.accessToken || data?.accessToken || data?.token || null;
      if (token) setAuthHeader(token);
      set({ me: admin, authUser: admin });
      toast.success("Signed in");
      return { ok: true, data: admin };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ loginError: msg, me: null, authUser: null });
      toast.error(`Login failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ loggingIn: false });
    }
  },

  logoutAdmin: async () => {
    set({ logoutLoading: true });
    try {
      await axiosInstance.post("/admin/logout");
      setAuthHeader(null);
      set({ me: null, authUser: null });
      toast.success("Signed out");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Logout failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ logoutLoading: false });
    }
  },

  updateAccount: async (payload) => {
    set({ updating: true, updateError: null });
    try {
      const { data } = await axiosInstance.patch(
        "/admin/update-account",
        payload
      );
      const updated = data?.data?.admin || data?.data || get().me;
      set({ me: updated, authUser: updated });
      toast.success("Profile updated");
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ updateError: msg });
      toast.error(`Update failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ updating: false });
    }
  },

  changePassword: async ({ oldPassword, newPassword }) => {
    set({ changingPassword: true });
    try {
      await axiosInstance.post("/admin/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success("Password changed");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Password change failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ changingPassword: false });
    }
  },

  registerAdmin: async ({ name, email, password, role = "admin" }) => {
    set({ registering: true, registerError: null });
    try {
      const { data } = await axiosInstance.post("/admin/register", {
        name,
        email,
        password,
        role,
      });
      toast.success("Admin created");
      return { ok: true, data: data?.data };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ registerError: msg });
      toast.error(`Register failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ registering: false });
    }
  },
}));
