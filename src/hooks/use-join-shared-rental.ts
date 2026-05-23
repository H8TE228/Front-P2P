import {
  sharedRentalsQueries,
  type JoinSharedRentalBody,
} from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type JoinSharedRentalVariables = {
  id: number | string;
} & JoinSharedRentalBody;

export function useJoinSharedRental() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: JoinSharedRentalVariables) =>
      sharedRentalsQueries.joinSharedRental(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["shared-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "my"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "deals"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["shared-rentals", id] });
    },
    onError: () => {},
  });
}
