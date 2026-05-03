import { transactionsQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useTransaction(id: number | string) {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionsQueries.getTransaction(id),
  });
}
