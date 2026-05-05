import type { FavoriteItem } from "./favoriteItem";

export interface PaginatedFavoriteItemList {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: FavoriteItem[];
}

