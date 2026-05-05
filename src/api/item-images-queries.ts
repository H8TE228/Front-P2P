import type { ListingsItemImagesListParams, PaginatedItemImageList } from "./schema";
import { api } from "./api";

export const itemImagesQueries = {
  getItemImages: async (params?: ListingsItemImagesListParams) => {
    const res = await api.get<PaginatedItemImageList>("/listings/item-images/", {
      params,
    });
    return res.data;
  },
  createItemImage: async (data: FormData) => {
    const res = await api.post("/listings/item-images/", data);
    return res.data;
  },
};

