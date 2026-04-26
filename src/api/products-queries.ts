import { api } from "./api";

export const productsQueries = {
  getProducts: async (params?: unknown) => {
    const res = await api.get("listings/item/", { params });
    return res.data;
  },
  getProduct: async (id: string) => {
    const res = await api.get(`listings/item/${id}/`);
    return res.data;
  },
  getListingTypes: async (params?: unknown) => {
    const res = await api.get("listings/type/", { params });
    return res.data;
  },
  getListingItem: async (id: number) => {
    const res = await api.get(`listings/item/${id}/`);
    return res.data;
  },
  createListingItem: async (data: unknown) => {
    const res = await api.post(`listings/item/`, data);
    return res.data;
  },
  updateListingItem: async (id: number, data: unknown) => {
    const res = await api.put(`listings/item/${id}/`, data);
    return res.data;
  },
  patchListingItem: async (id: number, data: unknown) => {
    const res = await api.patch(`listings/item/${id}/`, data);
    return res.data;
  },
  deleteListingItem: async (id: number) => {
    const res = await api.delete(`listings/item/${id}/`);
    return res.data;
  },
};
