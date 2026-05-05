import { reviewsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useMyReviews(enabled = true) {
  return useQuery({
    queryKey: ["reviews", "my"],
    queryFn: () => reviewsQueries.getMyReviews(),
    enabled,
  });
}
