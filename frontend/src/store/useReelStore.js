import { create } from "zustand";
import api from "../utils/api.js";
import toast from "react-hot-toast";

const useReelStore = create((set) => ({
  // State
  reels: [],
  currentReel: null,
  listLoading: false,
  listError: null,
  detailLoading: false,
  detailError: null,
  creating: false,
  updating: false,
  deleting: false,
  pagination: { total: 0, page: 1, limit: 12, pages: 1 },

  // Fetch all reels with pagination
  fetchReels: async (params = {}) => {
    set({ listLoading: true, listError: null });
    try {
      const { data } = await api.get("/reel", { params });
      const items = data?.data?.items || data?.data || [];
      const pagination = data?.data?.pagination || {
        total: items.length,
        page: 1,
        limit: 12,
        pages: 1,
      };
      set({ reels: items, pagination, listLoading: false });
      return { ok: true, data: items };
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      set({ listError: msg, listLoading: false });
      return { ok: false, message: msg };
    }
  },

  // Fetch single reel by ID
  fetchReelById: async (id) => {
    set({ detailLoading: true, detailError: null });
    try {
      const { data } = await api.get(`/reel/${id}`);
      const reel = data?.data || data;
      set({ currentReel: reel, detailLoading: false });
      return { ok: true, data: reel };
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      set({ detailError: msg, detailLoading: false });
      return { ok: false, message: msg };
    }
  },

  // Create new reel
  createReel: async (formData) => {
    set({ creating: true });
    try {
      const { data } = await api.post("/reel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const reel = data?.data || data;
      set((state) => ({
        reels: [reel, ...state.reels],
        creating: false,
      }));
      toast.success("Reel created successfully");
      return { ok: true, data: reel };
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      set({ creating: false });
      toast.error(msg);
      return { ok: false, message: msg };
    }
  },

  // Update reel
  updateReel: async (id, formData) => {
    set({ updating: true });
    try {
      const { data } = await api.patch(`/reel/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = data?.data || data;
      set((state) => ({
        reels: state.reels.map((r) => (r._id === id ? updated : r)),
        currentReel:
          state.currentReel?._id === id ? updated : state.currentReel,
        updating: false,
      }));
      toast.success("Reel updated successfully");
      return { ok: true, data: updated };
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      set({ updating: false });
      toast.error(msg);
      return { ok: false, message: msg };
    }
  },

  // Delete reel
  deleteReel: async (id) => {
    set({ deleting: true });
    try {
      await api.delete(`/reel/${id}`);
      set((state) => ({
        reels: state.reels.filter((r) => r._id !== id),
        deleting: false,
      }));
      toast.success("Reel deleted successfully");
      return { ok: true };
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      set({ deleting: false });
      toast.error(msg);
      return { ok: false, message: msg };
    }
  },
}));

export { useReelStore };
