import { api } from "./api";
import type {
  ListingsViewHistoryListParams,
  PaginatedViewHistoryList,
  PatchedViewHistory,
  ViewHistory,
} from "./schema";

export type ViewHistoryPayload = {
  item: number;
};

export const viewHistoryQueries = {
  getViewHistory: async (params?: ListingsViewHistoryListParams) => {
    const res = await api.get<PaginatedViewHistoryList>(
      "/listings/view-history/",
      { params },
    );
    return res.data;
  },
  getViewHistoryById: async (id: number | string) => {
    const res = await api.get<ViewHistory>(`/listings/view-history/${id}/`);
    return res.data;
  },
  createViewHistory: async (payload: ViewHistoryPayload) => {
    const res = await api.post<ViewHistory>("/listings/view-history/", payload);
    return res.data;
  },
  putViewHistory: async (id: number | string, payload: ViewHistoryPayload) => {
    const res = await api.put<ViewHistory>(`/listings/view-history/${id}/`, payload);
    return res.data;
  },
  patchViewHistory: async (id: number | string, payload: PatchedViewHistory) => {
    const res = await api.patch<ViewHistory>(`/listings/view-history/${id}/`, payload);
    return res.data;
  },
  deleteViewHistory: async (id: number | string) => {
    const res = await api.delete<void>(`/listings/view-history/${id}/`);
    return res.data;
  },
  logView: async (payload: ViewHistoryPayload) => {
    const res = await api.post<ViewHistory>(
      "/listings/view-history/log_view/",
      payload,
    );
    return res.data;
  },
};

