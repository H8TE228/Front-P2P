import { useTheme } from "@/hooks";
import type { Theme } from "@/types";
import { Sun, Moon, Laptop } from "lucide-react";
import type { JSX } from "react";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; icon: JSX.Element }[] = [
    { value: "light", icon: <Sun /> },
    { value: "dark", icon: <Moon /> },
    { value: "system", icon: <Laptop /> },
  ];

  return (
    <div className="flex gap-3">
      {themes.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`rounded-full p-1 transition-colors ${theme === value ? "bg-gray-200 dark:bg-gray-700" : "bg-white dark:bg-[#171717]"} hover:bg-gray-300 dark:hover:bg-gray-600`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
