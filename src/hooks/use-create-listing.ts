import { productsQueries } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useCreateListing() {
  return useMutation({
    mutationFn: (listingData: unknown) => {
      const data = productsQueries.createListingItem(listingData);
      return data;
    },
    onSuccess: () => {},
    onError: () => {},
  });
}
