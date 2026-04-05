export type ListingTag = "rent" | "coownership";

export type ListingPrice =
  | { kind: "per_day" }
  | { kind: "share"; percent: number };

export interface Listing {
  id: string;
  tag: ListingTag;
  imageSrc: string;
  priceRub: number;
  price: ListingPrice;
  title: string;
  rating: number;
  reviewsCount: number;
  location: string;
}
