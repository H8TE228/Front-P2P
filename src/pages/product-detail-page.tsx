import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Camera,
  Heart,
  Star,
  ShieldCheck,
  Clock,
  ChevronLeft,
  ArrowRight,
  Shield,
  CircleAlert,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateFavoriteItem,
  useCreateTransaction,
  useDeleteFavoriteItem,
  useFavoriteItems,
  useLogViewHistory,
  useProduct,
} from "@/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/rtk";

const productStatus = {
  available: "Доступен",
  rented: "Сдан",
  maintenance: "На обслуживании",
  unavailable: "Недоступен",
};

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

const pad2 = (n: number) => String(n).padStart(2, "0");

const toDatetimeLocalValue = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const defaultRentRange = () => {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start);
  end.setHours(end.getHours() + 24);
  return { start: toDatetimeLocalValue(start), end: toDatetimeLocalValue(end) };
};

const splitDatetimeLocal = (value: string) => {
  const [datePart, timePart = ""] = value.split("T");
  const time = timePart.slice(0, 5);
  return {
    date: datePart ?? "",
    time: time.length === 5 ? time : "00:00",
  };
};

const rentFormFromDefaults = () => {
  const r = defaultRentRange();
  const s = splitDatetimeLocal(r.start);
  const e = splitDatetimeLocal(r.end);
  return {
    startDate: s.date,
    startTime: s.time,
    endDate: e.date,
    endTime: e.time,
  };
};

const combineDateTimeLocal = (date: string, time: string) =>
  date && time ? `${date}T${time}` : "";

export function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [rentError, setRentError] = useState<string | null>(null);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [rentForm, setRentForm] = useState(rentFormFromDefaults);

  const { data: product } = useProduct(id!);
  const { data: favorites } = useFavoriteItems({ page_size: 200 });
  const imgCount = product?.images?.length || 0;

  const user = useAppSelector((state) => state.auth.user);
  const createTransaction = useCreateTransaction();
  const logView = useLogViewHistory();
  const createFavorite = useCreateFavoriteItem();
  const deleteFavorite = useDeleteFavoriteItem();

  const favoriteEntry = favorites?.results?.find(
    (x) => x.item?.id === Number(product?.id),
  );
  const isFavorite = Boolean(favoriteEntry);

  const plannedStart = combineDateTimeLocal(
    rentForm.startDate,
    rentForm.startTime,
  );
  const plannedEnd = combineDateTimeLocal(rentForm.endDate, rentForm.endTime);

  const rentRangeInvalid =
    !plannedStart || !plannedEnd || plannedStart >= plannedEnd;

  const rentButtonDisabled =
    !product ||
    user?.id === product.owner.id ||
    createTransaction.isPending ||
    product.status !== "available";

  useEffect(() => {
    if (!rentModalOpen) return;
    setRentForm(rentFormFromDefaults());
    setRentError(null);
  }, [rentModalOpen]);

  const handleRent = () => {
    if (!product || rentRangeInvalid) return;
    setRentError(null);

    createTransaction.mutate(
      {
        itemId: String(product.id),
        planned_start: new Date(plannedStart).toISOString(),
        planned_end: new Date(plannedEnd).toISOString(),
      },
      {
        onSuccess: () => {
          setRentModalOpen(false);
          navigate("/transactions");
        },
        onError: (err) => {
          const anyErr = err as any;
          const data = anyErr?.response?.data;
          let detail = data?.detail ?? data?.message ?? anyErr?.message;
          if (
            detail == null &&
            data &&
            typeof data === "object" &&
            !Array.isArray(data)
          ) {
            const parts = Object.entries(data).flatMap(([key, val]) =>
              Array.isArray(val)
                ? val.map((x) => `${key}: ${String(x)}`)
                : [`${key}: ${String(val)}`],
            );
            if (parts.length > 0) detail = parts.join(" ");
          }
          setRentError(
            typeof detail === "string" && detail.trim().length > 0
              ? detail
              : "Не удалось создать транзакцию",
          );
        },
      },
    );
  };

  const toggleFavorite = () => {
    if (!product) return;
    const fav = favoriteEntry;
    if (fav) {
      deleteFavorite.mutate(fav.id);
      return;
    }
    createFavorite.mutate({ item_id: Number(product.id) });
  };

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

  useEffect(() => {
    const itemId = Number(id);
    if (!Number.isFinite(itemId)) return;
    logView.mutate({ item: itemId });
  }, [id]);

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
      to: `/catalog?category=${product.category_name}&type=${product.type_name}`,
    },
    product?.name && {
      label: product.name,
      to: `/catalog?category=${product.category_name}&type=${product.type_name}`,
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
              {product.images?.length === 0 && (
                <Camera className="h-16 w-16 self-center text-slate-300 dark:text-slate-600" />
              )}
              {product.images?.length !== 0 && (
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
                            src={image.image}
                            alt={product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <div className="absolute right-3 bottom-2 z-10 flex h-10 w-17 items-center justify-between rounded-2xl bg-white/70 dark:bg-[#1f2937]">
                    <CarouselPrevious className="absolute left-0 ml-1" />
                    <CarouselNext className="absolute right-0 mr-1" />
                  </div>
                </Carousel>
              )}

              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-3">
                <div className="pointer-events-none flex justify-end">
                  <div className="pointer-events-auto">
                    <Button
                      variant="outline"
                      className="cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium dark:bg-[#1f2937] dark:hover:bg-[#1f2937]/80"
                      onClick={toggleFavorite}
                      disabled={
                        createFavorite.isPending || deleteFavorite.isPending
                      }
                    >
                      <Heart
                        className={
                          isFavorite ? "fill-red-600 text-red-600" : undefined
                        }
                      />
                    </Button>
                  </div>
                </div>
                <div className="pointer-events-none flex justify-start">
                  <div className="pointer-events-auto">
                    <Button
                      variant="outline"
                      className="rounded-xl px-3 py-1.5 text-xs font-medium dark:bg-[#1f2937] dark:hover:bg-[#1f2937]/80"
                    >
                      {current} / {imgCount}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-4">
              {product.images?.length === 0 && (
                <button
                  className={`h-16 w-16 cursor-pointer overflow-hidden rounded-lg border transition`}
                >
                  <img
                    src={"#"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              )}
              {product.images?.length !== 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {product?.images?.map((image, index) => {
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
                          src={image.image}
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

            <section className="">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Описание
              </h2>
              <p className="overflow-hidden leading-relaxed wrap-break-word whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {product.description || "Описание отсутствует."}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
                Характеристики
              </h2>
              <p className="leading-relaxed wrap-break-word whitespace-pre-wrap text-slate-700 dark:text-slate-300">
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
                      {productStatus[product.status!]}
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    disabled={rentButtonDisabled}
                    variant="blue"
                    className="mb-3 h-13 w-full"
                    onClick={() => setRentModalOpen(true)}
                  >
                    Арендовать
                  </Button>
                  <Dialog open={rentModalOpen} onOpenChange={setRentModalOpen}>
                    <DialogContent className="p-6 sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Заявка на аренду</DialogTitle>
                        <DialogDescription>
                          Выберите дату и время начала и окончания. Владелец
                          объявления подтвердит или отклонит заявку.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-5">
                        <div className="grid gap-2">
                          <Label
                            className="text-foreground"
                            htmlFor="startDate"
                          >
                            Начало аренды
                          </Label>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <Input
                              id="startDate"
                              type="date"
                              className="h-10 min-h-10"
                              value={rentForm.startDate}
                              onChange={(e) =>
                                setRentForm((f) => ({
                                  ...f,
                                  startDate: e.target.value,
                                }))
                              }
                            />
                            <Input
                              type="time"
                              step={60}
                              className="h-10 min-h-10"
                              value={rentForm.startTime}
                              onChange={(e) =>
                                setRentForm((f) => ({
                                  ...f,
                                  startTime: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-foreground" htmlFor="endDate">
                            Окончание аренды
                          </Label>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <Input
                              id="endDate"
                              type="date"
                              className="h-10 min-h-10"
                              value={rentForm.endDate}
                              onChange={(e) =>
                                setRentForm((f) => ({
                                  ...f,
                                  endDate: e.target.value,
                                }))
                              }
                            />
                            <Input
                              type="time"
                              step={60}
                              className="h-10 min-h-10"
                              value={rentForm.endTime}
                              onChange={(e) =>
                                setRentForm((f) => ({
                                  ...f,
                                  endTime: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        {rentRangeInvalid &&
                          rentForm.startDate &&
                          rentForm.endDate && (
                            <p className="text-destructive text-sm">
                              Укажите корректный период: окончание позже начала.
                            </p>
                          )}
                        {rentError && (
                          <p className="text-destructive text-sm">
                            {rentError}
                          </p>
                        )}
                      </div>
                      <DialogFooter className="sm:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 w-full sm:w-auto"
                          onClick={() => setRentModalOpen(false)}
                        >
                          Отмена
                        </Button>
                        <Button
                          type="button"
                          variant="blue"
                          className="h-9 w-full sm:w-auto"
                          disabled={
                            rentRangeInvalid || createTransaction.isPending
                          }
                          onClick={handleRent}
                        >
                          {createTransaction.isPending
                            ? "Отправляем..."
                            : "Отправить заявку"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="">
                    <Button
                      disabled={user?.id === product.owner.id}
                      className="h-12 w-1/2"
                    >
                      Написать
                    </Button>
                    <Button
                      disabled={user?.id === product.owner.id}
                      className="h-12 w-1/2"
                    >
                      Позвонить
                    </Button>
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
