import { sharedRentalsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSharedRentalsForDeals(enabled = true) {
  return useQuery({
    queryKey: ["shared-rentals", "deals"],
    queryFn: () => sharedRentalsQueries.getSharedRentalsForDeals(),
    enabled,
  });
}
