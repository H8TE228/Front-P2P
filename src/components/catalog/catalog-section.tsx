import { ListingCard } from "./listing-card";
import { MOCK_LISTINGS } from "./mock-listings";

export function CatalogSection() {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold leading-8 tracking-[-0.6px] text-[#0F172B] dark:text-[#F1F5F9]">
        Рекомендуем вам
      </h2>

      <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
