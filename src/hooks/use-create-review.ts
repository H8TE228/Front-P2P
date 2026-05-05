import { reviewsQueries } from "@/api";
import type { CreateReviewPayload } from "@/api/reviews-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewsQueries.createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {},
  });
}

