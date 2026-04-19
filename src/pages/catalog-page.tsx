import { ListingCard } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

type FormValues = {
  category: string;
  price__gt: string;
  price__lt: string;
  deal_type: string[];
  condition: string[];
};

const PAGE_SIZE = 32;

const parseMultiValueParam = (
  searchParams: URLSearchParams,
  key: string,
): string[] => {
  const values = searchParams.getAll(key);
  if (values.length > 0) {
    return values;
  }

  const fallback = searchParams.get(key);
  return fallback ? fallback.split(",").filter(Boolean) : [];
};

export const listings = {
  results: [
    {
      id: "1",
      tag: "rent",
      imageSrc: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      priceRub: 1200,
      price: { kind: "per_day" },
      title: "iPhone 14 Pro",
      rating: 4.8,
      reviewsCount: 128,
      location: "Москва, центр",
    },
    {
      id: "2",
      tag: "coownership",
      imageSrc: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      priceRub: 45000,
      price: { kind: "share", percent: 25 },
      title: "MacBook Pro M2",
      rating: 4.9,
      reviewsCount: 64,
      location: "Санкт-Петербург",
    },
    {
      id: "3",
      tag: "rent",
      imageSrc: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      priceRub: 800,
      price: { kind: "per_day" },
      title: "Sony WH-1000XM5",
      rating: 4.7,
      reviewsCount: 210,
      location: "Казань",
    },
    {
      id: "4",
      tag: "rent",
      imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      priceRub: 300,
      price: { kind: "per_day" },
      title: "Nintendo Switch",
      rating: 4.6,
      reviewsCount: 89,
      location: "Екатеринбург",
    },
    {
      id: "5",
      tag: "coownership",
      imageSrc: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa",
      priceRub: 90000,
      price: { kind: "share", percent: 40 },
      title: "PlayStation 5",
      rating: 4.9,
      reviewsCount: 340,
      location: "Новосибирск",
    },
  ],
};

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const price__gt = searchParams.get("price__gt") || "";
  const price__lt = searchParams.get("price__lt") || "";
  const sort = searchParams.get("sort") || "";
  const dealTypeKey = searchParams.getAll("deal_type").join(",");
  const conditionKey = searchParams.getAll("condition").join(",");
  const deal_type = useMemo(
    () => parseMultiValueParam(searchParams, "deal_type"),
    [dealTypeKey],
  );
  const condition = useMemo(
    () => parseMultiValueParam(searchParams, "condition"),
    [conditionKey],
  );

  const { handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      category,
      price__gt,
      price__lt,
      deal_type,
      condition,
    },
  });

  useEffect(() => {
    reset({ category, price__gt, price__lt, deal_type, condition });
  }, [category, price__gt, price__lt, deal_type, condition, reset]);

  const productsQuery = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      category_name: category || undefined,
      price__gt: price__gt || undefined,
      price__lt: price__lt || undefined,
      deal_type: deal_type.length > 0 ? deal_type : undefined,
      condition: condition.length > 0 ? condition : undefined,
      ordering: sort || undefined,
    }),
    [page, category, price__gt, price__lt, deal_type, condition, sort],
  );

  // убрать потом

  // это потом убрать и юзать реальные данные с бэка
  const categories = {
    results: [
      { id: 1, name: "Электроника" },
      { id: 2, name: "Одежда" },
      { id: 3, name: "Книги" },
      { id: 4, name: "Дом и сад" },
      { id: 5, name: "Спорт и отдых" },
    ],
  };

  const dealTypes = [
    { value: "any", label: "Любой тип" },
    { value: "rent", label: "Только аренда" },
    { value: "coownership", label: "Совместное владение" },
  ];

  const conditions = [
    { value: "new", label: "Новое" },
    { value: "used", label: "Б/у" },
  ];

  const { data, isLoading } = useProducts(productsQuery);

  const products = listings?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const onSubmit = (values: FormValues) => {
    const params = new URLSearchParams();

    if (values.category) params.set("category", values.category);
    if (values.price__gt) params.set("price__gt", values.price__gt);
    if (values.price__lt) params.set("price__lt", values.price__lt);
    values.deal_type.forEach((value) => params.append("deal_type", value));
    values.condition.forEach((value) => params.append("condition", value));
    params.set("page", "1");
    if (sort) params.set("sort", sort);

    setSearchParams(params);
    setFiltersOpen(false);

    if (window.innerWidth < 1024 && productsRef.current) {
      const top =
        productsRef.current.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const onReset = () => {
    setSearchParams({});
    setFiltersOpen(false);
  };

  const goToPage = (newPage: number) => {
    const params = Object.fromEntries(searchParams.entries());
    if (newPage > 1) params.page = String(newPage);
    else delete params.page;
    setSearchParams(params);
  };

  const updateSort = (value: string) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params.sort = value;
    else delete params.sort;
    params.page = "1";
    setSearchParams(params);
  };

  const updateCategory = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set("category", value);
    else params.delete("category");

    params.set("page", "1");
    setSearchParams(params);
  };

  const toggleMultiValue = (
    currentValues: string[],
    value: string,
    onChange: (value: string[]) => void,
  ) => {
    if (currentValues.includes(value)) {
      onChange(currentValues.filter((item) => item !== value));
      return;
    }

    onChange([...currentValues, value]);
  };

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link
          to="/"
          className="flex items-center text-gray-400 hover:text-gray-600"
        >
          <span>Главная</span>
          <ChevronRight className="size-4 translate-y-px" />
        </Link>
        <Link to="/catalog" className="text-black">
          Каталог
        </Link>
      </div>

      <h1 className="mt-4 text-3xl font-bold">Каталог</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => updateCategory("")}
          className={`cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors ${
            !category
              ? "border-[#155dfc] bg-[#155dfc] text-white"
              : "border-[#D9E2F2] bg-white text-[#0F172A]"
          }`}
        >
          Все товары
        </button>

        {categories?.results.map((c: any) => (
          <button
            key={c.id}
            type="button"
            onClick={() => updateCategory(c.name)}
            className={`cursor-pointer rounded-full border px-5 py-2 text-sm transition-colors ${
              category === c.name
                ? "border-[#155dfc] bg-[#155dfc] text-white"
                : "border-[#D9E2F2] bg-white text-[#0F172A]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64">
          <div className="bg-aside-background rounded-2xl p-6 pt-0 pl-0 lg:sticky lg:top-24">
            <div className="mb-4 flex justify-between">
              <h3 className="font-semibold">Фильтры</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="cursor-pointer lg:hidden"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-8 border-b pb-8">
                <h4 className="text-muted-foreground mb-3 text-sm font-semibold uppercase">
                  Тип сделки
                </h4>

                <Controller
                  control={control}
                  name="deal_type"
                  render={({ field }) => (
                    <div className="space-y-3">
                      {dealTypes.map((d) => (
                        <label
                          key={d.value}
                          className="flex cursor-pointer items-center gap-3 text-sm text-[#0F172A]"
                        >
                          <input
                            type="checkbox"
                            checked={field.value.includes(d.value)}
                            onChange={() =>
                              toggleMultiValue(
                                field.value,
                                d.value,
                                field.onChange,
                              )
                            }
                            className="size-4 rounded border border-[#D9E2F2]"
                          />
                          {d.label}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div className="mb-8 border-b pb-8">
                <h4 className="text-muted-foreground mb-3 text-sm font-semibold uppercase">
                  Цена, ₽
                </h4>
                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="price__gt"
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          type="number"
                          placeholder="От"
                          className="h-9 w-full rounded-lg border px-3 py-2"
                        />
                      );
                    }}
                  />
                  {"-"}
                  <Controller
                    control={control}
                    name="price__lt"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="До"
                        className="h-9 w-full rounded-lg border px-3 py-2"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="">
                <h4 className="text-muted-foreground mb-3 text-sm font-semibold uppercase">
                  Состояние
                </h4>

                <Controller
                  control={control}
                  name="condition"
                  render={({ field }) => (
                    <div className="space-y-3">
                      {conditions.map((c) => (
                        <label
                          key={c.value}
                          className="flex cursor-pointer items-center gap-3 text-sm text-[#0F172A]"
                        >
                          <input
                            type="checkbox"
                            checked={field.value.includes(c.value)}
                            onChange={() =>
                              toggleMultiValue(
                                field.value,
                                c.value,
                                field.onChange,
                              )
                            }
                            className="size-4 rounded border border-[#D9E2F2]"
                          />
                          {c.label}
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col items-center">
                <Button
                  className="mt-6 h-10! w-full max-w-180 cursor-pointer rounded-xl text-base lg:h-9 lg:text-sm"
                  type="submit"
                >
                  Применить фильтры
                </Button>
                <Button
                  className="mt-3 h-10! w-full max-w-180 cursor-pointer rounded-xl text-base lg:h-9 lg:text-sm"
                  variant="outline"
                  type="button"
                  onClick={onReset}
                >
                  Сбросить
                </Button>
              </div>
            </form>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex justify-between">
            <p>
              Найдено: <b>{data?.count ?? 0}</b> товаров
            </p>

            <Select value={sort} onValueChange={updateSort}>
              <SelectTrigger className="h-10! w-50">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={0}>
                <SelectItem className="h-9!" value="price_asc">
                  Цена ↑
                </SelectItem>
                <SelectItem className="h-9!" value="price_desc">
                  Цена ↓
                </SelectItem>
                <SelectItem className="h-9!" value="rating">
                  Рейтинг
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            ref={productsRef}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {isLoading && <div>Загрузка...</div>}

            {!isLoading &&
              products.map((p: any) => <ListingCard key={p.id} listing={p} />)}
          </div>

          {!isLoading && products.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              Ничего не найдено
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(Math.max(1, page - 1))}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={page === p}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext onClick={() => goToPage(page + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </main>
  );
}
