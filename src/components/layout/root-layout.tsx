import { Outlet } from "react-router-dom";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function RootLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  );
}
