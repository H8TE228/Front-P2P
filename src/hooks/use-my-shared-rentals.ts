import { sharedRentalsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useMySharedRentals(enabled = true) {
  return useQuery({
    queryKey: ["shared-rentals", "my"],
    queryFn: () => sharedRentalsQueries.getMySharedRentals(),
    enabled,
  });
}
