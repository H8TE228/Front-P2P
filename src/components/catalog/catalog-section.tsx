import { ListingCard } from "./listing-card";
import { MOCK_LISTINGS } from "./mock-listings";

const listingFont =
  '"Inter Variable", Inter, system-ui, sans-serif' as const;

export function CatalogSection() {
  return (
    <section className="w-full" style={{ fontFamily: listingFont }}>
      <h2 className="text-2xl font-bold leading-8 tracking-[-0.6px] text-[var(--app-text)]">
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
