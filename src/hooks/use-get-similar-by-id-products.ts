import { recommendedProductsQueries } from "@/api/recommended-products-queries";
import { useQuery } from "@tanstack/react-query";

export function useGetSimilarByIdProducts(id: string, params?: unknown) {
  return useQuery({
    queryKey: ["similar-by-id-products", id, params],
    queryFn: () => {
      return recommendedProductsQueries.getSimilarByIdProducts(id, params);
    },
  });
}
