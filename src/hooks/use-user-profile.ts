import { authQueries } from "@/api/auth-queries";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => authQueries.userProfile(id),
  });
};
