import { authQueries } from "@/api/auth-queries";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "./rtk";
import { login } from "@/store/auth-slice";

export function useLogin() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (userData: unknown) => {
      const data = authQueries.login(userData);
      return data;
    },
    onSuccess: (responseData: any) => {
      dispatch(login(responseData));
    },
    onError: () => {},
  });
}
