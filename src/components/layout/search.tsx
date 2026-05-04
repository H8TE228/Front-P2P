import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks";
import { Search, X } from "lucide-react";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: products, isLoading } = useProducts(searchParams);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setSearchParams(query ? { search: query } : {});
  //   }, 300);

  //   return () => clearTimeout(timeout);
  // }, [query]);

  const closeResults = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!query) {
      setOpen(false);
      return;
    }

    setOpen(true);
  }, [query]);

  useEffect(() => {
    if (!open) {
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
  }, [open, closeResults]);

  const handleSelect = (productId: number) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setOpen(false);
    if (onSelect) onSelect();
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <Input
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const nextQuery = e.target.value;
          setQuery(nextQuery);
          setOpen(Boolean(nextQuery));
        }}
        onFocus={() => {
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
        onClick={() => {
          setSearchParams({ search: query });
        }}
      >
        <Search
          className="absolute top-1/2 right-3 size-6 -translate-y-1/2 cursor-pointer text-[#90A1B9] dark:text-[#62748E]"
          strokeWidth={2}
        />
      </button>

      {query && open && (
        <ul className="absolute top-full left-0 z-10 mt-2 w-full rounded-lg bg-white shadow-md">
          {isLoading && (
            <li
              className={cn("h-10 px-2 py-2 text-sm text-gray-500", className)}
            >
              Загрузка...
            </li>
          )}

          {!isLoading && products?.results.length === 0 && (
            <li
              className={cn("h-10 px-2 py-2 text-sm text-gray-500", className)}
            >
              Ничего не найдено
            </li>
          )}

          {!isLoading &&
            products?.results.slice(0, 8).map((product: any) => (
              <li
                key={product.id}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-100",
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
