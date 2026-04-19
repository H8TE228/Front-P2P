import { useAppSelector } from "@/hooks/rtk";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateOnlyRoute() {
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
