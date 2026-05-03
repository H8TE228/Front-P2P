import { transactionsQueries } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useReturnTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => transactionsQueries.returnTransaction(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["pending-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", id] });
    },
    onError: () => {},
  });
}
