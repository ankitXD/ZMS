import { create } from "zustand";
import axiosInstance from "../utils/api.js";
import toast from "react-hot-toast";

const VISIT_SLOTS = ["morning", "afternoon", "evening"]; // keep in sync with backend

export const useOrderStore = create((set, get) => ({
  // ---------- PUBLIC CREATE ----------
  creating: false,
  createError: null,
  createdOrder: null,

  // ---------- ADMIN LIST ----------
  orders: [],
  pagination: { total: 0, page: 1, limit: 20, pages: 1 },
  ordersLoading: false,
  ordersError: null,

  // ---------- ADMIN DETAIL ----------
  order: null,
  orderLoading: false,
  orderError: null,

  // ---------- TABLE ----------
  tableRows: [],
  tableLoading: false,
  tableError: null,

  // ---------- MUTATIONS ----------
  updating: false,
  updatingStatus: false,
  deletingId: null,
  lastQrCodes: [],

  // ---------- ACTIONS ----------
  // Public: create order (status forced to pending by backend)
  createOrder: async ({
    visitDate, // NEW
    visitSlot, // NEW
    contact,
    items,
    paymentMethod,
    currency = "INR",
  }) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(visitDate || ""))) {
      const msg = "visitDate (YYYY-MM-DD) is required";
      toast.error(msg);
      return { ok: false, message: msg };
    }
    if (!VISIT_SLOTS.includes(String(visitSlot))) {
      const msg = "visitSlot must be morning, afternoon, or evening";
      toast.error(msg);
      return { ok: false, message: msg };
    }
    if (!contact?.email || !Array.isArray(items) || items.length === 0) {
      const msg = "Contact email and at least one item are required";
      toast.error(msg);
      return { ok: false, message: msg };
    }

    set({ creating: true, createError: null, createdOrder: null });
    try {
      const { data } = await axiosInstance.post("/order", {
        // FIXED path
        visitDate,
        visitSlot,
        contact,
        items,
        paymentMethod,
        currency,
      });
      const order = data?.data?.order || null;
      set({ createdOrder: order });
      toast.success("Order created (pending payment)");
      return { ok: true, data: order };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ createError: msg });
      toast.error(`Create failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ creating: false });
    }
  },

  // Admin: fetch orders list
  fetchOrders: async (params = {}) => {
    set({ ordersLoading: true, ordersError: null });
    try {
      const { data } = await axiosInstance.get("/order", { params });
      const payload = data?.data || {};
      set({
        orders: Array.isArray(payload.items) ? payload.items : [],
        pagination: payload.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          pages: 1,
        },
      });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ ordersError: msg });
      toast.error(`Failed to load orders: ${msg}`);
    } finally {
      set({ ordersLoading: false });
    }
  },

  // Admin: fetch single order
  fetchOrderById: async (id) => {
    if (!id) return;
    set({ orderLoading: true, orderError: null });
    try {
      const { data } = await axiosInstance.get(`/order/${id}`);
      set({ order: data?.data || null });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ orderError: msg });
      toast.error(`Failed to load order: ${msg}`);
    } finally {
      set({ orderLoading: false });
    }
  },

  // Admin: update order fields (contact/items/paymentMethod/status, etc.)
  updateOrder: async (id, payload) => {
    if (!id) return { ok: false, message: "Missing id" };
    set({ updating: true });
    try {
      const { data } = await axiosInstance.patch(`/order/${id}`, payload);
      const updated = data?.data;
      set({
        orders: get().orders.map((o) =>
          String(o._id) === String(id) ? updated : o
        ),
        order:
          get().order && String(get().order._id) === String(id)
            ? updated
            : get().order,
      });
      toast.success("Order updated");
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Update failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ updating: false });
    }
  },

  // Admin: update status (paid -> generates QR codes)
  updateOrderStatus: async (id, status) => {
    if (!id || !status) return { ok: false, message: "Missing id/status" };
    set({ updatingStatus: true, lastQrCodes: [] });
    try {
      const { data } = await axiosInstance.patch(`/order/${id}/status`, {
        status,
      });
      const updated = data?.data?.order;
      const qrCodes = data?.data?.qrCodes || [];
      set({
        lastQrCodes: qrCodes,
        orders: get().orders.map((o) =>
          String(o._id) === String(id) ? updated : o
        ),
        order:
          get().order && String(get().order._id) === String(id)
            ? updated
            : get().order,
      });
      toast.success("Order status updated");
      return { ok: true, data: { order: updated, qrCodes } };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Status update failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ updatingStatus: false });
    }
  },

  // Admin: delete order
  deleteOrder: async (id) => {
    if (!id) return { ok: false, message: "Missing id" };
    set({ deletingId: id });
    try {
      await axiosInstance.delete(`/order/${id}`);
      set({
        orders: get().orders.filter((o) => String(o._id) !== String(id)),
        order:
          get().order && String(get().order._id) === String(id)
            ? null
            : get().order,
      });
      toast.success("Order deleted");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Delete failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ deletingId: null });
    }
  },

  // Admin: table rows
  fetchOrdersTable: async () => {
    set({ tableLoading: true, tableError: null });
    try {
      const { data } = await axiosInstance.get("/order/table");
      set({ tableRows: Array.isArray(data?.data) ? data.data : [] });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ tableError: msg });
      toast.error(`Failed to load table: ${msg}`);
    } finally {
      set({ tableLoading: false });
    }
  },

  // Public/Staff: verify ticket by code (marks as used)
  verifyTicket: async (code) => {
    if (!code) return { ok: false, message: "Missing code" };
    try {
      const { data } = await axiosInstance.get("/order/verify", {
        params: { code },
      });
      toast.success("Ticket verified");
      return { ok: true, data: data?.data };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Verify failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  // Helpers
  clearCreatedOrder: () => set({ createdOrder: null, createError: null }),
}));
