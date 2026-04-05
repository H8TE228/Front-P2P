import { useTheme } from "@/hooks";
import type { Theme } from "@/types";
import {
  Heart,
  Laptop,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { cloneElement } from "react";
import { Link } from "react-router-dom";

const interFont =
  '"Inter Variable", Inter, system-ui, sans-serif' as const;

function ThemeHeaderToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  const icon =
    theme === "light" ? (
      <Sun strokeWidth={2} />
    ) : theme === "dark" ? (
      <Moon strokeWidth={2} />
    ) : (
      <Laptop strokeWidth={2} />
    );

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Тема: ${theme}. Нажмите, чтобы переключить`}
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-[var(--app-text-muted)] transition-colors hover:bg-[var(--app-button-muted)] hover:text-[var(--app-text)]"
    >
      {cloneElement(icon, { className: "size-5 shrink-0" })}
    </button>
  );
}

const navItems = [
  { icon: Heart, label: "Избранное" },
  { icon: MessageCircle, label: "Сообщения" },
  { icon: User, label: "Профиль" },
] as const;

export function SiteHeader() {
  return (
    <header
      className="box-border flex h-16 w-full items-center border-b border-[var(--app-border)] bg-[var(--header)]"
      style={{ fontFamily: interFont }}
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] min-w-0 items-center gap-6 overflow-x-auto px-4">
        <div className="flex shrink-0 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-[var(--app-text)] no-underline"
          >
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[var(--app-accent)] px-2">
              <span
                className="box-border h-4 w-4 shrink-0 rounded-[6px] border-2 border-white bg-transparent"
                aria-hidden
              />
            </span>
            <span className="whitespace-nowrap text-xl font-bold leading-none tracking-[-0.5px]">
              ВещьВокруг
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-[10px] bg-[var(--app-button-muted)] px-3 text-sm font-medium leading-5 text-[var(--app-text-secondary)] transition-colors hover:opacity-90"
          >
            <Menu
              className="h-4 w-4 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            <span className="hidden sm:inline">Каталог</span>
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-36 shrink-0 items-center justify-center gap-1.5 rounded-[10px] border border-[var(--app-border)] bg-[var(--app-input-surface)] px-3 text-sm font-medium leading-5 text-[var(--app-text-secondary)] transition-colors hover:opacity-90"
          >
            <MapPin
              className="size-4 shrink-0 text-[var(--app-accent)]"
              strokeWidth={2}
              aria-hidden
            />
            <span className="truncate">Екатеринбург</span>
          </button>

          <div className="relative hidden min-w-0 max-w-[408px] flex-1 md:block">
            <input
              type="search"
              placeholder="Поиск по товарам, аренде и совладению..."
              className="h-10 w-full rounded-[10px] border border-[var(--app-border)] bg-[var(--app-input-surface)] py-2 pl-4 pr-10 text-sm leading-normal text-[var(--app-text)] placeholder:text-[var(--app-text-subtle)] focus:border-[var(--app-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
              aria-label="Поиск"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[var(--app-text-subtle)]"
              strokeWidth={2}
              aria-hidden
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <ThemeHeaderToggle />

          <nav
            className="hidden items-center gap-4 lg:flex"
            aria-label="Быстрые действия"
          >
            {navItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex min-w-[56px] flex-col items-center gap-2 px-0.5 py-0.5 text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-text)]"
              >
                <Icon
                  className="size-5 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="max-w-[4.5rem] text-center text-[10px] font-medium leading-tight tracking-normal">
                  {label}
                </span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="flex h-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--app-accent)] px-4 text-sm font-medium leading-5 text-white transition-opacity hover:opacity-90"
          >
            Разместить
          </button>
        </div>
      </div>
    </header>
  );
}
