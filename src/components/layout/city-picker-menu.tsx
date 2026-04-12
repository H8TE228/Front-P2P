import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const POPULAR_CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Екатеринбург",
  "Казань",
  "Новосибирск",
];

type CityPickerMenuProps = {
  city: string;
  onCityChange: (city: string) => void;
};

export function CityPickerMenu({ city, onCityChange }: CityPickerMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, close]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const filteredPopular = POPULAR_CITIES.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div ref={rootRef} className="relative shrink-0">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((value) => !value)}
        className="h-10 w-36 !justify-start gap-1.5 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] px-3 text-left text-sm font-medium leading-5 text-[#1D293D] hover:bg-[#F3F4F6] dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#E2E8F0] dark:hover:bg-[#0F172B]"
      >
        <MapPin
          className="size-4 shrink-0 text-[#155DFC]"
          strokeWidth={2}
        />
        <span className="min-w-0 flex-1 truncate">{city}</span>
      </Button>

      {open ? (
        <div
          className={cn(
            "absolute top-full left-0 z-[110] mt-2 w-80 max-w-[min(320px,calc(100vw-2rem))] rounded-[14px] border border-[#E5E7EB] bg-white p-px shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)]",
            "dark:border-[#1D293D] dark:bg-[#0F172B]",
          )}
        >
          <div className="overflow-hidden rounded-[13px]">
            <div className="border-b border-[#F3F4F6] px-3 py-3 dark:border-[#1D293D]">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск города..."
                className="h-9 w-full min-w-0 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-sm leading-5 text-[#0F172B] placeholder:text-[#90A1B9] outline-none focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC] dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#F1F5F9] dark:placeholder:text-[#62748E]"
              />
            </div>

            <button
              type="button"
              className="flex w-full items-center gap-2 border-b border-[#F3F4F6] px-3 py-3 text-left text-sm font-medium text-[#155DFC] transition-colors hover:bg-[#F9FAFB] dark:border-[#1D293D] dark:text-[#60A5FA] dark:hover:bg-[#1D293D]/40"
              onClick={() => {
                close();
              }}
            >
              <MapPin
                className="size-4 shrink-0 text-[#155DFC]"
                strokeWidth={2}
              />
              <span>Определить автоматически</span>
            </button>

            <div className="px-3 py-2">
              <p className="text-xs font-medium leading-4 tracking-[0.6px] text-[#90A1B9] uppercase dark:text-[#94A3B8]">
                Популярные города
              </p>
              <ul className="mt-2 flex flex-col">
                {filteredPopular.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      className="w-full rounded-md py-1.5 pr-2 pl-0 text-left text-sm font-medium leading-5 text-[#314158] transition-colors hover:bg-[#F3F4F6] dark:text-[#CBD5E1] dark:hover:bg-[#1D293D]"
                      onClick={() => {
                        onCityChange(name);
                        close();
                      }}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
              {filteredPopular.length === 0 ? (
                <p className="mt-2 text-sm text-[#90A1B9] dark:text-[#62748E]">
                  Ничего не найдено
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
