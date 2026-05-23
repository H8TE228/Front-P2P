import { recommendedProductsQueries } from "@/api/recommended-products-queries";
import { useQuery } from "@tanstack/react-query";

export function useGetRecommendedByIdProducts(id: string, params?: unknown) {
  return useQuery({
    queryKey: ["recommended-by-id-products", id, params],
    queryFn: () => {
      return recommendedProductsQueries.getRecommendedByIdProducts(id, params);
    },
  });
}
