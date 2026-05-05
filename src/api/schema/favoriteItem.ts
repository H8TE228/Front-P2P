import type { ItemDetail } from "./itemDetail";

export interface FavoriteItem {
  readonly id: number;
  item: ItemDetail;
  readonly created_at: string;
}

