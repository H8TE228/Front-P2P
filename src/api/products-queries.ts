import { api } from "./api";

export const productsQueries = {
  getProducts: async (params?: unknown) => {
    const res = await api.get("", { params });
    return res.data;
  },
};
