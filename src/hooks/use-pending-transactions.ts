import { transactionsQueries } from "@/api";
import type { TransactionsPendingListParams } from "@/api/schema";
import { useQuery } from "@tanstack/react-query";

export function usePendingTransactions(params?: TransactionsPendingListParams) {
  return useQuery({
    queryKey: ["pending-transactions", params],
    queryFn: () => transactionsQueries.getPendingTransactions(params),
  });
}
