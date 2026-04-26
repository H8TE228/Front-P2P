import type { Category, Item, User } from "@/api/schema";

export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export interface ILoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface IProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[];
}

export interface ICategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}
