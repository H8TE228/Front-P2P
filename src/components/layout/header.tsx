import { useTheme } from "@/hooks";
import type { Theme } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";

function ThemeHeaderToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className="size-9 text-[#62748E] hover:bg-[#F3F4F6] hover:text-[#0F172B] dark:text-[#90A1B9] dark:hover:bg-[#1D293D] dark:hover:text-[#F1F5F9]"
    >
      {theme === "light" ? (
        <Sun className="size-5" strokeWidth={2} />
      ) : theme === "dark" ? (
        <Moon className="size-5" strokeWidth={2} />
      ) : (
        <Laptop className="size-5" strokeWidth={2} />
      )}
    </Button>
  );
}

const navItems = [
  { icon: Heart, label: "Избранное" },
  { icon: MessageCircle, label: "Сообщения" },
  { icon: User, label: "Профиль" },
];

export function Header() {
  return (
    <header className="box-border flex h-16 w-full items-center border-b border-[#E5E7EB] bg-[var(--header)] dark:border-[#1D293D]">
      <div className="mx-auto flex h-full w-full max-w-[1280px] min-w-0 items-center gap-6 overflow-x-auto px-4">
        <div className="flex shrink-0 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#0F172B] no-underline dark:text-[#F1F5F9]"
          >
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#155DFC] px-2">
              <span className="box-border h-4 w-4 shrink-0 rounded-[6px] border-2 border-white bg-transparent" />
            </span>
            <span className="text-xl leading-none font-bold tracking-[-0.5px] whitespace-nowrap">
              ВещьВокруг
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center">
          <Button
            variant="default"
            className="h-10 rounded-[10px] bg-[#F3F4F6] px-3 text-sm leading-5 font-medium text-[#1D293D] hover:bg-[#E5E7EB] dark:bg-[#1D293D] dark:text-[#E2E8F0] dark:hover:bg-[#1D293D]/80"
          >
            <Menu className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">Каталог</span>
          </Button>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="outline"
            className="h-10 w-36 justify-center gap-1.5 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] px-3 text-sm leading-5 font-medium text-[#1D293D] hover:bg-[#F3F4F6] dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#E2E8F0] dark:hover:bg-[#0F172B]"
          >
            <MapPin
              className="size-4 shrink-0 text-[#155DFC]"
              strokeWidth={2}
            />
            <span className="truncate">Екатеринбург</span>
          </Button>

          <div className="relative hidden max-w-[408px] min-w-0 flex-1 md:block">
            <input
              type="search"
              placeholder="Поиск по товарам, аренде и совладению..."
              className="h-10 w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] py-2 pr-10 pl-4 text-sm leading-normal text-[#0F172B] placeholder:text-[#90A1B9] focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC] focus:outline-none dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#F1F5F9] dark:placeholder:text-[#62748E]"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#90A1B9] dark:text-[#62748E]"
              strokeWidth={2}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <ThemeHeaderToggle />

          <nav className="hidden items-center gap-4 lg:flex">
            {navItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="flex min-w-[56px] flex-col items-center gap-2 px-0.5 py-0.5 text-[#62748E] transition-colors hover:text-[#0F172B] dark:text-[#90A1B9] dark:hover:text-[#F1F5F9]"
              >
                <Icon className="size-5 shrink-0" strokeWidth={2} />
                <span className="max-w-[4.5rem] text-center text-[10px] leading-tight font-medium tracking-normal">
                  {label}
                </span>
              </button>
            ))}
          </nav>

          <Button variant="blue" className="h-9 rounded-lg px-4">
            Разместить
          </Button>
        </div>
      </div>
    </header>
  );
}
