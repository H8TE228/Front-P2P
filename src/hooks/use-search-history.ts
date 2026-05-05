import { searchHistoryQueries, type SearchHistoryPayload } from "@/api";
import type {
  ListingsSearchHistoryListParams,
  PaginatedSearchHistoryList,
  PatchedSearchHistory,
  SearchHistory,
} from "@/api/schema";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

export function useSearchHistory(
  params?: ListingsSearchHistoryListParams,
  options?: Omit<
    UseQueryOptions<PaginatedSearchHistoryList, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: ["search-history", params],
    queryFn: () => searchHistoryQueries.getSearchHistory(params),
    ...options,
  });
}

export function useSearchHistoryItem(
  id: number | string | undefined,
  options?: Omit<UseQueryOptions<SearchHistory, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["search-history-item", id],
    queryFn: () => searchHistoryQueries.getSearchHistoryById(id!),
    enabled: id !== undefined && id !== "",
    ...options,
  });
}

export function useCreateSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SearchHistoryPayload) =>
      searchHistoryQueries.createSearchHistory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
}

export function usePutSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: SearchHistoryPayload;
    }) => searchHistoryQueries.putSearchHistory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
}

export function usePatchSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: PatchedSearchHistory;
    }) => searchHistoryQueries.patchSearchHistory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
}

export function useDeleteSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      searchHistoryQueries.deleteSearchHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
}

export function useLogSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SearchHistoryPayload) =>
      searchHistoryQueries.logSearch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
  });
}
