import { create } from "zustand";
import axiosInstance from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";

// Central RBAC matrix based on your backend routes/middlewares:
// - Only owner can register other admins
// - Animals: editor can create/update text; only admin/owner can upload images; delete is admin/owner
// - Orders/Payments: admin/owner can read/update; only owner can delete orders
// - Account: admin/owner can update profile; all logged-in roles can change password
export const PERMISSIONS = {
  "admin.register": ["owner"],
  "admins.read": ["owner", "admin"], // NEW

  "animals.create:text": ["owner", "admin", "editor"],
  "animals.create:file": ["owner", "admin"],
  "animals.update:text": ["owner", "admin", "editor"],
  "animals.update:file": ["owner", "admin"],
  "animals.delete": ["owner", "admin"],

  "orders.read": ["owner", "admin"],
  "orders.update": ["owner", "admin"],
  "orders.delete": ["owner"],

  "payments.read": ["owner", "admin"],

  "account.update": ["owner", "admin"],
  "account.password": ["owner", "admin", "editor"],
};

const getCurrentRole = () =>
  (useAuthStore.getState()?.authUser?.role || "guest").toLowerCase();

export const useAdminsStore = create((set, get) => ({
  // Derived role (read from auth store on demand)
  role: () => getCurrentRole(),

  // Permission checks
  hasRole: (...roles) => roles.map(String).includes(getCurrentRole()),
  can: (permission) => {
    const role = getCurrentRole();
    const allowed = PERMISSIONS[permission] || [];
    return allowed.includes(role);
  },
  // Convenience helpers for common UI gates
  canRegisterUsers: () => get().can("admin.register"),
  canSeeAdmins: () => get().can("admins.read"), // NEW
  canUploadAnimalImage: () => get().can("animals.create:file"),
  canEditAnimalText: () => get().can("animals.update:text"),
  canDeleteAnimal: () => get().can("animals.delete"),
  canSeeOrders: () => get().can("orders.read"),
  canManagePayments: () => get().can("payments.read"),
  canDeleteOrder: () => get().can("orders.delete"),
  canUpdateAccount: () => get().can("account.update"),

  // List state (admins)
  admins: [], // NEW
  pagination: null, // NEW { total, page, limit, pages }
  listLoading: false, // NEW
  listError: null, // NEW

  // Loading/error states
  registering: false,
  updatingAccount: false,
  changingPassword: false,
  error: null,

  // API: GET all admins (owner/admin)
  fetchAdmins: async (params = {}) => {
    if (!get().can("admins.read")) {
      return { ok: false, message: "Forbidden: insufficient role" };
    }
    set({ listLoading: true, listError: null });
    try {
      const defaultParams = {
        role: "owner,admin,editor",
        sort: "-createdAt",
        page: 1,
        limit: 20,
      };
      const { data } = await axiosInstance.get("/admin/admins", {
        params: { ...defaultParams, ...params },
      });
      const payload = data?.data || {};
      set({
        admins: payload.items || [],
        pagination: payload.pagination || null,
      });
      return { ok: true, data: payload, message: data?.message };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ listError: msg });
      return { ok: false, message: msg };
    } finally {
      set({ listLoading: false });
    }
  },

  resetAdmins: () => set({ admins: [], pagination: null, listError: null }), // NEW

  // API: Owner-only — register a new admin user
  registerAdmin: async ({ name, email, password, role = "admin" }) => {
    if (!get().can("admin.register")) {
      return {
        ok: false,
        message: "Forbidden: only owner can register admins",
      };
    }
    if (!name || !email || !password) {
      return { ok: false, message: "Name, email and password are required" };
    }
    set({ registering: true, error: null });
    try {
      const { data } = await axiosInstance.post("/admin/register", {
        name,
        email,
        password,
        role,
      });
      return { ok: true, data: data?.data, message: data?.message };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ error: msg });
      return { ok: false, message: msg };
    } finally {
      set({ registering: false });
    }
  },

  // API: Update own account — allowed for admin/owner per backend
  updateAccount: async ({ name, email }) => {
    if (!get().can("account.update")) {
      return { ok: false, message: "Forbidden: insufficient role" };
    }
    if (!name || !email) {
      return { ok: false, message: "Name and email are required" };
    }
    set({ updatingAccount: true, error: null });
    try {
      const { data } = await axiosInstance.patch("/admin/update-account", {
        name,
        email,
      });
      // Sync auth store user
      useAuthStore.setState({ authUser: data?.data || null });
      return { ok: true, data: data?.data, message: data?.message };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ error: msg });
      return { ok: false, message: msg };
    } finally {
      set({ updatingAccount: false });
    }
  },

  // API: Change own password — allowed for any logged-in role (owner/admin/editor)
  changePassword: async ({ currentPassword, newPassword }) => {
    if (!get().can("account.password")) {
      return { ok: false, message: "Forbidden: login required" };
    }
    if (!currentPassword || !newPassword) {
      return {
        ok: false,
        message: "Both current and new passwords are required",
      };
    }
    set({ changingPassword: true, error: null });
    try {
      const { data } = await axiosInstance.post("/admin/change-password", {
        currentPassword,
        newPassword,
      });
      return { ok: true, data: data?.data, message: data?.message };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ error: msg });
      return { ok: false, message: msg };
    } finally {
      set({ changingPassword: false });
    }
  },

  // Utility: list of permissions allowed for current role (for debugging/UI)
  listPermissions: () => {
    const role = getCurrentRole();
    return Object.entries(PERMISSIONS)
      .filter(([, roles]) => roles.includes(role))
      .map(([perm]) => perm);
  },
}));
