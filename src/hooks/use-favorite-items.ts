import { favoriteItemsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useFavoriteItems(params?: any) {
  return useQuery({
    queryKey: ["favorite-items", params],
    queryFn: () => favoriteItemsQueries.getFavoriteItems(params),
  });
}
