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

export type ListingTag = "rent" | "coownership";

export type ListingPrice =
  | { kind: "per_day" }
  | { kind: "share"; percent: number };

export type Listing = {
  id: string;
  tag: ListingTag;
  imageSrc: string;
  priceRub: number;
  price: ListingPrice;
  title: string;
  rating: number;
  reviewsCount: number;
  location: string;
};
