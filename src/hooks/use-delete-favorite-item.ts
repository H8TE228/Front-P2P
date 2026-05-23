import { favoriteItemsQueries } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFavoriteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      favoriteItemsQueries.deleteFavoriteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-items"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {},
  });
}
