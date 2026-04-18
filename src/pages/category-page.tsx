import { ListingCard } from "@/components/catalog/listing-card";
import { CATALOG_CATEGORIES, MOCK_LISTINGS } from "@/constants/constants";
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const dealOptions = ["Любой тип", "Только аренда", "Совместное владение"];
const conditionOptions = ["Новое", "Б/у, идеальное", "Б/у, хорошее"];
const sortOptions = ["По популярности", "Дешевле", "Дороже", "Выше рейтинг"];

export function CategoryPage() {
  const { categoryId } = useParams();
  const [activeTab, setActiveTab] = useState("Все товары");
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [dealChecked, setDealChecked] = useState([true, false, false]);
  const [conditionChecked, setConditionChecked] = useState([false, false, false]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [appliedDeal, setAppliedDeal] = useState([true, false, false]);
  const [appliedPriceFrom, setAppliedPriceFrom] = useState<number | null>(null);
  const [appliedPriceTo, setAppliedPriceTo] = useState<number | null>(null);
  const [filtersApplyTick, setFiltersApplyTick] = useState(0);

  const category = useMemo(
    () => CATALOG_CATEGORIES.find((item) => item.id === categoryId),
    [categoryId],
  );

  const tabs = useMemo(
    () => ["Все товары", ...(category?.sub ?? [])],
    [category?.sub],
  );

  const filteredListings = useMemo(() => {
    const hasAnyDeal = appliedDeal.some(Boolean);
    const dealFiltered = MOCK_LISTINGS.filter((listing) => {
      if (!hasAnyDeal || appliedDeal[0]) {
        return true;
      }
      if (listing.tag === "rent" && appliedDeal[1]) {
        return true;
      }
      if (listing.tag === "coownership" && appliedDeal[2]) {
        return true;
      }
      return false;
    });

    return dealFiltered.filter((listing) => {
      if (appliedPriceFrom !== null && listing.priceRub < appliedPriceFrom) {
        return false;
      }
      if (appliedPriceTo !== null && listing.priceRub > appliedPriceTo) {
        return false;
      }
      return true;
    });
  }, [appliedDeal, appliedPriceFrom, appliedPriceTo]);

  const sortedListings = useMemo(() => {
    const listings = [...filteredListings];
    if (selectedSort === "Дешевле") {
      return listings.sort((a, b) => a.priceRub - b.priceRub);
    }
    if (selectedSort === "Дороже") {
      return listings.sort((a, b) => b.priceRub - a.priceRub);
    }
    if (selectedSort === "Выше рейтинг") {
      return listings.sort((a, b) => b.rating - a.rating);
    }
    return listings.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }, [filteredListings, selectedSort]);

  const hasAppliedFilters = useMemo(() => {
    const dealChanged =
      appliedDeal[0] !== true || appliedDeal[1] !== false || appliedDeal[2] !== false;
    return dealChanged || appliedPriceFrom !== null || appliedPriceTo !== null;
  }, [appliedDeal, appliedPriceFrom, appliedPriceTo]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-8 pb-14">
      <div className="flex items-center gap-1 text-sm leading-5">
        <Link
          to="/"
          className="text-[#62748E] no-underline hover:underline dark:text-[#90A1B9]"
        >
          Главная
        </Link>
        <ChevronRight className="size-4 text-[#62748E] dark:text-[#90A1B9]" strokeWidth={2} />
        <span className="text-[#0F172B] dark:text-[#F1F5F9]">{category.name}</span>
      </div>

      <h1 className="mt-7 text-4xl font-bold leading-10 tracking-[-0.9px] text-[#0F172B] dark:text-[#F1F5F9]">
        {category.name}
      </h1>

      <div className="mt-[34px] flex flex-wrap gap-2.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={
                isActive
                  ? "h-[38px] rounded-[14px] bg-[#0F172B] px-4 text-sm font-medium leading-5 text-white dark:bg-[#F1F5F9] dark:text-[#0F172B]"
                  : "h-[38px] rounded-[14px] bg-[#F1F5F9] px-4 text-sm font-medium leading-5 text-[#314158] hover:bg-[#E2E8F0] dark:bg-[#1D293D] dark:text-[#CAD5E2] dark:hover:bg-[#334155]"
              }
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-start gap-8">
        <aside className="w-64 shrink-0">
          <div>
            <h3 className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#0F172B] uppercase dark:text-[#F1F5F9]">
              Тип сделки
            </h3>
            <div className="mt-3.5 space-y-2.5">
              {dealOptions.map((option, index) => (
                <label key={option} className="flex items-center text-sm font-medium leading-5 text-[#314158] dark:text-[#CAD5E2]">
                  <input
                    type="checkbox"
                    checked={dealChecked[index]}
                    onChange={() => {
                      setDealChecked((prev) => {
                        if (index === 0) {
                          return [true, false, false];
                        }
                        const next = [...prev];
                        next[index] = !next[index];
                        next[0] = false;
                        if (!next[1] && !next[2]) {
                          return [true, false, false];
                        }
                        return next;
                      });
                    }}
                    className="size-4 rounded border border-[#E2E8F0] bg-[#F1F5F9] text-[#0F172B] accent-[#0F172B]"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-[#F1F5F9] pt-8 dark:border-[#1D293D]">
            <h3 className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#0F172B] uppercase dark:text-[#F1F5F9]">
              Цена, ₽
            </h3>
            <div className="mt-3.5 flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#62748E] dark:text-[#90A1B9]">
                  от
                </span>
                <input
                  type="number"
                  value={priceFrom}
                  onChange={(event) => setPriceFrom(event.target.value)}
                  className="h-[38px] w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-2 pr-3 pl-8 text-sm leading-5 text-[#0F172B] outline-none focus:border-[#155DFC] dark:border-[#334155] dark:bg-[#0F172B] dark:text-[#F1F5F9]"
                />
              </div>
              <span className="text-sm text-[#62748E] dark:text-[#90A1B9]">-</span>
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#62748E] dark:text-[#90A1B9]">
                  до
                </span>
                <input
                  type="number"
                  value={priceTo}
                  onChange={(event) => setPriceTo(event.target.value)}
                  className="h-[38px] w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-2 pr-3 pl-8 text-sm leading-5 text-[#0F172B] outline-none focus:border-[#155DFC] dark:border-[#334155] dark:bg-[#0F172B] dark:text-[#F1F5F9]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#F1F5F9] pt-8 dark:border-[#1D293D]">
            <h3 className="text-sm font-semibold leading-5 tracking-[0.7px] text-[#0F172B] uppercase dark:text-[#F1F5F9]">
              Состояние
            </h3>
            <div className="mt-3.5 space-y-2.5">
              {conditionOptions.map((option, index) => (
                <label key={option} className="flex items-center text-sm font-medium leading-5 text-[#314158] dark:text-[#CAD5E2]">
                  <input
                    type="checkbox"
                    checked={conditionChecked[index]}
                    onChange={() =>
                      setConditionChecked((prev) =>
                        prev.map((value, i) => (i === index ? !value : value)),
                      )
                    }
                    className="size-4 rounded border border-[#E2E8F0] bg-[#F1F5F9] text-[#0F172B] accent-[#0F172B]"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const parsedFrom = priceFrom.trim() === "" ? null : Number(priceFrom);
              const parsedTo = priceTo.trim() === "" ? null : Number(priceTo);
              const normalizedFrom =
                parsedFrom !== null && Number.isFinite(parsedFrom) ? parsedFrom : null;
              const normalizedTo =
                parsedTo !== null && Number.isFinite(parsedTo) ? parsedTo : null;
              setAppliedDeal(dealChecked);
              setAppliedPriceFrom(normalizedFrom);
              setAppliedPriceTo(normalizedTo);
              setFiltersApplyTick((value) => value + 1);
            }}
            className={
              hasAppliedFilters
                ? "mt-8 h-10 w-full rounded-[14px] bg-[#0F172B] px-4 py-2.5 text-sm font-medium leading-5 text-white hover:bg-[#1E293B] dark:bg-[#F1F5F9] dark:text-[#0F172B] dark:hover:bg-[#E2E8F0]"
                : "mt-8 h-10 w-full rounded-[14px] bg-[#F1F5F9] px-4 py-2.5 text-sm font-medium leading-5 text-[#0F172B] hover:bg-[#E2E8F0] dark:bg-[#1D293D] dark:text-[#F1F5F9] dark:hover:bg-[#334155]"
            }
          >
            Применить фильтры
          </button>
          {hasAppliedFilters ? (
            <button
              type="button"
              onClick={() => {
                setDealChecked([true, false, false]);
                setPriceFrom("");
                setPriceTo("");
                setAppliedDeal([true, false, false]);
                setAppliedPriceFrom(null);
                setAppliedPriceTo(null);
                setFiltersApplyTick(0);
              }}
              className="mt-2 h-10 w-full rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium leading-5 text-[#314158] hover:bg-[#F8FAFC] dark:border-[#334155] dark:bg-[#0F172B] dark:text-[#CAD5E2] dark:hover:bg-[#1D293D]"
            >
              Сбросить фильтры
            </button>
          ) : null}
          {filtersApplyTick > 0 ? (
            <p className="mt-2 text-xs font-medium leading-4 text-[#155DFC] dark:text-[#60A5FA]">
              Фильтры применены
            </p>
          ) : null}
        </aside>

        <section className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm leading-5 text-[#62748E] dark:text-[#90A1B9]">
                Найдено <span className="font-medium text-[#0F172B] dark:text-[#F1F5F9]">{sortedListings.length}</span> товаров
              </p>
              {hasAppliedFilters ? (
                <span className="inline-flex h-6 items-center rounded-full bg-[#DBEAFE] px-2.5 text-xs font-medium text-[#155DFC] dark:bg-[#1E3A5F]/60 dark:text-[#60A5FA]">
                  Фильтры активны
                </span>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenSort((value) => !value)}
                className="flex h-[38px] items-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-medium leading-5 text-[#314158] dark:border-[#334155] dark:bg-[#0F172B] dark:text-[#CAD5E2]"
              >
                <ArrowUpDown className="size-4 text-[#90A1B9] dark:text-[#90A1B9]" strokeWidth={2} />
                <span>{selectedSort}</span>
                <ChevronDown className="size-4 text-[#90A1B9] dark:text-[#90A1B9]" strokeWidth={2} />
              </button>

              {openSort ? (
                <div className="absolute top-full right-0 z-20 mt-2 min-w-full overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white py-1 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] dark:border-[#1D293D] dark:bg-[#0F172B]">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedSort(option);
                        setOpenSort(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-[#314158] hover:bg-[#F8FAFC] dark:text-[#CAD5E2] dark:hover:bg-[#1D293D]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {sortedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
