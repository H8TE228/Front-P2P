import { api } from "./api";

export const productsQueries = {
  getProducts: async (params?: unknown) => {
    const res = await api.get("", { params });
    return res.data;
  },
  getProduct: async (id: string) => {
    const res = await api.get(`/${id}`);
    return res.data;
  },
};
