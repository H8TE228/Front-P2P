import type { Item } from "@/api/schema";
import type { Category } from "@/api/schema";
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
import { useCategories, useProducts } from "@/hooks";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

type FormValues = {
  category: string;
  type: string;
  min_price: string;
  max_price: string;
  deal_type: string[];
  condition: string[];
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

export function CatalogPage() {
  const PAGE_SIZE = 32;
  const [searchParams, setSearchParams] = useSearchParams();
  const productsRef = useRef<HTMLDivElement | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const min_price = searchParams.get("min_price") || "";
  const max_price = searchParams.get("max_price") || "";
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

  const productsQuery = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      category_name: category || undefined,
      type_name: type || undefined,
      min_price: min_price || undefined,
      max_price: max_price || undefined,
      deal_type: deal_type.length > 0 ? deal_type : undefined,
      condition: condition.length > 0 ? condition : undefined,
      ordering: sort || undefined,
    }),
    [page, category, min_price, max_price, deal_type, condition, sort, type],
  );

  const { data, isLoading } = useProducts(productsQuery);
  const { data: categoriesData } = useCategories();

  const products = data?.results ?? [];
  const categories: Category[] = categoriesData?.results ?? [];
  const selectedCategory = useMemo(
    () => categories.find((item) => item.name === category),
    [categories, category],
  );
  const availableTypes = selectedCategory?.types ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const { handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      category,
      type,
      min_price,
      max_price,
      deal_type,
      condition,
    },
  });

  useEffect(() => {
    reset({ category, type, min_price, max_price, deal_type, condition });
  }, [category, type, min_price, max_price, deal_type, condition, reset]);

  const onSubmit = (values: FormValues) => {
    const params = new URLSearchParams();

    if (values.category) params.set("category", values.category);
    if (values.category && values.type) params.set("type", values.type);
    if (values.min_price) params.set("min_price", values.min_price);
    if (values.max_price) params.set("max_price", values.max_price);
    values.deal_type.forEach((value) => params.append("deal_type", value));
    values.condition.forEach((value) => params.append("condition", value));
    params.set("page", "1");
    if (sort) params.set("sort", sort);

    setSearchParams(params);
    if (window.innerWidth < 1024 && productsRef.current) {
      const top =
        productsRef.current.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const onReset = () => {
    setSearchParams({});
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
    params.delete("type");
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

  const breadcrumbs = [
    { label: "Главная", to: "/" },
    { label: "Каталог", to: "/catalog" },
    category && {
      label: category,
      to: `/catalog?category=${category}`,
    },
    type && {
      label: type,
      to: `/catalog?category=${category}&type=${type}`,
    },
  ].filter(Boolean);

  return (
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

        {categories?.map((c: any) => (
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
              <button type="button" className="cursor-pointer lg:hidden">
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {selectedCategory && (
                <div className="mb-8 border-b pb-8">
                  <h4 className="text-muted-foreground mb-3 text-sm font-semibold uppercase">
                    Тип товара
                  </h4>

                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <div className="space-y-3">
                        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#0F172A]">
                          <input
                            type="radio"
                            name="type"
                            checked={!field.value}
                            onChange={() => field.onChange("")}
                            className="size-4 border border-[#D9E2F2]"
                          />
                          Все типы
                        </label>

                        {availableTypes.map((item) => (
                          <label
                            key={item.id}
                            className="flex cursor-pointer items-center gap-3 text-sm text-[#0F172A]"
                          >
                            <input
                              type="radio"
                              name="type"
                              checked={field.value === item.name}
                              onChange={() => field.onChange(item.name)}
                              className="size-4 border border-[#D9E2F2]"
                            />
                            {item.name}
                          </label>
                        ))}
                      </div>
                    )}
                  />
                </div>
              )}

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
                    name="min_price"
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
                    name="max_price"
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
              products.map((p: Item) => <ListingCard key={p.id} product={p} />)}
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
