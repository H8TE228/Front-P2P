import { api } from "./api";
import { productsQueries } from "./products-queries";
import type { ItemDetail } from "./schema";

export type SharedRentalStatus =
  | "collecting"
  | "approved"
  | "active"
  | "returning"
  | "completed"
  | "cancelled"
  | "expired";

export type SharedRentalSegment = {
  readonly id: number;
  segment_index: number;
  segment_start: string;
  segment_end: string;
  participant: number | null;
  participant_name: string;
  is_free: boolean;
  days_count: number;
  joined_at: string | null;
};

export type SharedRental = {
  readonly id: number;
  item: number;
  item_detail?: ItemDetail;
  creator: number;
  creator_name: string;
  planned_start: string;
  planned_end: string;
  slots_needed: number;
  status: SharedRentalStatus;
  segments: SharedRentalSegment[];
  participants_count: number;
  is_full: boolean;
  days_per_slot: number;
  viewer_role: string;
  confirmed_received_at: string | null;
  confirmed_returned_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedSharedRentalList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: SharedRental[];
};

export type SharedRentalsListParams = {
  item?: number;
  status?: SharedRentalStatus;
  only_open?: 0 | 1;
  my?: 0 | 1;
  page?: number;
  page_size?: number;
};

export type CreateSharedRentalBody = {
  planned_start: string;
  planned_end: string;
  slots_needed: number;
  creator_segment_index: number;
  item?: number;
};

export type JoinSharedRentalBody = {
  segment_index: number;
};

const SHARED_RENTALS_BASE = "/listings/shared-rentals";

function normalizeSharedRentalList(
  data:
    | SharedRental[]
    | SharedRental
    | PaginatedSharedRentalList
    | undefined
    | null,
): SharedRental[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (
    typeof data === "object" &&
    "results" in data &&
    Array.isArray(data.results)
  ) {
    return data.results;
  }
  if (typeof data === "object" && "id" in data) {
    return [data as SharedRental];
  }
  return [];
}

function mergeSharedRentals(...lists: SharedRental[][]): SharedRental[] {
  const map = new Map<number, SharedRental>();

  for (const list of lists) {
    for (const rental of list) {
      if (rental?.id != null) {
        map.set(rental.id, rental);
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.updated_at ?? 0).getTime() -
      new Date(a.updated_at ?? 0).getTime(),
  );
}

export const sharedRentalsQueries = {
  getSharedRentals: async (params?: SharedRentalsListParams) => {
    const res = await api.get<PaginatedSharedRentalList>(`${SHARED_RENTALS_BASE}/`, {
      params,
    });
    return res.data;
  },

  getSharedRental: async (id: number | string) => {
    const res = await api.get<SharedRental>(`${SHARED_RENTALS_BASE}/${id}/`);
    return res.data;
  },

  createSharedRental: async (body: CreateSharedRentalBody) => {
    const res = await api.post<SharedRental>(`${SHARED_RENTALS_BASE}/`, body);
    return res.data;
  },

  createItemSharedRental: async (
    itemId: number | string,
    body: Omit<CreateSharedRentalBody, "item">,
  ) => {
    const res = await api.post<SharedRental>(
      `/listings/${itemId}/shared-rentals/`,
      body,
    );
    return res.data;
  },

  cancelSharedRental: async (id: number | string) => {
    await api.delete(`${SHARED_RENTALS_BASE}/${id}/`);
  },

  joinSharedRental: async (id: number | string, body: JoinSharedRentalBody) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/join/`,
      body,
    );
    return res.data;
  },

  leaveSharedRental: async (id: number | string) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/leave/`,
    );
    return res.data;
  },

  approveSharedRental: async (id: number | string) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/approve/`,
    );
    return res.data;
  },

  rejectSharedRental: async (id: number | string) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/reject/`,
    );
    return res.data;
  },

  confirmSharedRentalReceipt: async (id: number | string) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/confirm-receipt/`,
    );
    return res.data;
  },

  confirmSharedRentalReturn: async (id: number | string) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/confirm-return/`,
    );
    return res.data;
  },

  finalizeSharedRental: async (id: number | string) => {
    const res = await api.post<SharedRental>(
      `${SHARED_RENTALS_BASE}/${id}/finalize/`,
    );
    return res.data;
  },

  getMySharedRentals: async () => {
    const res = await api.get<
      SharedRental[] | SharedRental | PaginatedSharedRentalList
    >(`${SHARED_RENTALS_BASE}/my/`);
    return normalizeSharedRentalList(res.data);
  },

  getPendingSharedRentals: async () => {
    const res = await api.get<
      SharedRental[] | SharedRental | PaginatedSharedRentalList
    >(`${SHARED_RENTALS_BASE}/pending/`);
    return normalizeSharedRentalList(res.data);
  },

  /** Участник, создатель, владелец объявления и заявки с ожидающими действиями. */
  getSharedRentalsForDeals: async () => {
    const [asMember, pending, myFilteredPage] = await Promise.all([
      sharedRentalsQueries.getMySharedRentals(),
      sharedRentalsQueries.getPendingSharedRentals(),
      sharedRentalsQueries.getSharedRentals({ my: 1, page_size: 100 }),
    ]);

    let onOwnerListings: SharedRental[] = [];

    try {
      const myProducts = await productsQueries.getMyProducts();
      const items = myProducts.results ?? [];

      if (items.length > 0) {
        const perItem = await Promise.all(
          items.map((item) =>
            sharedRentalsQueries
              .getSharedRentals({ item: item.id, page_size: 50 })
              .then((page) => page.results ?? []),
          ),
        );
        onOwnerListings = perItem.flat();
      }
    } catch {
      onOwnerListings = [];
    }

    return mergeSharedRentals(
      asMember,
      pending,
      myFilteredPage.results ?? [],
      onOwnerListings,
    );
  },
};
