import { transactionsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useItemTransactions(itemId: number | string) {
  return useQuery({
    queryKey: ["item-transactions", itemId],
    queryFn: () => transactionsQueries.getItemTransactions(itemId),
  });
}
