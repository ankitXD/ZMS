import { create } from "zustand";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

export const useAnimalStore = create((set, get) => ({
  // ---------- LIST STATE ----------
  animals: [],
  pagination: { total: 0, page: 1, limit: 12, pages: 1 },
  listLoading: false,
  listError: null,

  // ---------- DETAIL STATE ----------
  animal: null,
  itemLoading: false,
  itemError: null,

  // ---------- MUTATION FLAGS ----------
  creating: false,
  updating: false,
  deletingId: null,

  // ---------- ACTIONS ----------
  fetchAnimals: async (params = {}) => {
    set({ listLoading: true, listError: null });
    try {
      const { data } = await axiosInstance.get("/animal", { params });
      const payload = data?.data || {};
      set({
        animals: Array.isArray(payload.items) ? payload.items : [],
        pagination: payload.pagination || {
          total: 0,
          page: 1,
          limit: 12,
          pages: 1,
        },
      });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ listError: msg });
      toast.error(`Failed to load animals: ${msg}`);
    } finally {
      set({ listLoading: false });
    }
  },

  fetchAnimalById: async (id) => {
    if (!id) return;
    set({ itemLoading: true, itemError: null });
    try {
      const { data } = await axiosInstance.get(`/animal/${id}`);
      set({ animal: data?.data || null });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      set({ itemError: msg });
      toast.error(`Failed to load animal: ${msg}`);
    } finally {
      set({ itemLoading: false });
    }
  },

  createAnimal: async ({
    name,
    description,
    title,
    category,
    imageFile, // optional File
    imageUrl, // optional string
  }) => {
    if (!name || !description) {
      toast.error("Name and description are required");
      return { ok: false, message: "Missing required fields" };
    }
    set({ creating: true });
    try {
      let res;
      if (imageFile) {
        const form = new FormData();
        form.append("name", name);
        if (title) form.append("title", title);
        if (category) form.append("category", category);
        form.append("description", description);
        form.append("image", imageFile); // backend expects 'image' if Multer is enabled
        res = await axiosInstance.post("/animal", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance.post("/animal", {
          name,
          title,
          category,
          description,
          imageUrl,
        });
      }
      const created = res?.data?.data;
      set({ animals: [created, ...get().animals] });
      toast.success("Animal created");
      return { ok: true, data: created };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Create failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ creating: false });
    }
  },

  updateAnimal: async (
    id,
    { name, description, title, category, imageFile, imageUrl }
  ) => {
    if (!id) return { ok: false, message: "Missing id" };
    set({ updating: true });
    try {
      let res;
      if (imageFile) {
        const form = new FormData();
        if (name != null) form.append("name", name);
        if (title != null) form.append("title", title);
        if (category != null) form.append("category", category);
        if (description != null) form.append("description", description);
        form.append("image", imageFile);
        res = await axiosInstance.patch(`/animal/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const payload = {};
        if (name != null) payload.name = name;
        if (title != null) payload.title = title;
        if (category != null) payload.category = category;
        if (description != null) payload.description = description;
        if (imageUrl != null) payload.imageUrl = imageUrl;
        res = await axiosInstance.patch(`/animals/${id}`, payload);
      }
      const updated = res?.data?.data;
      set({
        animals: get().animals.map((a) =>
          String(a._id) === String(id) ? updated : a
        ),
        animal:
          get().animal && String(get().animal._id) === String(id)
            ? updated
            : get().animal,
      });
      toast.success("Animal updated");
      return { ok: true, data: updated };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Update failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ updating: false });
    }
  },

  deleteAnimal: async (id) => {
    if (!id) return { ok: false, message: "Missing id" };
    set({ deletingId: id });
    try {
      await axiosInstance.delete(`/animal/${id}`);
      set({
        animals: get().animals.filter((a) => String(a._id) !== String(id)),
        animal:
          get().animal && String(get().animal._id) === String(id)
            ? null
            : get().animal,
      });
      toast.success("Animal deleted");
      return { ok: true };
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      toast.error(`Delete failed: ${msg}`);
      return { ok: false, message: msg };
    } finally {
      set({ deletingId: null });
    }
  },
}));
