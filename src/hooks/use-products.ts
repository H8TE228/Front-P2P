import { productsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (params?: unknown) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsQueries.getProducts(params),
  });
};
