import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
