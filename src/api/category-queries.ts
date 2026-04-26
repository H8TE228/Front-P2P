import type { ICategoriesResponse } from "@/types";
import { api } from "./api";
import type { Category } from "./schema";

export const categoryQueries = {
  getCategories: async (params?: unknown) => {
    const res = await api.get<ICategoriesResponse>("/listings/category/", {
      params,
    });
    return res.data;
  },
  getCategory: async (id: string) => {
    const res = await api.get<Category>(`/listings/category/${id}`);
    return res.data;
  },
  createCategory: async (data: unknown) => {
    const res = await api.post<unknown>("/listings/category/", data);
    return res.data;
  },
};
