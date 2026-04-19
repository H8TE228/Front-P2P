import { useAppSelector } from "@/hooks/rtk";
import { Navigate, Outlet } from "react-router-dom";

export function PublicOnlyRoute() {
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
}
