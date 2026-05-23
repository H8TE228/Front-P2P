import {
  sharedRentalsQueries,
  type CreateSharedRentalBody,
} from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateItemSharedRentalVariables = {
  itemId: string;
} & Omit<CreateSharedRentalBody, "item">;

export function useCreateItemSharedRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, ...body }: CreateItemSharedRentalVariables) =>
      sharedRentalsQueries.createItemSharedRental(itemId, body),
    onSuccess: (_data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ["shared-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "my"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "deals"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "pending"] });
      queryClient.invalidateQueries({
        queryKey: ["shared-rentals", { item: Number(itemId), only_open: 1 }],
      });
    },
    onError: () => {},
  });
}
