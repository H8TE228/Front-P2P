import type { IProductsResponse } from "@/types";
import { api } from "./api";
import type { ItemDetail } from "./schema";

export const productsQueries = {
  getProducts: async (params?: unknown) => {
    const res = await api.get<IProductsResponse>("/listings/item/", { params });
    return res.data;
  },
  getProduct: async (id: string) => {
    const res = await api.get<ItemDetail>(`/listings/item/${id}/`);
    return res.data;
  },
  getListingTypes: async (params?: unknown) => {
    const res = await api.get("/listings/type/", { params });
    return res.data;
  },
  createListingItem: async (data: unknown) => {
    const res = await api.post(`/listings/item/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
  updateListingItem: async (id: number, data: unknown) => {
    const res = await api.put(`/listings/item/${id}/`, data);
    return res.data;
  },
  patchListingItem: async (id: number, data: unknown) => {
    const res = await api.patch(`/listings/item/${id}/`, data);
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/listings/item/${id}/`);
    return res.data;
  },
  getMyProducts: async () => {
    const res = await api.get<IProductsResponse>(`/listings/item/my/`);
    return res.data;
  },
};
