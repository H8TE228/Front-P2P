import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-415px)]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
