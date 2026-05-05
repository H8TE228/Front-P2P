import { api } from "./api";
import type {
  ListingsReviewsListParams,
  PaginatedReviewList,
  Review,
} from "./schema";

export type CreateReviewPayload = {
  transaction: number;
  rating: number;
  comment?: string | null;
};

export type UpdateReviewPayload = CreateReviewPayload;

function unwrapReviewList(payload: Review[] | PaginatedReviewList): Review[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.results ?? [];
}

export const reviewsQueries = {
  listReviews: async (params?: ListingsReviewsListParams) => {
    const res = await api.get<PaginatedReviewList>("/listings/reviews/", {
      params,
    });
    return res.data;
  },
  createReview: async (payload: CreateReviewPayload) => {
    const res = await api.post<Review>("/listings/reviews/", payload);
    return res.data;
  },
  getReview: async (id: number | string) => {
    const res = await api.get<Review>(`/listings/reviews/${id}/`);
    return res.data;
  },
  updateReview: async (id: number | string, payload: UpdateReviewPayload) => {
    const res = await api.put<Review>(`/listings/reviews/${id}/`, payload);
    return res.data;
  },
  patchReview: async (
    id: number | string,
    payload: Partial<UpdateReviewPayload>,
  ) => {
    const res = await api.patch<Review>(`/listings/reviews/${id}/`, payload);
    return res.data;
  },
  deleteReview: async (id: number | string) => {
    await api.delete(`/listings/reviews/${id}/`);
  },
  getMyReviews: async () => {
    const res = await api.get<Review[] | PaginatedReviewList>(
      "/listings/reviews/my_reviews/",
    );
    return unwrapReviewList(res.data);
  },
  getReceivedReviews: async () => {
    const res = await api.get<Review[] | PaginatedReviewList>(
      "/listings/reviews/received_reviews/",
    );
    return unwrapReviewList(res.data);
  },
};
