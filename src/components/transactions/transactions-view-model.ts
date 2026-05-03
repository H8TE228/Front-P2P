import type { Transaction } from "@/api/schema";
import { TransactionStatusEnum } from "@/api/schema";

import type { TransactionStatusTone } from "./transaction-status-chip";

export type TransactionTabFilter =
  | "all"
  | "pending"
  | "approved"
  | "active"
  | "returning"
  | "completed";

export const TRANSACTION_TAB_ITEMS: readonly {
  id: TransactionTabFilter;
  label: string;
}[] = [
  { id: "all", label: "Все" },
  { id: "pending", label: "Ожидают" },
  { id: "approved", label: "Подтверждены" },
  { id: "active", label: "Активные" },
  { id: "returning", label: "Возврат" },
  { id: "completed", label: "Завершенные" },
];

export function filterTabStatus(
  tab: TransactionTabFilter,
): TransactionStatusEnum | undefined {
  if (tab === "all") {
    return undefined;
  }

  if (tab === "pending") {
    return TransactionStatusEnum.pending;
  }

  if (tab === "approved") {
    return TransactionStatusEnum.approved;
  }

  if (tab === "active") {
    return TransactionStatusEnum.active;
  }

  if (tab === "returning") {
    return TransactionStatusEnum.returning;
  }

  if (tab === "completed") {
    return TransactionStatusEnum.completed;
  }

  return undefined;
}

export type StageRow = {
  kind: "done" | "wait" | "error";
  title: string;
};

export type CardUi = {
  chipLabel: string;
  chipTone: TransactionStatusTone;
  chipDotClass: string;
  roleLead: string;
  description: string;
  footerAccent?: string;
};

export type DetailUi = {
  chipLabel: string;
  chipTone: TransactionStatusTone;
  chipDotClass: string;
  statusSubtitle: string;
  rows: StageRow[];
  passiveHintVisible: boolean;
  acceptPrimaryLabel?: string;
  outlinePrimaryLabel?: string;
  fullWidthApproveLabel?: string;
  approveReturnLabel?: string;
  initiateReturnVisible: boolean;
  reviewAvailablity: "locked" | "open" | "submitted";
};

function roleHeading(transaction: Transaction, viewerId: number): string {
  if (viewerId === transaction.owner) {
    return "Арендатор:";
  }

  return "Владелец:";
}

export function resolveCardUi(params: {
  transaction: Transaction;
  viewerId: number;
  counterpartName: string;
  viewerHasSubmittedReview: boolean;
}): CardUi {
  const { transaction, viewerId, counterpartName, viewerHasSubmittedReview } =
    params;
  const counterpartLine = counterpartName.trim() || "Сторона";
  const isRenterViewer = viewerId === transaction.renter;

  if (transaction.status === TransactionStatusEnum.pending) {
    if (viewerId === transaction.owner) {
      return {
        chipLabel: "Ожидает",
        chipTone: "pending",
        chipDotClass: "bg-[#FE9A00]",
        roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
        description: `${counterpartLine.replace(/\.$/, "")} отправил запрос на аренду. Нужно подтвердить или отклонить заявку.`,
        footerAccent: "Требуется решение",
      };
    }

    return {
      chipLabel: "Ожидает",
      chipTone: "pending",
      chipDotClass: "bg-[#FE9A00]",
      roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
      description:
        "Запрос создан, решение будет принято владельцем после рассмотрения.",
    };
  }

  if (transaction.status === TransactionStatusEnum.approved) {
    if (viewerId === transaction.renter) {
      return {
        chipLabel: "Подтверждена",
        chipTone: "approved",
        chipDotClass: "bg-[#2B7FFF]",
        roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
        description:
          `${counterpartLine.replace(/\.$/, "")} подтвердил аренду. ` +
          "После передачи вещи подтвердите получение.",
        footerAccent: "Подтвердить получение",
      };
    }

    return {
      chipLabel: "Подтверждена",
      chipTone: "approved",
      chipDotClass: "bg-[#2B7FFF]",
      roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
      description:
        "Вы подтвердили аренду. После того как арендатор получит вещь, статус изменится автоматически.",
    };
  }

  if (transaction.status === TransactionStatusEnum.active) {
    const description = isRenterViewer
      ? "Аренда активна. Предмет находится у вас до согласованного возврата."
      : "Аренда активна. Предмет сейчас у арендатора, возврат ожидается по договорённости.";
    return {
      chipLabel: "Активна",
      chipTone: "active",
      chipDotClass: "bg-[#00BC7D]",
      roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
      description,
    };
  }

  if (transaction.status === TransactionStatusEnum.returning) {
    const description =
      viewerId === transaction.renter
        ? "Возврат инициирован. Владелец должен подтвердить, что получил предмет обратно."
        : "Арендатор инициировал возврат. Нужно подтвердить получение предмета.";
    return {
      chipLabel: "Возврат",
      chipTone: "returning",
      chipDotClass: "bg-[#8E51FF]",
      roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
      description,
      footerAccent:
        viewerId === transaction.owner ? "Подтвердите получение" : undefined,
    };
  }

  if (transaction.status === TransactionStatusEnum.completed) {
    const description = viewerHasSubmittedReview
      ? "Аренда завершена. Ваш отзыв по этой сделке уже опубликован."
      : "Аренда завершена. Можно поставить оценку и оставить отзыв контрагенту по этой сделке.";
    const chipTone: TransactionStatusTone = "completed";
    return {
      chipLabel: "Завершена",
      chipTone,
      chipDotClass: "bg-[#90A1B9]",
      roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
      description,
    };
  }

  return {
    chipLabel: "Отклонена",
    chipTone: "rejected",
    chipDotClass: "bg-[#FF2056]",
    roleLead: `${roleHeading(transaction, viewerId)} ${counterpartLine}`,
    description: "Запрос отклонён: можно создать новую заявку позже.",
  };
}

export function resolveDetailUi(params: {
  transaction: Transaction;
  viewerId: number;
  viewerHasSubmittedReview: boolean;
}): DetailUi {
  const { transaction, viewerId, viewerHasSubmittedReview } = params;

  let chipLabel = "";
  let chipTone: TransactionStatusTone = "completed";
  let chipDotClass = "bg-[#90A1B9]";
  let statusSubtitle = "";

  let rows: StageRow[] = [];

  let acceptPrimaryLabel: string | undefined;
  let outlinePrimaryLabel: string | undefined;
  let fullWidthApproveLabel: string | undefined;
  let approveReturnLabel: string | undefined;
  let initiateReturnVisible = false;

  const reviewAvailablity =
    transaction.status !== TransactionStatusEnum.completed
      ? "locked"
      : viewerHasSubmittedReview
        ? "submitted"
        : "open";

  if (transaction.status === TransactionStatusEnum.pending) {
    chipLabel = "Ожидает";
    chipTone = "pending";
    chipDotClass = "bg-[#FE9A00]";
    statusSubtitle = "Запрос создан, владелец принимает решение";
    rows = [
      { kind: "done", title: "Запрос на аренду создан" },
      { kind: "wait", title: "Ожидается решение владельца" },
    ];

    if (viewerId === transaction.owner) {
      acceptPrimaryLabel = "Подтвердить";
      outlinePrimaryLabel = "Отклонить";
    }
  } else if (transaction.status === TransactionStatusEnum.approved) {
    chipLabel = "Подтверждена";
    chipTone = "approved";
    chipDotClass = "bg-[#2B7FFF]";
    statusSubtitle = "Владелец подтвердил, арендатор должен отметить получение";
    rows = [
      { kind: "done", title: "Запрос на аренду создан" },
      { kind: "done", title: "Владелец подтвердил аренду" },
      { kind: "wait", title: "Ожидается подтверждение получения" },
    ];

    if (viewerId === transaction.renter) {
      fullWidthApproveLabel = "Подтвердить получение";
    }
  } else if (transaction.status === TransactionStatusEnum.active) {
    chipLabel = "Активна";
    chipTone = "active";
    chipDotClass = "bg-[#00BC7D]";
    statusSubtitle = "Предмет у арендатора";
    rows = [
      { kind: "done", title: "Запрос подтверждён" },
      { kind: "done", title: "Арендатор подтвердил получение" },
      { kind: "wait", title: "Аренда активна" },
    ];

    initiateReturnVisible = viewerId === transaction.renter;
  } else if (transaction.status === TransactionStatusEnum.returning) {
    chipLabel = "Возврат";
    chipTone = "returning";
    chipDotClass = "bg-[#8E51FF]";
    statusSubtitle = "Арендатор инициировал возврат, владелец подтверждает получение";
    rows = [
      { kind: "done", title: "Аренда активна" },
      { kind: "done", title: "Арендатор инициировал возврат" },
      {
        kind: "wait",
        title: viewerId === transaction.owner
          ? "Ожидается подтверждение получения предмета"
          : "Ожидается подтверждение владельца",
      },
    ];

    if (viewerId === transaction.owner) {
      approveReturnLabel = "Подтвердить получение";
    }
  } else if (transaction.status === TransactionStatusEnum.completed) {
    chipLabel = "Завершена";
    chipTone = "completed";
    chipDotClass = "bg-[#90A1B9]";
    statusSubtitle =
      viewerId === transaction.renter
        ? "Аренда завершена"
        : "Аренда завершена";

    rows = viewerHasSubmittedReview
      ? [
          { kind: "done", title: "Запрос подтверждён" },
          { kind: "done", title: "Получение подтверждено" },
          { kind: "done", title: "Возврат подтверждён" },
          { kind: "done", title: "Отзыв опубликован" },
        ]
      : [
          { kind: "done", title: "Запрос подтверждён" },
          { kind: "done", title: "Получение подтверждено" },
          { kind: "done", title: "Возврат подтверждён" },
          { kind: "done", title: "Сделка завершена" },
        ];
  } else if (transaction.status === TransactionStatusEnum.rejected) {
    chipLabel = "Отклонена";
    chipTone = "rejected";
    chipDotClass = "bg-[#FF2056]";
    statusSubtitle = "Запрос на аренду отклонён";
    rows = [
      { kind: "done", title: "Запрос на аренду создан" },
      { kind: "error", title: "Владелец отклонил заявку" },
    ];
  }

  const surfaceActionsVisible = Boolean(
    acceptPrimaryLabel ||
      fullWidthApproveLabel ||
      approveReturnLabel ||
      initiateReturnVisible,
  );

  return {
    chipLabel,
    chipTone,
    chipDotClass,
    statusSubtitle,
    rows,
    passiveHintVisible: !surfaceActionsVisible,
    acceptPrimaryLabel,
    outlinePrimaryLabel,
    fullWidthApproveLabel,
    approveReturnLabel,
    initiateReturnVisible,
    reviewAvailablity,
  };
}
