import { transactionsQueries } from "@/api";
import type { TransactionsListParams } from "@/api/schema";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(params?: TransactionsListParams, enabled = true) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionsQueries.getTransactions(params),
    enabled,
  });
}
