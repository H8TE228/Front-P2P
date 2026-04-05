import type { LucideIcon } from "lucide-react";
import {
  Box,
  Camera,
  Gamepad2,
  Plane,
  Smartphone,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

const listingFont =
  '"Inter Variable", Inter, system-ui, sans-serif' as const;

const categories: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "electronics", label: "Электроника", icon: Smartphone },
  { id: "transport", label: "Транспорт", icon: Plane },
  { id: "tools", label: "Инструменты", icon: Wrench },
  { id: "sport", label: "Спорт", icon: Zap },
  { id: "hobby", label: "Хобби", icon: Gamepad2 },
  { id: "appliances", label: "Техника", icon: Box },
  { id: "photo", label: "Фото/Видео", icon: Camera },
  { id: "misc", label: "Разное", icon: Star },
];

export function PopularCategoriesSection() {
  return (
    <section
      className="mb-16 w-full"
      style={{ fontFamily: listingFont }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold leading-8 tracking-[-0.6px] text-[var(--app-text)]">
          Популярные категории
        </h2>
        <button
          type="button"
          className="shrink-0 cursor-pointer border-0 bg-transparent text-sm font-medium leading-5 tracking-normal text-[var(--app-link)] transition-opacity hover:opacity-80"
        >
          Все категории
        </button>
      </div>

      <div className="mt-6 grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className="flex min-h-[114px] w-full min-w-0 cursor-pointer flex-col items-center gap-3 rounded-[14px] border border-[var(--app-border)] bg-[var(--app-surface-card)] px-4 pb-4 pt-4 text-center transition-colors hover:bg-[var(--app-surface-soft)]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--app-surface-muted)] px-3">
              <Icon
                className="size-6 text-[var(--app-text-muted)]"
                strokeWidth={1.75}
              />
            </div>
            <span className="text-sm font-medium leading-5 tracking-normal text-[var(--app-text-muted-strong)]">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
