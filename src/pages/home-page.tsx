import type { Item } from "@/api/schema";
import { ListingCard } from "@/components";
import {
  PopularCategoriesSection,
  SafeListingCtaSection,
  ServiceOfferingsSection,
} from "@/components/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAppSelector } from "@/hooks/rtk";
import { useGetRecommendedProducts } from "@/hooks/use-get-recommended-products";

export function HomePage() {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const { data: products, isLoading } = useGetRecommendedProducts();

  return (
    <main className="mx-auto mb-20 w-full max-w-7xl px-4 py-8">
      <div className="w-full max-w-312">
        <ServiceOfferingsSection />
        <PopularCategoriesSection />
        {isAuth && (
          <section className="pb-4 sm:min-h-97">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
              Рекомендуем
            </h2>
            {isLoading && (
              <div className="text-muted-foreground col-span-full text-center">
                Загрузка объявлений...
              </div>
            )}
            {!isLoading && !products?.results.length && (
              <div className="text-muted-foreground col-span-full text-center">
                Рекомендаций еще нет
              </div>
            )}
            {!isLoading && (
              <Carousel className="relative w-full">
                <CarouselContent className="relative lg:h-86">
                  {products?.results.map((p: Item) => (
                    <CarouselItem
                      className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                      key={p.id}
                    >
                      <ListingCard key={p.id} product={p} isMine={false} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious style={{ bottom: "-35px", right: "40px" }} />
                <CarouselNext style={{ bottom: "-35px", right: 0 }} />
              </Carousel>
            )}
          </section>
        )}
        <SafeListingCtaSection />
      </div>
    </main>
  );
}
