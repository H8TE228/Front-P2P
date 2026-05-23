import { recommendedProductsQueries } from "@/api/recommended-products-queries";
import { useQuery } from "@tanstack/react-query";

export function useGetRecommendedProducts(params?: unknown) {
  return useQuery({
    queryKey: ["recommended-by-id-products", params],
    queryFn: () => {
      return recommendedProductsQueries.getRecommendedProducts(params);
    },
  });
}
