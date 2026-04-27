import { productsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useListingTypes(params?: unknown) {
  return useQuery({
    queryKey: ["listing-types", params],
    queryFn: () => productsQueries.getListingTypes(params),
  });
}
