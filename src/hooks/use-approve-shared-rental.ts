import { sharedRentalsQueries } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useApproveSharedRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      sharedRentalsQueries.approveSharedRental(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["shared-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "deals"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", id] });
    },
    onError: () => {},
  });
}
