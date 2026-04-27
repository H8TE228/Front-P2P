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
  ChevronRight,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const formatDate = (iso: string) => {
  const date = new Date(iso);

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
};

export function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  const { data: product } = useProduct(id!);
  const imgCount = product?.images?.length || 0;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleThumbClick = (index: number) => {
    api?.scrollTo(index);
  };

  const breadcrumbs = [
    { label: "Главная", to: "/" },
    { label: "Каталог", to: "/catalog" },
    product?.category_name && {
      label: product.category_name,
      to: `/catalog?category=${product.category_name}`,
    },
    product?.type_name && {
      label: product.type_name,
      to: `/catalog?type=${product.type_name}`,
    },
  ].filter(Boolean);

  return (
    product && (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {breadcrumbs.map((item: any, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={item.label} className="flex items-center gap-1">
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-black">{item.label}</span>
                )}

                {!isLast && (
                  <ChevronRight className="size-4 translate-y-px text-gray-400" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 mb-6 flex items-center gap-4">
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
          <div className="space-y-4 lg:col-span-2">
            <section className="relative flex h-126 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
              <div className="absolute bottom-2 left-3 z-1000 flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl px-3 py-1.5 text-xs font-medium dark:bg-[#1f2937] dark:hover:bg-[#1f2937]/80"
                >
                  {current} / {imgCount}
                </Button>
              </div>

              <div className="absolute top-2 right-3 z-1000 flex gap-2">
                <Button
                  variant="outline"
                  disabled
                  className="rounded-xl px-3 py-1.5 text-xs font-medium dark:bg-[#1f2937] dark:hover:bg-[#1f2937]/80"
                >
                  <Heart />
                </Button>
              </div>

              {product.images?.length === 0 && (
                <Camera className="h-16 w-16 self-center text-slate-300 dark:text-slate-600" />
              )}
              {product.images?.length && (
                <Carousel
                  className="relative h-full w-full"
                  setApi={setApi}
                  orientation="horizontal"
                >
                  <CarouselContent className="max-h-126">
                    {product.images?.map((image) => {
                      return (
                        <CarouselItem
                          key={image.id}
                          className="max-h-126 basis-full"
                        >
                          <img
                            src={image.url}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <div className="absolute right-3 bottom-2 flex h-10 w-17 items-center justify-between rounded-2xl bg-white/70 dark:bg-[#1f2937]">
                    <CarouselPrevious className="absolute left-0 ml-1" />
                    <CarouselNext className="absolute right-0 mr-1" />
                  </div>
                </Carousel>
              )}
            </section>

            <section className="mb-4">
              {product.images?.length && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => {
                    const isActive = current === index + 1;

                    return (
                      <button
                        key={image.id}
                        onClick={() => handleThumbClick(index)}
                        className={`h-16 w-16 cursor-pointer overflow-hidden rounded-lg border transition ${
                          isActive
                            ? ""
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

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

            <section className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Характеристики
              </h2>
              <p className="leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {product.characteristics || "Характеристики отсутствуют."}
              </p>
            </section>

            <section className="text-muted-foreground text-xs">{`№ ${product.id} | ${formatDate(product.updated_at)}`}</section>

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
