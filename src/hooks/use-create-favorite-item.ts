import { favoriteItemsQueries } from "@/api";
import type { FavoriteItemCreate } from "@/api/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFavoriteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FavoriteItemCreate) =>
      favoriteItemsQueries.createFavoriteItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-items"] });
    },
    onError: () => {},
  });
}

