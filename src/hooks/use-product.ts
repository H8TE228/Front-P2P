import { productsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsQueries.getProduct(id),
  });
}
