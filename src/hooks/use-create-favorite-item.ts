import { favoriteItemsQueries } from "@/api";
import type { FavoriteItemCreate } from "@/api/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFavoriteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      favoriteItemsQueries.createFavoriteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-items"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {},
  });
}
