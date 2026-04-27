import { Button } from "@/components/ui/button";

export function FavoritePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="w-full max-w-312">
        <h1 className="mb-2 text-2xl font-bold">Избранное</h1>
        <p className="text-muted-foreground mb-2">
          Ваши сохранённые товары для аренды и совладения.
        </p>

        <section>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="h-10 rounded-2xl">
              Все
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl">
              Аренда
            </Button>
            <Button variant="outline" className="h-10 rounded-2xl">
              Совладение
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
