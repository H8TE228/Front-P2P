import { authQueries } from "@/api/auth-queries";
import type { PatchedUser } from "@/api/schema";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (userData: PatchedUser) => {
      const data = authQueries.updateProfile(userData);
      return data;
    },
    onSuccess: () => {},
    onError: () => {},
  });
}
