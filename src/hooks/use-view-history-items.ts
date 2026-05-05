import { productsQueries } from "@/api";
import type { Item, ItemDetail, ListingsViewHistoryListParams } from "@/api/schema";
import { useQueries } from "@tanstack/react-query";
import { useViewHistory } from "./use-view-history";

function itemDetailToItem(detail: ItemDetail): Item {
  return {
    id: detail.id,
    type: detail.type,
    type_name: detail.type_name,
    category_name: detail.category_name,
    owner: detail.owner.id,
    owner_name: detail.owner_name,
    name: detail.name,
    description: detail.description,
    characteristics: detail.characteristics,
    status: detail.status,
    price: detail.price,
    images: detail.images,
    created_at: detail.created_at,
    updated_at: detail.updated_at,
  };
}

export function useViewHistoryItems(params?: ListingsViewHistoryListParams) {
  const viewHistory = useViewHistory(params);
  const ids = viewHistory.data?.results.map((r) => r.item) ?? [];

  const productQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["products", String(id)],
      queryFn: () => productsQueries.getProduct(String(id)),
      enabled: Boolean(id),
    })),
  });

  const items = productQueries
    .map((q) => q.data)
    .filter(Boolean)
    .map((d) => itemDetailToItem(d as ItemDetail));

  const isLoading = viewHistory.isLoading || productQueries.some((q) => q.isLoading);

  return {
    viewHistory,
    items,
    isLoading,
  };
}

