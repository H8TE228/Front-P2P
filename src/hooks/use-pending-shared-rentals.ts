import { sharedRentalsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function usePendingSharedRentals(enabled = true) {
  return useQuery({
    queryKey: ["shared-rentals", "pending"],
    queryFn: () => sharedRentalsQueries.getPendingSharedRentals(),
    enabled,
  });
}
