import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useMessageStore = create((set, get) => ({
  // ---------- PUBLIC CONTACT STATE ----------
  submitting: false,
  submitError: null,
  submitSuccess: false,

  // ---------- ADMIN LIST STATE ----------
  messages: [],
  pagination: { total: 0, page: 1, limit: 20, pages: 1 },
  loading: false,
  error: null,

  // ---------- ADMIN DETAIL STATE ----------
  message: null,
  messageLoading: false,
  messageError: null,

  // ---------- PUBLIC ACTIONS ----------
  submitMessage: async ({ name, email, subject, body, message }) => {
    // body/message: either is accepted by backend; we send as `body`
    const payload = {
      name,
      email,
      subject,
      body: body ?? message,
    };
    if (!payload.name || !payload.body) {
      toast.error("Name and message are required");
      return { ok: false, message: "Name and message are required" };
    }

    set({ submitting: true, submitError: null, submitSuccess: false });
    try {
      await axiosInstance.post("/message", payload, {
        headers: { "Content-Type": "application/json" },
      });
      set({ submitSuccess: true });
      toast.success("Message sent");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ submitError: msg });
      toast.error(`Failed to send message: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ submitting: false });
    }
  },

  // ---------- ADMIN ACTIONS ----------
  fetchMessages: async (params = {}) => {
    // params: { q, status, email, handledBy, page, limit, sort }
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/message", { params });
      const payload = data?.data || {};
      set({
        messages: Array.isArray(payload.items) ? payload.items : [],
        pagination: payload.pagination || {
          total: 0,
          page: 1,
          limit: 20,
          pages: 1,
        },
      });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ error: msg });
      toast.error(`Failed to load messages: ${msg}`);
    } finally {
      set({ loading: false });
    }
  },

  fetchMessageById: async (id) => {
    if (!id) return;
    set({ messageLoading: true, messageError: null });
    try {
      const { data } = await axiosInstance.get(`/message/${id}`);
      set({ message: data?.data || null });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ messageError: msg });
      toast.error(`Failed to load message: ${msg}`);
    } finally {
      set({ messageLoading: false });
    }
  },

  updateMessage: async (id, payload) => {
    // payload may include: { status, handledBy, subject, body }
    if (!id) return { ok: false, message: "Missing id" };
    try {
      const { data } = await axiosInstance.patch(`/message/${id}`, payload);
      const updated = data?.data;

      set({
        messages: get().messages.map((m) =>
          String(m._id) === String(id) ? updated : m
        ),
        message:
          get().message && String(get().message._id) === String(id)
            ? updated
            : get().message,
      });
      toast.success("Message updated");
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Update failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  markRead: async (id) => {
    if (!id) return { ok: false, message: "Missing id" };
    try {
      const { data } = await axiosInstance.post(`/message/${id}/read`);
      const updated = data?.data;
      set({
        messages: get().messages.map((m) =>
          String(m._id) === String(id) ? updated : m
        ),
        message:
          get().message && String(get().message._id) === String(id)
            ? updated
            : get().message,
      });
      toast.success("Marked as read");
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Mark read failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  archiveMessage: async (id) => {
    if (!id) return { ok: false, message: "Missing id" };
    try {
      const { data } = await axiosInstance.post(`/message/${id}/archive`);
      const updated = data?.data;
      set({
        messages: get().messages.map((m) =>
          String(m._id) === String(id) ? updated : m
        ),
        message:
          get().message && String(get().message._id) === String(id)
            ? updated
            : get().message,
      });
      toast.success("Archived");
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Archive failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  deleteMessage: async (id) => {
    if (!id) return { ok: false, message: "Missing id" };
    try {
      await axiosInstance.delete(`/message/${id}`);
      set({
        messages: get().messages.filter((m) => String(m._id) !== String(id)),
        message:
          get().message && String(get().message._id) === String(id)
            ? null
            : get().message,
      });
      toast.success("Deleted");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Delete failed: ${msg}`);
      return { ok: false, message: msg };
    }
  },

  // ---------- HELPERS ----------
  clearMessageDetail: () => set({ message: null, messageError: null }),
}));
