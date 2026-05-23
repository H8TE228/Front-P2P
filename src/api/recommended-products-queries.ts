import { api } from "./api";

export const recommendedProductsQueries = {
  getRecommendedByIdProducts: async (id: string, params?: unknown) => {
    const res = await api.get(
      `/listings/item/${id}/recommendations/
`,
      { params },
    );
    return res.data;
  },
  getSimilarByIdProducts: async (id: string, params?: unknown) => {
    const res = await api.get(`/listings/item/${id}/similar/`, { params });
    return res.data;
  },
  getRecommendedProducts: async (params?: unknown) => {
    const res = await api.get("/listings/item/", { params });
    return res.data;
  },
};
