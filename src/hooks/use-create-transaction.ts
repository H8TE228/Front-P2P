import { transactionsQueries } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number | string) =>
      transactionsQueries.createItemTransaction(itemId),
    onSuccess: (_data, itemId) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["pending-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["item-transactions", itemId] });
    },
    onError: () => {},
  });
}
