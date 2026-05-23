import type { SharedRental } from "@/api";
import type { ItemDetail } from "@/api/schema";

export function isShareListing(
  product: Pick<ItemDetail, "max_active_transactions">,
): boolean {
  return (product.max_active_transactions ?? 1) > 1;
}

export function parseListingPrice(price: string): number {
  const n = Number.parseFloat(price);
  return Number.isFinite(n) ? n : 0;
}

export function shareSlotPercent(totalSlots: number): number {
  if (totalSlots <= 0) return 100;
  return 100 / totalSlots;
}

export function defaultSharedRentalPeriod(slotsNeeded: number) {
  const daysPerSlot = 7;
  const totalDays = daysPerSlot * Math.max(slotsNeeded, 2);

  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + totalDays);

  return {
    planned_start: start.toISOString(),
    planned_end: end.toISOString(),
  };
}

export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  pickup: "Самовывоз",
  mail: "Доставка почтой",
};

export function isSharedRentalItemOwner(
  rental: SharedRental,
  userId: number,
): boolean {
  return rental.item_detail?.owner?.id === userId;
}

export function userSharedRentalRole(
  rental: SharedRental,
  userId: number,
): "owner" | "creator" | "participant" | null {
  if (isSharedRentalItemOwner(rental, userId)) return "owner";
  if (rental.creator === userId) return "creator";
  if (rental.segments.some((s) => s.participant === userId)) return "participant";
  return null;
}

export function canApproveSharedRental(
  rental: SharedRental,
  userId: number,
): boolean {
  return (
    rental.status === "collecting" &&
    rental.is_full &&
    isSharedRentalItemOwner(rental, userId)
  );
}

/** Отмена всей заявки (DELETE) — только создатель на этапе набора. */
export function canCancelSharedRental(
  rental: SharedRental,
  userId: number,
): boolean {
  return rental.status === "collecting" && rental.creator === userId;
}

/** Выход из занятого слота — участник, не создатель, на этапе набора. */
export function canLeaveSharedRental(
  rental: SharedRental,
  userId: number,
): boolean {
  if (rental.status !== "collecting" || rental.creator === userId) {
    return false;
  }

  return rental.segments.some((segment) => segment.participant === userId);
}

/** Создатель заявки или занявший слот (не только владелец объявления). */
export function isSharedRentalCoParticipant(
  rental: SharedRental,
  userId: number,
): boolean {
  if (rental.creator === userId) return true;
  return rental.segments.some((s) => s.participant === userId);
}

export function resolveSharedRentalStatusPresentation(
  rental: SharedRental,
  viewerId?: number,
): {
  label: string;
  tone: "pending" | "approved" | "active" | "returning" | "completed" | "rejected";
  dotClassName: string;
} {
  const isOwner =
    viewerId !== undefined && isSharedRentalItemOwner(rental, viewerId);

  if (rental.status === "collecting" && rental.is_full) {
    return {
      label: isOwner ? "Подтвердите заявку" : "Ждёт одобрения",
      tone: "approved",
      dotClassName: "bg-blue-500",
    };
  }

  if (rental.status === "collecting") {
    return {
      label: SHARED_RENTAL_STATUS_LABELS.collecting,
      tone: "pending",
      dotClassName: "bg-amber-500",
    };
  }

  if (rental.status === "approved") {
    return {
      label: SHARED_RENTAL_STATUS_LABELS.approved,
      tone: "approved",
      dotClassName: "bg-blue-500",
    };
  }

  if (rental.status === "active") {
    return {
      label: SHARED_RENTAL_STATUS_LABELS.active,
      tone: "active",
      dotClassName: "bg-emerald-500",
    };
  }

  if (rental.status === "returning") {
    return {
      label: SHARED_RENTAL_STATUS_LABELS.returning,
      tone: "returning",
      dotClassName: "bg-violet-500",
    };
  }

  if (rental.status === "completed") {
    return {
      label: SHARED_RENTAL_STATUS_LABELS.completed,
      tone: "completed",
      dotClassName: "bg-slate-400",
    };
  }

  if (rental.status === "cancelled" || rental.status === "expired") {
    return {
      label: SHARED_RENTAL_STATUS_LABELS[rental.status] ?? rental.status,
      tone: "rejected",
      dotClassName: "bg-rose-500",
    };
  }

  return {
    label: SHARED_RENTAL_STATUS_LABELS[rental.status] ?? rental.status,
    tone: "pending",
    dotClassName: "bg-amber-500",
  };
}

/** Заявка, к которой пользователь уже присоединился (создатель или участник). */
export function findUserCollectingRental(
  rentals: SharedRental[] | undefined,
  userId: number,
) {
  return rentals?.find(
    (r) =>
      r.status === "collecting" && userSharedRentalRole(r, userId) !== null,
  );
}

/** Чужая открытая заявка со свободным слотом — можно join. */
export function pickJoinableSharedRental(
  rentals: SharedRental[] | undefined,
  userId: number,
) {
  return rentals?.find((r) => {
    if (r.status !== "collecting" || r.is_full) return false;
    if (userSharedRentalRole(r, userId) !== null) return false;
    return r.segments.some((s) => s.is_free);
  });
}

export function countFreeSharedSegments(
  rental: SharedRental | undefined,
  fallbackTotal: number,
) {
  if (!rental) return fallbackTotal;
  return rental.segments.filter((s) => s.is_free).length;
}

export const SHARED_RENTAL_STATUS_LABELS: Record<string, string> = {
  collecting: "Набор участников",
  approved: "Подтверждена",
  active: "Активна",
  returning: "Возврат",
  completed: "Завершена",
  cancelled: "Отменена",
  expired: "Истекла",
};
