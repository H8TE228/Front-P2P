import { authQueries } from "@/api/auth-queries";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "./rtk";
import { login } from "@/store/auth-slice";
import type { CustomTokenObtainPair } from "@/api/schema";
import type { ILoginResponse } from "@/types";

export function useLogin() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (userData: CustomTokenObtainPair) => {
      const data = authQueries.login(userData);
      return data;
    },
    onSuccess: (responseData: ILoginResponse) => {
      dispatch(login(responseData));
    },
    onError: () => {},
  });
}
