import { authQueries } from "@/api/auth-queries";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: unknown) => {
      const data = await authQueries.register(userData);
      return data;
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: () => {},
  });
};
