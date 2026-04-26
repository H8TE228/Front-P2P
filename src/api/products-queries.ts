import type { IProductsResponse } from "@/types";
import { api } from "./api";
import type { ItemDetail } from "./schema";

export const productsQueries = {
  getProducts: async (params?: unknown) => {
    const res = await api.get<IProductsResponse>("/listings/item/", { params });
    return res.data;
  },
  getProduct: async (id: string) => {
    const res = await api.get<ItemDetail>(`/listings/item/${id}`);
    return res.data;
  },
  getMyProducts: async () => {
    const res = await api.get<IProductsResponse>(`/listings/item/my/`);
    return res.data;
  },
};
