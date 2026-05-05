import { viewHistoryQueries } from "@/api";
import type { ListingsViewHistoryListParams } from "@/api/schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useViewHistory(params?: ListingsViewHistoryListParams) {
  return useQuery({
    queryKey: ["view-history", params],
    queryFn: () => viewHistoryQueries.getViewHistory(params),
  });
}

export function useLogViewHistory() {
  return useMutation({
    mutationFn: (payload: { item: number }) => viewHistoryQueries.logView(payload),
  });
}

