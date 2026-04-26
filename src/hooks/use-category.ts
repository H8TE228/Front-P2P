import { categoryQueries } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryQueries.getCategory(id),
  });
}
