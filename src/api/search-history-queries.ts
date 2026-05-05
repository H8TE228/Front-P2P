import { api } from "./api";
import type {
  ListingsSearchHistoryListParams,
  PaginatedSearchHistoryList,
  PatchedSearchHistory,
  SearchHistory,
} from "./schema";

export type SearchHistoryPayload = {
  query_text: string;
  filters?: string;
};

export const searchHistoryQueries = {
  getSearchHistory: async (params?: ListingsSearchHistoryListParams) => {
    const res = await api.get<PaginatedSearchHistoryList>(
      "/listings/search-history/",
      { params },
    );
    return res.data;
  },
  getSearchHistoryById: async (id: number | string) => {
    const res = await api.get<SearchHistory>(
      `/listings/search-history/${id}/`,
    );
    return res.data;
  },
  createSearchHistory: async (payload: SearchHistoryPayload) => {
    const res = await api.post<SearchHistory>(
      "/listings/search-history/",
      payload,
    );
    return res.data;
  },
  putSearchHistory: async (id: number | string, payload: SearchHistoryPayload) => {
    const res = await api.put<SearchHistory>(
      `/listings/search-history/${id}/`,
      payload,
    );
    return res.data;
  },
  patchSearchHistory: async (
    id: number | string,
    payload: PatchedSearchHistory,
  ) => {
    const res = await api.patch<SearchHistory>(
      `/listings/search-history/${id}/`,
      payload,
    );
    return res.data;
  },
  deleteSearchHistory: async (id: number | string) => {
    const res = await api.delete<void>(`/listings/search-history/${id}/`);
    return res.data;
  },
  logSearch: async (payload: SearchHistoryPayload) => {
    const res = await api.post<SearchHistory>(
      "/listings/search-history/log_search/",
      payload,
    );
    return res.data;
  },
};
