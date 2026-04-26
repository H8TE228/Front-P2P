import { Link, useLocation, useParams } from "react-router-dom";
import {
  Camera,
  Heart,
  Star,
  ShieldCheck,
  Clock,
  X,
  ChevronLeft,
  ArrowRight,
  Shield,
  CircleAlert,
} from "lucide-react";

import { ListingCard } from "@/components";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks";

export function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const { data: product } = useProduct(id!);

  return (
    product && (
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link
            to={location.state?.from || -1}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {product.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
              <Camera className="h-16 w-16 text-slate-300 dark:text-slate-600" />
              {/* {product.images?.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ))} */}
              <div className="absolute right-4 bottom-4 flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 text-xs font-medium"
                >
                  1 / 5
                </Button>
              </div>
            </section>

            <section className="mb-4">Слайдер в будущем</section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Местоположение (в будущем - карта)
              </h2>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Описание
              </h2>
              <p className="leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {product.description || "Описание отсутствует."}
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Характеристики
              </h2>
              <p className="leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {product.characteristics || "Характеристики отсутствуют."}
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Похожие объявления
              </h2>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="h-102 bg-white pt-0 dark:bg-blue-900/10">
              <CardHeader className="flex flex-row border-b px-6 pt-6">
                <Link
                  to={`/profile/${product.owner.id}`}
                  className="flex h-full w-full items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-[#e2e8f0]">
                      {product.owner.profile_picture ? (
                        <img
                          src={product.owner.profile_picture}
                          alt={
                            product.owner.first_name ||
                            product.owner.username ||
                            "Пользователь"
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-gray-600">
                          {(
                            product.owner.first_name?.[0] ||
                            product.owner.username?.[0] ||
                            "?"
                          ).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="flex justify-between gap-4 text-lg">
                      <h2 className="font-bold">{product.owner.first_name}</h2>
                      <div className="flex items-center gap-1 rounded-xl bg-[#eff2f5] p-1 dark:bg-[#0f172b]">
                        <Star className="size-4 text-blue-700" />
                        <span className="text-xs font-bold">
                          {product.owner.rating || 0}
                        </span>
                      </div>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="size-4.5" />
                      <span className="text-muted-foreground">
                        Документы проверены
                      </span>
                    </span>
                  </div>
                  <div>
                    <ArrowRight />
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 border-b px-6 pb-6">
                <div className="flex flex-col gap-3">
                  <span className="text-3xl font-bold">
                    {product.price.slice(0, -3)} руб
                    <span className="text-muted-foreground text-lg">
                      {" "}
                      / (за сколько)
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <div className="flex gap-1 rounded-lg border-2 border-[#E2E8F0] bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold uppercase">
                      <Clock className="size-4" />
                      аренда
                    </div>
                    <div className="rounded-lg border-2 border-[#B9F8CF] bg-[#f0fdf4] px-2.5 py-1 text-xs font-semibold text-[#008236] uppercase">
                      свободно завтра
                    </div>
                  </div>
                </div>
                <div>
                  <Button variant="blue" className="mb-3 h-13 w-full">
                    Арендовать
                  </Button>
                  <div className="">
                    <Button className="h-12 w-1/2">Написать</Button>
                    <Button className="h-12 w-1/2">Позвонить</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-0 bg-white p-0 px-6 dark:bg-[#040b23]">
                <Link
                  to={"#"}
                  className="text-muted-foreground flex items-center gap-1 text-base"
                >
                  <CircleAlert className="size-4" />
                  Пожаловаться
                </Link>
              </CardFooter>
            </Card>
            <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
              <div className="mt-0.5 shrink-0">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Будьте внимательны при совершении сделок. Никогда не передавайте
                личные данные и не вносите предоплату до личной встречи и
                проверки товара.
              </div>
            </section>
          </div>
        </div>
        {/* <div className="grid min-h-104 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_LISTINGS.slice(0, 4).map((product) => (
            <ListingCard key={product.id} product={product} />
          ))}
        </div> */}
      </main>
    )
  );
}
