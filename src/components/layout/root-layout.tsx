import { Outlet } from "react-router-dom";
import { useState } from "react";
import { CatalogMegaMenu } from "./catalog-mega-menu";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function RootLayout() {
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <>
      <SiteHeader
        catalogOpen={catalogOpen}
        onCatalogOpenChange={setCatalogOpen}
      />
      <Outlet />
      <SiteFooter />
      <CatalogMegaMenu
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
      />
    </>
  );
}
