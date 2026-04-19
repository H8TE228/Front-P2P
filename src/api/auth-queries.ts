import { api } from "./api";

export const authQueries = {
  login: async (userData: unknown) => {
    const res = await api.post<unknown>("/auth/login/", userData);
    return res.data;
  },
  register: async (userData: unknown) => {
    const res = await api.post<unknown>("/auth/register/", userData);
    return res.data;
  },
  // logout: async () => {
  //   const refresh = localStorage.getItem("refresh");
  //   if (!refresh) {
  //     return;
  //   }
  //   const res = await api.post("/auth/logout/", { refresh });
  //   return res.data;
  // },
  profile: async () => {
    const res = await api.get<unknown>("/auth/profile/");
    return res.data;
  },
};
