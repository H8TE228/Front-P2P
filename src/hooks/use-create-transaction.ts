import { transactionsQueries, type CreateItemTransactionBody } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateTransactionVariables = {
  itemId: string;
} & CreateItemTransactionBody;

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, ...body }: CreateTransactionVariables) =>
      transactionsQueries.createItemTransaction(itemId, body),
    onSuccess: (_data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["pending-transactions"] });
      queryClient.invalidateQueries({
        queryKey: ["item-transactions", itemId],
      });
    },
    onError: () => {},
  });
}
