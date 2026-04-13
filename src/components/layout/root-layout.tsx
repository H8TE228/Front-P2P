import { Outlet } from "react-router-dom";
import { useState } from "react";
import { CatalogMegaMenu } from "./catalog-mega-menu";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <>
      <Header catalogOpen={catalogOpen} onCatalogOpenChange={setCatalogOpen} />
      <Outlet />
      <Footer />
      <CatalogMegaMenu
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
      />
    </>
  );
}
