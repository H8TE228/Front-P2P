import { authQueries } from "@/api/auth-queries";
import { productsQueries } from "@/api/products-queries";
import type { ItemDetail, ProfilePage } from "@/api/schema";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

export function useTransactionLookups(transactionIdsPayload: unknown) {
  const itemIds = useMemo(() => {
    const set = new Set<number>();
    if (Array.isArray(transactionIdsPayload)) {
      transactionIdsPayload.forEach((entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          "item" in entry &&
          typeof (entry as { item: unknown }).item === "number"
        ) {
          set.add((entry as { item: number }).item);
        }
      });
    }

    return [...set.values()];
  }, [transactionIdsPayload]);

  const userIds = useMemo(() => {
    const set = new Set<number>();
    if (Array.isArray(transactionIdsPayload)) {
      transactionIdsPayload.forEach((entry) => {
        if (
          entry &&
          typeof entry === "object" &&
          "owner" in entry &&
          "renter" in entry &&
          typeof (entry as { owner: unknown }).owner === "number" &&
          typeof (entry as { renter: unknown }).renter === "number"
        ) {
          const row = entry as { owner: number; renter: number };
          set.add(row.owner);
          set.add(row.renter);
        }
      });
    }

    return [...set.values()];
  }, [transactionIdsPayload]);

  const itemsQueries = useQueries({
    queries: itemIds.map((id) => ({
      queryKey: ["products", String(id)],
      queryFn: () => productsQueries.getProduct(String(id)),
      enabled: itemIds.length > 0,
      staleTime: 60_000,
    })),
  });

  const usersQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["user-profile", String(id)],
      queryFn: () => authQueries.userProfile(String(id)),
      enabled: userIds.length > 0,
      staleTime: 60_000,
    })),
  });

  const itemById = useMemo(() => {
    const map = new Map<number, ItemDetail>();
    itemIds.forEach((id, index) => {
      const payload = itemsQueries[index]?.data;
      if (payload) {
        map.set(id, payload);
      }
    });
    return map;
  }, [itemIds, itemsQueries]);

  const profileByUserId = useMemo(() => {
    const map = new Map<number, ProfilePage>();
    userIds.forEach((id, index) => {
      const payload = usersQueries[index]?.data;
      if (payload) {
        map.set(id, payload);
      }
    });
    return map;
  }, [userIds, usersQueries]);

  return {
    itemById,
    profileByUserId,
    itemsFetching: itemsQueries.some((entry) => entry.isFetching && !entry.data),
    profilesFetching: usersQueries.some((entry) => entry.isFetching && !entry.data),
  };
}
