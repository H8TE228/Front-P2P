import type { User } from "@/api/schema";
import type { ILoginResponse } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  isAuth: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: IAuthState = {
  isAuth: !!localStorage.getItem("access"),
  accessToken: localStorage.getItem("access"),
  refreshToken: localStorage.getItem("refresh"),
  user: JSON.parse(localStorage.getItem("user")!),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<ILoginResponse>) {
      state.isAuth = true;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.user = action.payload.user;
      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.isAuth = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    },
    setTokens(state, action) {
      state.isAuth = true;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
  },
});

export const { login, logout, setTokens } = authSlice.actions;
export default authSlice.reducer;
