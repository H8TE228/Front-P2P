import { authQueries } from "@/api/auth-queries";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (userData: unknown) => {
      const data = authQueries.updateProfile(userData);
      return data;
    },
    onSuccess: () => {},
    onError: () => {},
  });
}
