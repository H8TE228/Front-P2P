import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks";
import { Search } from "lucide-react";
import { X } from "lucide-react";

export function SearchInput({
  onSelect,
  className,
}: {
  onSelect?: () => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState<{ search?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams(query ? { search: query } : {});
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const { data: products, isLoading } = useProducts(searchParams);

  const handleSelect = (productId: number) => {
    navigate(`/product/${productId}`);
    setQuery("");
    if (onSelect) onSelect();
  };

  return (
    <div className="relative w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по товарам, аренде и совладению..."
        className={cn(
          "h-10 w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] py-2 pr-10 pl-4 text-sm leading-normal text-[#0F172B] placeholder:text-[#90A1B9] focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC] focus:outline-none dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#F1F5F9] dark:placeholder:text-[#62748E]",
          className,
        )}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute top-1/2 right-9 -translate-y-1/2 cursor-pointer"
        >
          <X
            className="size-6 text-[#90A1B9] dark:text-[#62748E]"
            strokeWidth={2}
          />
        </button>
      )}
      <Search
        className="absolute top-1/2 right-3 size-6 -translate-y-1/2 cursor-default text-[#90A1B9] dark:text-[#62748E]"
        strokeWidth={2}
      />

      {query && (
        <ul className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg bg-white shadow-md">
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
                  "flex h-10 cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-gray-100",
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
