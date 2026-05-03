import { CatalogSection } from "@/components";
import {
  PopularCategoriesSection,
  SafeListingCtaSection,
  ServiceOfferingsSection,
} from "@/components/home";

export function HomePage() {
  return (
    <main className="mx-auto mb-20 w-full max-w-7xl px-4 py-8">
      <div className="w-full max-w-312">
        <ServiceOfferingsSection />
        <PopularCategoriesSection />
        <CatalogSection />
        <SafeListingCtaSection />
      </div>
    </main>
  );
}
