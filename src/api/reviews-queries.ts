import { api } from "./api";
import type { Review } from "./schema";

export type CreateReviewPayload = {
  transaction: number;
  rating: number;
  comment?: string | null;
};

export const reviewsQueries = {
  createReview: async (payload: CreateReviewPayload) => {
    const res = await api.post<Review>("/listings/reviews/", payload);
    return res.data;
  },
};

