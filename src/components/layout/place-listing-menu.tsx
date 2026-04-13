import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const PLACE_OPTIONS = [
  {
    id: "rent",
    title: "Сдать вещь в аренду",
    description: "Зарабатывайте на вещах, которые простаивают без дела.",
    to: "/",
  },
  {
    id: "coown",
    title: "Предложить для совладения",
    description:
      "Найдите партнеров для совместной покупки или использования.",
    to: "/",
  },
];

export function PlaceListingMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
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

  return (
    <div ref={rootRef} className="relative shrink-0">
      <Button
        type="button"
        variant="blue"
        onClick={() => setOpen((value) => !value)}
        className="h-9 rounded-[10px] px-4"
      >
        Разместить
      </Button>

      {open ? (
        <div
          className={cn(
            "absolute top-full right-0 z-[110] mt-2 w-64 max-w-[min(256px,calc(100vw-2rem))] rounded-[14px] border border-[#E5E7EB] bg-white p-px shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)]",
            "dark:border-[#1D293D] dark:bg-[#0F172B]",
          )}
        >
          <div className="overflow-hidden rounded-[13px] p-[7px] pb-px">
            {PLACE_OPTIONS.map((option) => (
              <Link
                key={option.id}
                to={option.to}
                onClick={close}
                className="block p-3 text-left no-underline transition-colors hover:bg-[#F9FAFB] dark:hover:bg-[#1D293D]/40"
              >
                <span className="block text-base font-medium leading-6 text-[#0F172B] dark:text-[#F1F5F9]">
                  {option.title}
                </span>
                <span className="mt-1 block text-xs font-normal leading-4 text-[#62748E] dark:text-[#90A1B9]">
                  {option.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
