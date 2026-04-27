import type { Category } from "@/api/schema";
import { useCategories } from "@/hooks";
import { cn } from "@/lib/utils";
import { ChevronRight, CornerUpRight, Icon, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type CatalogMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function CatalogMegaMenu({ open, onClose }: CatalogMegaMenuProps) {
  const ref = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const { data, isLoading } = useCategories();

  const categories = data?.results || [];

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

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

  return (
    categories.length && (
      <div className="absolute top-full left-0 z-90 mt-2">
        <div className="w-screen max-w-[1160px]">
          <div
            ref={ref}
            className={cn(
              "flex max-h-[min(578px,calc(100vh-5rem))] w-full max-w-[1160px] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] md:flex-row",
              "dark:border-[#201d3d] dark:bg-[#0F172B]",
            )}
          >
            <nav
              className={cn(
                "flex max-h-[min(220px,35vh)] w-full shrink-0 flex-col overflow-y-auto border-[#F3F4F6] bg-[#F8FAFC]/50 py-2 pr-px md:max-h-none md:w-[min(340px,38%)] md:border-r md:border-b-0 dark:border-[#1D293D] dark:bg-slate-900/40",
                "border-b md:overflow-y-auto",
              )}
            >
              {categories.map((cat) => {
                // const Icon = cat.icon;
                const isSelected = cat.id === selectedCategory?.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 py-2.5 pr-5 pl-5 text-left text-sm leading-5 font-medium transition-colors hover:bg-blue-200",
                      isSelected
                        ? "relative z-[1] text-[#155DFC] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] dark:text-[#60A5FA]"
                        : "text-[#314158] dark:text-[#CBD5E1]",
                    )}
                  >
                    {/* <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isSelected
                        ? "text-[#155DFC] dark:text-[#60A5FA]"
                        : "text-[#90A1B9]",
                    )}
                    strokeWidth={2}
                  /> */}
                    <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                    {isSelected ? (
                      <ChevronRight
                        className="size-4 shrink-0 text-[#155DFC] dark:text-[#60A5FA]"
                        strokeWidth={2}
                      />
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold tracking-[-0.6px] text-[#0F172B] dark:text-[#F1F5F9]">
                    {selectedCategory?.name}
                  </h2>
                  <Link
                    to="/catalog"
                    onClick={onClose}
                    className="inline-flex items-center gap-0.5 text-sm font-medium text-[#155DFC] hover:underline dark:text-[#60A5FA]"
                  >
                    Все категории
                    <ChevronRight className="size-4" strokeWidth={2} />
                  </Link>
                </div>

                <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedCategory?.types?.map((type: any) => (
                    <li
                      key={type.id}
                      className="flex h-7 cursor-pointer px-2 py-1 hover:rounded-sm hover:bg-blue-100"
                    >
                      <Link
                        to={`/catalog?category=${selectedCategory.name}&type=${type.name}`}
                        onClick={onClose}
                        className="w-full text-sm font-medium text-[#314158] decoration-transparent transition-colors hover:text-[#155DFC] dark:text-[#CBD5E1] dark:hover:text-[#60A5FA]"
                      >
                        {type.name}
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
    )
  );
}
