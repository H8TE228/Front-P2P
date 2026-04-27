import { authQueries } from "@/api/auth-queries";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => authQueries.userProfile(id),
    enabled: enabled && Boolean(id),
  });
};
