import { categoryQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryQueries.getCategories(),
  });
}
