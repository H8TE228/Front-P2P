import { itemImagesQueries } from "@/api";
import type { ListingsItemImagesListParams } from "@/api/schema";
import { useQuery } from "@tanstack/react-query";

export function useItemImages(params?: ListingsItemImagesListParams) {
  return useQuery({
    queryKey: ["item-images", params],
    queryFn: () => itemImagesQueries.getItemImages(params),
  });
}

