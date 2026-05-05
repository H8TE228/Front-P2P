import { favoriteItemsQueries } from "@/api";
import type { ListingsFavoriteItemsListParams } from "@/api/schema";
import { useQuery } from "@tanstack/react-query";

export function useFavoriteItems(params?: ListingsFavoriteItemsListParams) {
  return useQuery({
    queryKey: ["favorite-items", params],
    queryFn: () => favoriteItemsQueries.getFavoriteItems(params),
  });
}

