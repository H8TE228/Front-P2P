import { api } from "./api";
import type {
  FavoriteItem,
  FavoriteItemCreate,
  ListingsFavoriteItemsListParams,
  PaginatedFavoriteItemList,
} from "./schema";

export const favoriteItemsQueries = {
  getFavoriteItems: async (params?: ListingsFavoriteItemsListParams) => {
    const res = await api.get<PaginatedFavoriteItemList>(
      "/listings/favorite-items/",
      { params },
    );
    return res.data;
  },
  getFavoriteItemById: async (id: number | string) => {
    const res = await api.get<FavoriteItem>(`/listings/favorite-items/${id}/`);
    return res.data;
  },
  createFavoriteItem: async (id: number | string) => {
    const res = await api.post<FavoriteItem>("/listings/favorite-items/", {
      item_id: Number(id),
    });
    return res.data;
  },
  putFavoriteItem: async (id: number | string, payload: FavoriteItemCreate) => {
    const res = await api.put<FavoriteItem>(
      `/listings/favorite-items/${id}/`,
      payload,
    );
    return res.data;
  },
  patchFavoriteItem: async (
    id: number | string,
    payload: Partial<FavoriteItemCreate>,
  ) => {
    const res = await api.patch<FavoriteItem>(
      `/listings/favorite-items/${id}/`,
      payload,
    );
    return res.data;
  },
  deleteFavoriteItem: async (id: number | string) => {
    const res = await api.delete<void>(`/listings/favorite-items/${id}/`);
    return res.data;
  },
};
