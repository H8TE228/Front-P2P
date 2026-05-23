import { sharedRentalsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSharedRental(id: number | string | undefined) {
  return useQuery({
    queryKey: ["shared-rentals", id],
    queryFn: () => sharedRentalsQueries.getSharedRental(id!),
    enabled: id != null && id !== "",
  });
}
