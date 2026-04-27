import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  { value: "all", label: "Все" },
  { value: "rental", label: "Аренда" },
  { value: "ownership", label: "Совладение" },
];

export function FavoritePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const favoriteCategory = searchParams.get("category") || "all";

  function handleCategoryChange(category: string) {
    setSearchParams({ category });
  }

  // const {data: favoriteProducts, isLoading} = useFavoriteProducts(favoriteCategory);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="w-full max-w-312">
        <h1 className="mb-2 text-2xl font-bold">Избранное</h1>
        <p className="text-muted-foreground mb-2">
          Ваши сохранённые товары для аренды и совладения.
        </p>

        <section className="mb-2">
          <div className="flex gap-4 pt-4">
            {CATEGORIES.map((item) => {
              const isActive = favoriteCategory === item.value;

              return (
                <Button
                  key={item.value}
                  variant="outline"
                  className={
                    isActive
                      ? "h-10 rounded-2xl border-[#155dfc] bg-[#155dfc] px-4 py-2 text-white hover:bg-[#155DFC] hover:text-white"
                      : "h-10 rounded-2xl px-4 py-2"
                  }
                  onClick={() => handleCategoryChange(item.value)}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="pt-4">Тут будут понравившиеся объявления</section>
      </div>
    </main>
  );
}
