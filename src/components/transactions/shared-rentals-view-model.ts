import type { SharedRental, SharedRentalStatus } from "@/api";
import {
  canApproveSharedRental,
  canCancelSharedRental,
  canLeaveSharedRental,
  isSharedRentalCoParticipant,
  isSharedRentalItemOwner,
  resolveSharedRentalStatusPresentation,
  userSharedRentalRole,
} from "@/lib/listing-deal";

import type { DetailUi, StageRow, TransactionTabFilter } from "./transactions-view-model";
import { TRANSACTION_TAB_ITEMS } from "./transactions-view-model";

export { TRANSACTION_TAB_ITEMS as SHARED_RENTAL_TAB_ITEMS };

export function filterSharedRentalTabStatus(
  tab: TransactionTabFilter,
): SharedRentalStatus | undefined {
  if (tab === "all") {
    return undefined;
  }

  if (tab === "pending") {
    return "collecting";
  }

  if (tab === "approved") {
    return "approved";
  }

  if (tab === "active") {
    return "active";
  }

  if (tab === "returning") {
    return "returning";
  }

  if (tab === "completed") {
    return "completed";
  }

  return undefined;
}

export function sharedRentalMatchesTab(
  rental: SharedRental,
  tab: TransactionTabFilter,
): boolean {
  if (tab === "all") {
    return true;
  }

  const status = filterSharedRentalTabStatus(tab);
  return status !== undefined && rental.status === status;
}

export function filterSharedRentalsByTab(
  rentals: SharedRental[],
  tab: TransactionTabFilter,
): SharedRental[] {
  return rentals.filter((rental) => sharedRentalMatchesTab(rental, tab));
}

export function tallySharedRentalsByTab(
  rentals: SharedRental[],
): Partial<Record<TransactionTabFilter, number>> {
  const tally: Partial<Record<TransactionTabFilter, number>> = {};

  for (const ledger of TRANSACTION_TAB_ITEMS) {
    tally[ledger.id] = rentals.filter((rental) =>
      sharedRentalMatchesTab(rental, ledger.id),
    ).length;
  }

  return tally;
}

export type SharedRentalDetailUi = DetailUi & {
  passiveHintText?: string;
  cancelVisible?: boolean;
  leaveVisible?: boolean;
};

function viewerRoleLabel(rental: SharedRental, viewerId: number): string {
  const role = userSharedRentalRole(rental, viewerId);
  if (role === "owner") return "Вы владелец объявления";
  if (role === "creator") return "Вы создатель заявки";
  if (role === "participant") return "Вы участник";
  return "—";
}

function participantsSummary(rental: SharedRental): string {
  const names = rental.segments
    .filter((s) => !s.is_free && s.participant_name)
    .map((s) => s.participant_name);
  const unique = [...new Set(names)];
  if (unique.length === 0) return rental.creator_name || "—";
  return unique.join(", ");
}

function buildStages(rental: SharedRental, viewerId: number): StageRow[] {
  const isOwner = isSharedRentalItemOwner(rental, viewerId);
  const isCoParticipant = isSharedRentalCoParticipant(rental, viewerId);
  const filled = rental.participants_count ?? 0;
  const total = rental.slots_needed ?? 0;

  if (rental.status === "collecting" && !rental.is_full) {
    return [
      { kind: "done", title: "Заявка на совладение создана" },
      {
        kind: "wait",
        title: `Набор участников (${filled} из ${total})`,
      },
    ];
  }

  if (rental.status === "collecting" && rental.is_full) {
    return [
      { kind: "done", title: `Участники набраны (${total} из ${total})` },
      {
        kind: "wait",
        title: isOwner
          ? "Подтвердите или отклоните заявку"
          : "Ожидание одобрения владельца",
      },
    ];
  }

  if (rental.status === "approved") {
    return [
      { kind: "done", title: "Заявка подтверждена владельцем" },
      {
        kind: "wait",
        title: isCoParticipant
          ? "Подтвердите получение предмета"
          : "Участники подтверждают получение",
      },
    ];
  }

  if (rental.status === "active") {
    return [
      { kind: "done", title: "Получение предмета подтверждено" },
      {
        kind: "wait",
        title: isCoParticipant
          ? "По окончании периода подтвердите возврат"
          : "Совладение активно",
      },
    ];
  }

  if (rental.status === "returning") {
    return [
      { kind: "done", title: "Участники подтвердили возврат" },
      {
        kind: "wait",
        title: isOwner
          ? "Завершите сделку после проверки предмета"
          : "Ожидание завершения владельцем",
      },
    ];
  }

  if (rental.status === "completed") {
    return [{ kind: "done", title: "Совладение завершено" }];
  }

  if (rental.status === "cancelled" || rental.status === "expired") {
    return [
      {
        kind: "error",
        title:
          rental.status === "cancelled"
            ? "Заявка отменена"
            : "Срок набора истёк",
      },
    ];
  }

  return [{ kind: "wait", title: "Статус обновляется" }];
}

function statusSubtitle(rental: SharedRental, viewerId: number): string {
  const isOwner = isSharedRentalItemOwner(rental, viewerId);
  const isCoParticipant = isSharedRentalCoParticipant(rental, viewerId);

  if (rental.status === "collecting" && !rental.is_full) {
    return "Идёт набор участников на доли в предмете.";
  }

  if (rental.status === "collecting" && rental.is_full) {
    return isOwner
      ? "Все доли заняты. Подтвердите заявку, чтобы перейти к следующему этапу."
      : "Все доли заняты. Ожидайте решения владельца объявления.";
  }

  if (rental.status === "approved") {
    return isCoParticipant
      ? "Владелец одобрил заявку. Подтвердите, что вы получили предмет."
      : "Ожидайте, пока участники подтвердят получение предмета.";
  }

  if (rental.status === "active") {
    return isCoParticipant
      ? "Совладение активно. После использования подтвердите возврат предмета."
      : "Совладение активно. Участники пользуются предметом по своим долям.";
  }

  if (rental.status === "returning") {
    return isOwner
      ? "Участники вернули предмет. Подтвердите завершение сделки."
      : "Возврат зафиксирован. Владелец завершит сделку после проверки.";
  }

  if (rental.status === "completed") {
    return "Совладение успешно завершено.";
  }

  if (rental.status === "cancelled") {
    return "Заявка была отменена.";
  }

  if (rental.status === "expired") {
    return "Истёк срок набора участников.";
  }

  return "";
}

export function resolveSharedRentalDetailUi(
  rental: SharedRental,
  viewerId: number,
): SharedRentalDetailUi {
  const chip = resolveSharedRentalStatusPresentation(rental, viewerId);
  const isOwner = isSharedRentalItemOwner(rental, viewerId);
  const isCoParticipant = isSharedRentalCoParticipant(rental, viewerId);

  let acceptPrimaryLabel: string | undefined;
  let outlinePrimaryLabel: string | undefined;
  let fullWidthApproveLabel: string | undefined;
  let approveReturnLabel: string | undefined;
  let initiateReturnVisible = false;
  let passiveHintVisible = false;
  let passiveHintText: string | undefined;

  if (canApproveSharedRental(rental, viewerId)) {
    acceptPrimaryLabel = "Подтвердить";
    outlinePrimaryLabel = "Отклонить";
  } else if (rental.status === "approved" && isCoParticipant) {
    fullWidthApproveLabel = "Подтвердить получение";
  } else if (rental.status === "approved" && isOwner) {
    passiveHintVisible = true;
    passiveHintText =
      "Участники должны подтвердить получение. После этого статус сменится на «Активна».";
  } else if (rental.status === "active" && isCoParticipant) {
    initiateReturnVisible = true;
  } else if (rental.status === "active" && isOwner) {
    passiveHintVisible = true;
    passiveHintText = "Совладение активно. Участники подтвердят возврат по завершении периода.";
  } else if (rental.status === "returning" && isOwner) {
    approveReturnLabel = "Завершить сделку";
  } else if (rental.status === "returning" && isCoParticipant) {
    passiveHintVisible = true;
    passiveHintText = "Ожидайте, пока владелец объявления завершит сделку.";
  } else if (
    rental.status === "collecting" &&
    rental.is_full &&
    !isOwner
  ) {
    passiveHintVisible = true;
    passiveHintText = "Ожидайте одобрения заявки владельцем объявления.";
  }

  const cancelVisible = canCancelSharedRental(rental, viewerId);
  const leaveVisible = canLeaveSharedRental(rental, viewerId);

  return {
    chipLabel: chip.label,
    chipTone: chip.tone,
    chipDotClass: chip.dotClassName,
    statusSubtitle: statusSubtitle(rental, viewerId),
    rows: buildStages(rental, viewerId),
    passiveHintVisible,
    passiveHintText,
    acceptPrimaryLabel,
    outlinePrimaryLabel,
    fullWidthApproveLabel,
    approveReturnLabel,
    initiateReturnVisible,
    reviewAvailablity: "locked",
    cancelVisible,
    leaveVisible,
  };
}

export function sharedRentalViewerRoleLabel(
  rental: SharedRental,
  viewerId: number,
): string {
  return viewerRoleLabel(rental, viewerId);
}

export function sharedRentalParticipantsLine(
  rental: SharedRental,
): string {
  return participantsSummary(rental);
}
