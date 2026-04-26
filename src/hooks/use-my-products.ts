import { productsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useMyProducts() {
  return useQuery({
    queryKey: ["my-products"],
    queryFn: () => productsQueries.getMyProducts(),
  });
}
