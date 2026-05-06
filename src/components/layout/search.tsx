import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useProducts,
  useSearchHistory,
  useLogSearch,
  useDeleteSearchHistory,
} from "@/hooks";
import type { SearchHistory } from "@/api/schema";
import { Clock, Search, X } from "lucide-react";
import { Input } from "../ui/input";

export function SearchInput({
  onSelect,
  className,
}: {
  onSelect?: () => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState<{ search?: string }>({});
  const [open, setOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const trimmedQuery = query.trim();
  const showHistory = inputFocused && !trimmedQuery;

  const { data: products, isLoading } = useProducts(searchParams, {
    enabled: !!searchParams.search,
  });
  const { data: searchHistoryData, isLoading: historyLoading } =
    useSearchHistory({ page_size: 8 }, { enabled: showHistory });
  const logSearch = useLogSearch();
  const deleteSearchHistory = useDeleteSearchHistory();

  const closeResults = useCallback(() => {
    setOpen(false);
    setInputFocused(false);
  }, []);

  const isTyping = inputFocused && trimmedQuery && !searchParams.search;

  // useEffect(() => {
  //   const trimmed = query.trim();

  //   if (!trimmed) {
  //     setSearchParams({});
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     setSearchParams({ search: trimmed });
  //   }, 300);

  //   return () => clearTimeout(timeout);
  // }, [query]);

  // useEffect(() => {
  //   if (!trimmedQuery) {
  //     setOpen(false);
  //     return;
  //   }

  //   setOpen(true);
  // }, [trimmedQuery]);

  useEffect(() => {
    if (!open && !showHistory) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        closeResults();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeResults();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, showHistory, closeResults]);

  const handleSelect = (productId: number) => {
    if (trimmedQuery) {
      logSearch.mutate({ query_text: trimmedQuery, filters: "" });
    }
    navigate(`/product/${productId}`);
    setQuery("");
    setOpen(false);
    setInputFocused(false);
    if (onSelect) onSelect();
  };

  const handleHistoryPick = (item: SearchHistory) => {
    setQuery(item.query_text);
    setSearchParams({ search: item.query_text });
    setOpen(true);
    const filters = typeof item.filters === "string" ? item.filters : "";
    logSearch.mutate({ query_text: item.query_text, filters });
  };

  const runSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearchParams({ search: trimmed });
    setOpen(true);
    logSearch.mutate({ query_text: trimmed, filters: "" });
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <Input
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const nextQuery = e.target.value;
          setSearchParams({});
          setQuery(nextQuery);
          setOpen(true);
        }}
        onFocus={() => {
          setInputFocused(true);
          if (query) {
            setOpen(true);
          }
        }}
        placeholder="Поиск по товарам, арнеде и совладению"
        className={cn(
          "h-10 w-full rounded-[10px] border border-[#E5E7EB] bg-[#f9fbfa] py-2 pr-10 pl-4 text-sm leading-normal text-[#0F172B] placeholder:text-[#90A1B9] focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC] focus:outline-none dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#F1F5F9] dark:placeholder:text-[#62748E]",
          className,
        )}
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setOpen(false);
          }}
          className="absolute top-1/2 right-10 -translate-y-1/2 cursor-pointer"
        >
          <X
            className="size-6 text-[#90A1B9] dark:text-[#62748E]"
            strokeWidth={2}
          />
        </button>
      )}
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0"
        onClick={runSearch}
        aria-label="Искать"
      >
        <Search
          className="size-6 text-[#90A1B9] dark:text-[#62748E]"
          strokeWidth={2}
        />
      </button>

      {showHistory && (
        <div
          className={cn(
            "absolute top-full left-0 z-10 mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-md dark:border-[#1D293D] dark:bg-[#0F172B]",
            className,
          )}
        >
          <div className="text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#90A1B9] uppercase">
            Недавние запросы
          </div>
          {historyLoading ? (
            <div className="mt-3 text-sm text-[#90A1B9]">Загрузка...</div>
          ) : (
            <ul className="mt-3 flex flex-col gap-1">
              {(searchHistoryData?.results ?? [])
                .filter((item) => item.query_text?.trim())
                .map((item) => (
                  <li key={item.id}>
                    <div className="flex w-full items-center">
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-[#F3F4F6] dark:hover:bg-[#1D293D]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleHistoryPick(item)}
                      >
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <Clock
                            className="mt-0.5 size-4 shrink-0 text-[#90A1B9]"
                            strokeWidth={2}
                          />
                          <span className="truncate text-[14px] leading-5 font-medium text-[#314158] dark:text-[#E2E8F0]">
                            {item.query_text}
                          </span>
                        </div>
                        <span
                          className="ml-1 flex size-5 shrink-0 items-center justify-center rounded-full text-[#90A1B9] hover:text-[#314158] dark:text-[#62748E] dark:hover:text-[#E2E8F0]"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSearchHistory.mutate(item.id);
                          }}
                        >
                          <X className="size-3.5" strokeWidth={2} />
                        </span>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}

      {trimmedQuery && open && (
        <ul className="absolute top-full left-0 z-10 mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white shadow-md dark:bg-[#0F172B] dark:shadow-none">
          {isTyping && (
            <div className="h-11 p-4 text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#90A1B9] uppercase">
              Вводите запрос...
            </div>
          )}

          {isLoading && (
            <li
              className={cn(
                "h-11 p-4 text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#90A1B9] uppercase",
                className,
              )}
            >
              Загрузка...
            </li>
          )}

          {!isLoading && products?.results.length === 0 && (
            <li
              className={cn(
                "h-11 p-4 text-[12px] leading-4 font-semibold tracking-[0.6px] text-[#90A1B9] uppercase",
                className,
              )}
            >
              Ничего не найдено
            </li>
          )}

          {!isLoading &&
            products?.results.slice(0, 8).map((product: any) => (
              <li
                key={product.id}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-between rounded-lg px-4 py-4 text-sm hover:bg-gray-100 dark:hover:bg-[#1D293D]",
                  className,
                )}
                onClick={() => handleSelect(product.id)}
              >
                <div>{product.name}</div>
                <div>{product.price} руб</div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
