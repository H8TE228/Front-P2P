import { CityPickerMenu } from "./city-picker-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks";
import type { Theme } from "@/types";
import { cn } from "@/lib/utils";
import {
  Heart,
  Laptop,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput } from "../search";

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

type SiteHeaderProps = {
  catalogOpen: boolean;
  onCatalogOpenChange: (open: boolean) => void;
};

export function Header({ catalogOpen, onCatalogOpenChange }: SiteHeaderProps) {
  const navigate = useNavigate();
  const [city, setCity] = useState("Екатеринбург");

  return (
    <header className="bg-header relative z-[100] box-border flex h-16 w-full items-center border-b border-[#E5E7EB] dark:border-[#1D293D]">
      <div className="mx-auto flex h-full w-full max-w-[1280px] min-w-0 items-center gap-6 px-4">
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
            type="button"
            variant={catalogOpen ? "blue" : "default"}
            onClick={() => onCatalogOpenChange(!catalogOpen)}
            className={cn(
              "h-10 rounded-[10px] px-3 text-sm leading-5 font-medium",
              catalogOpen
                ? "text-white hover:bg-[#155DFC]/90"
                : "bg-[#F3F4F6] text-[#1D293D] hover:bg-[#E5E7EB] dark:bg-[#1D293D] dark:text-[#E2E8F0] dark:hover:bg-[#1D293D]/80",
            )}
          >
            <Menu className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">Каталог</span>
          </Button>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <CityPickerMenu city={city} onCityChange={setCity} />

          <div className="relative hidden max-w-[408px] min-w-0 flex-1 md:block">
            <SearchInput />
          </div>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <ThemeHeaderToggle />

            <nav className="hidden items-center gap-4 lg:flex">
              {navItems.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex min-w-[56px] cursor-pointer flex-col items-center gap-2 px-0.5 py-0.5 text-[#62748E] transition-colors hover:text-[#0F172B] dark:text-[#90A1B9] dark:hover:text-[#F1F5F9]"
                >
                  <Icon className="size-5 shrink-0" strokeWidth={2} />
                  <span className="max-w-[4.5rem] text-center text-[10px] leading-tight font-medium tracking-normal">
                    {label}
                  </span>
                </button>
              ))}
            </nav>

            <Button
              type="button"
              variant="blue"
              onClick={() => navigate("/listing-form")}
              className="h-9 rounded-[10px] px-4"
            >
              Разместить
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
