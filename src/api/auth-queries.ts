import type { ILoginResponse } from "@/types";
import { api } from "./api";
import type {
  CustomTokenObtainPair,
  PatchedUser,
  ProfilePage,
  Register,
  User,
} from "./schema";

export const authQueries = {
  login: async (userData: CustomTokenObtainPair) => {
    const res = await api.post<ILoginResponse>("/auth/login/", userData);
    return res.data;
  },
  register: async (userData: Register) => {
    const res = await api.post<ILoginResponse>("/auth/register/", userData);
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
    const res = await api.get<User>("/auth/profile/");
    return res.data;
  },
  updateProfile: async (userData: PatchedUser) => {
    const res = await api.patch<PatchedUser>("/auth/profile/", userData);
    return res.data;
  },
  userProfile: async (id: string) => {
    const res = await api.get<ProfilePage>(`/auth/profile/${id}/`);
    return res.data;
  },
};
