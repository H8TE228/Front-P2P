import { CATALOG_CATEGORIES } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { ChevronRight, CornerUpRight, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type CatalogMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function CatalogMegaMenu({ open, onClose }: CatalogMegaMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleEscape]);

  if (!open) {
    return null;
  }

  const selected = CATALOG_CATEGORIES[selectedIndex];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[75]">
      <div className="mx-auto w-full max-w-[1280px] px-4">
        <div
          className={cn(
            "pointer-events-auto flex max-h-[min(578px,calc(100vh-5rem))] w-full max-w-[1160px] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] md:flex-row",
            "dark:border-[#1D293D] dark:bg-[#0F172B]",
          )}
        >
          <nav
            className={cn(
              "flex max-h-[min(220px,35vh)] w-full shrink-0 flex-col overflow-y-auto border-[#F3F4F6] bg-[#F8FAFC]/50 py-2 pr-px md:max-h-none md:w-[min(340px,38%)] md:border-r md:border-b-0 dark:border-[#1D293D] dark:bg-slate-900/40",
              "border-b md:overflow-y-auto",
            )}
          >
            {CATALOG_CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={cat.id}
                  className={cn(
                    "flex w-full items-stretch",
                    isSelected &&
                      "relative z-[1] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "flex min-w-0 flex-1 cursor-pointer items-center gap-3 py-2.5 pl-5 text-left text-sm leading-5 font-medium transition-colors hover:bg-blue-200",
                      isSelected ? "pr-2 text-[#155DFC] dark:text-[#60A5FA]" : "pr-5 text-[#314158] dark:text-[#CBD5E1]",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isSelected
                          ? "text-[#155DFC] dark:text-[#60A5FA]"
                          : "text-[#90A1B9]",
                      )}
                      strokeWidth={2}
                    />
                    <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                  </button>
                  {isSelected ? (
                    <Link
                      to={`/category/${cat.id}`}
                      onClick={onClose}
                      className="inline-flex shrink-0 items-center pr-5"
                      aria-label={`Открыть ${cat.name}`}
                    >
                      <ChevronRight
                        className="size-4 shrink-0 text-[#155DFC] dark:text-[#60A5FA]"
                        strokeWidth={2}
                      />
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-[-0.6px] text-[#0F172B] dark:text-[#F1F5F9]">
                  {selected.name}
                </h2>
                <Link
                  to={`/category/${selected.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-0.5 text-sm font-medium text-[#155DFC] hover:underline dark:text-[#60A5FA]"
                >
                  Все категории
                  <ChevronRight className="size-4" strokeWidth={2} />
                </Link>
              </div>

              <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {selected.sub.map((sub) => (
                  <li
                    key={sub}
                    className="flex h-7 cursor-pointer px-2 py-1 hover:rounded-sm hover:bg-blue-100"
                  >
                    <Link
                      to={`/category/${selected.id}`}
                      onClick={onClose}
                      className="w-full text-sm font-medium text-[#314158] decoration-transparent transition-colors hover:text-[#155DFC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA]"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 border-t border-[#F3F4F6] px-8 pt-6 pb-8 dark:border-[#1D293D]">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div
                  className={cn(
                    "flex gap-4 rounded-[14px] border border-transparent p-5",
                    "bg-gradient-to-br from-[#EFF6FF] to-[#EEF2FF] dark:from-[#1E3A5F]/40 dark:to-[#1E293B]",
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] dark:bg-[#1E3A5F]/50">
                    <Sparkles
                      className="size-5 text-[#155DFC] dark:text-[#60A5FA]"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm leading-5 font-semibold text-[#0F172B] dark:text-[#F1F5F9]">
                      Популярное в категории
                    </h3>
                    <p className="mt-1 text-xs leading-4 text-[#45556C] dark:text-[#94A3B8]">
                      Часто арендуют на этой неделе
                    </p>
                    <Link
                      to="/"
                      onClick={onClose}
                      className="mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-[#155DFC] hover:underline dark:text-[#60A5FA]"
                    >
                      Смотреть подборку
                      <ChevronRight className="size-4" strokeWidth={2} />
                    </Link>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex gap-4 rounded-[14px] border border-[#F1F5F9] bg-[#F8FAFC] p-5",
                    "dark:border-[#334155] dark:bg-[#1E293B]",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border border-[#F1F5F9] bg-white",
                      "dark:border-[#475569] dark:bg-[#0F172B]",
                    )}
                    style={{
                      boxShadow:
                        "0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A",
                    }}
                  >
                    <CornerUpRight
                      className="size-5 text-black dark:text-[#F1F5F9]"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm leading-5 font-semibold text-[#0F172B] dark:text-[#F1F5F9]">
                      Новинки проката
                    </h3>
                    <p className="mt-1 text-xs leading-4 text-[#45556C] dark:text-[#94A3B8]">
                      Свежие поступления от владельцев
                    </p>
                    <Link
                      to="/"
                      onClick={onClose}
                      className="mt-3 inline-flex items-center gap-0.5 text-sm font-medium text-[#314158] hover:underline dark:text-[#CBD5E1]"
                    >
                      Изучить новинки
                      <ChevronRight className="size-4" strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
