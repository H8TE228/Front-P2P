import {
  sharedRentalsQueries,
  type SharedRentalsListParams,
} from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useSharedRentals(
  params?: SharedRentalsListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ["shared-rentals", params],
    queryFn: () => sharedRentalsQueries.getSharedRentals(params),
    enabled,
  });
}
