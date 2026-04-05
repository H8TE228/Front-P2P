import { CatalogSection, PopularCategoriesSection } from "@/components/catalog";
import {
  SafeListingCtaSection,
  ServiceOfferingsSection,
} from "@/components/home";

export function HomePage() {
  return (
    <main className="mx-auto mb-20 w-full max-w-[1280px] px-4 py-8">
      <div className="w-full max-w-[1248px]">
        <ServiceOfferingsSection />
        <PopularCategoriesSection />
        <CatalogSection />
        <SafeListingCtaSection />
      </div>
    </main>
  );
}
