import { authQueries } from "@/api/auth-queries";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: (userData: unknown) => {
      const data = authQueries.login(userData);
      return data;
    },
    onSuccess: () => {},
    onError: () => {},
  });
}
