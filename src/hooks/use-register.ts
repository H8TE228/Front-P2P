import { authQueries } from "@/api/auth-queries";
import type { Register } from "@/api/schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: Register) => {
      const data = await authQueries.register(userData);
      return data;
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: () => {},
  });
};
