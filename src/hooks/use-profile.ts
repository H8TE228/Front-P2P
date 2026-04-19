import { authQueries } from "@/api/auth-queries";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authQueries.profile(),
  });
};
