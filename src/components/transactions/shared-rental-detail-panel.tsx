import type { SharedRental } from "@/api";
import {
  formatTransactionDateTime,
  formatTransactionRub,
} from "@/lib/format-transaction";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Check,
  Clock,
  MessageSquare,
  PackageOpen,
  Users,
  X,
} from "lucide-react";
import { parseListingPrice } from "@/lib/listing-deal";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  resolveSharedRentalDetailUi,
  sharedRentalParticipantsLine,
  sharedRentalViewerRoleLabel,
} from "./shared-rentals-view-model";
import { TransactionStatusChip } from "./transaction-status-chip";
import type { StageRow } from "./transactions-view-model";

function StageIcon({ row }: { row: StageRow }) {
  if (row.kind === "done") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        <Check
          className="size-3 text-blue-600 dark:text-blue-500"
          strokeWidth={3}
        />
      </span>
    );
  }

  if (row.kind === "wait") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        <Clock
          className="size-3 text-blue-600 dark:text-blue-500"
          strokeWidth={2.5}
        />
      </span>
    );
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20">
      <X
        className="size-3 text-rose-600 dark:text-rose-500"
        strokeWidth={2.75}
      />
    </span>
  );
}

export function SharedRentalDetailPanel({
  rental,
  viewerId,
  onApprove,
  onReject,
  onConfirmReceipt,
  onConfirmReturn,
  onFinalize,
  onLeave,
  onCancel,
  isApprovePending,
  isRejectPending,
  isConfirmReceiptPending,
  isConfirmReturnPending,
  isFinalizePending,
  isLeavePending,
  isCancelPending,
}: {
  rental: SharedRental;
  viewerId: number;
  onApprove: () => void;
  onReject: () => void;
  onConfirmReceipt: () => void;
  onConfirmReturn: () => void;
  onFinalize: () => void;
  onLeave: () => void;
  onCancel: () => void;
  isApprovePending: boolean;
  isRejectPending: boolean;
  isConfirmReceiptPending: boolean;
  isConfirmReturnPending: boolean;
  isFinalizePending: boolean;
  isLeavePending: boolean;
  isCancelPending: boolean;
}) {
  const navigate = useNavigate();
  const presentation = resolveSharedRentalDetailUi(rental, viewerId);

  const item = rental.item_detail;
  const productName = item?.name ?? "Объявление";
  const primaryImageUrl =
    item?.images?.find((payload) => Boolean(payload.is_main))?.image ??
    item?.images?.[0]?.image;
  const filled = rental.participants_count ?? 0;
  const total = rental.slots_needed ?? 0;
  const priceLabel = item ? formatTransactionRub(item.price) : "—";
  const sharePriceLabel =
    item && total > 0
      ? formatTransactionRub(String(parseListingPrice(item.price) / total))
      : priceLabel;

  const createdLabel = formatTransactionDateTime(rental.created_at);
  const plannedStart = formatTransactionDateTime(rental.planned_start);
  const plannedEnd = formatTransactionDateTime(rental.planned_end);
  const participantsLine = sharedRentalParticipantsLine(rental);
  const roleLabel = sharedRentalViewerRoleLabel(rental, viewerId);

  return (
    <section
      className={cn(
        "sticky top-[88px] w-full shrink-0 rounded-[24px] border border-slate-200 bg-white lg:max-w-[400px] lg:flex-1 dark:border-slate-800 dark:bg-slate-900",
        "[box-shadow:0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]",
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <TransactionStatusChip
            label={presentation.chipLabel}
            tone={presentation.chipTone}
            dotClassName={presentation.chipDotClass}
          />

          <button
            type="button"
            aria-label="Совладение"
            className="flex size-9 cursor-default items-center justify-center rounded-full border-none bg-slate-100 px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            <Users className="size-5" strokeWidth={2} />
          </button>
        </div>

        <h2 className="mt-2 text-xl leading-[25px] font-bold tracking-[-0.5px] text-slate-900 dark:text-slate-100">
          Детали совладения
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {presentation.statusSubtitle}
        </p>

        <div className="mt-6 rounded-[16px] border border-slate-200 bg-slate-50 p-[17px] dark:border-slate-800 dark:bg-slate-800/60">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[14px]",
                primaryImageUrl
                  ? "bg-white dark:bg-slate-900"
                  : "bg-slate-100 dark:bg-slate-800",
              )}
            >
              {primaryImageUrl ? (
                <img
                  alt={productName}
                  src={primaryImageUrl}
                  className="h-full w-full rounded-[14px] object-cover object-center"
                />
              ) : (
                <Camera
                  className="size-7 text-slate-300 dark:text-slate-500"
                  strokeWidth={1.75}
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-base leading-6 font-semibold text-slate-900 dark:text-slate-100">
                {productName}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {priceLabel}
                {total > 0 ? ` · ${total} долей` : ""}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm leading-5">
          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Тип сделки
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              Совладение
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Ваша роль
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {roleLabel}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Участники
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {filled} из {total}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Соучастники
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {participantsLine}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Создатель заявки
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {rental.creator_name || "—"}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Создана
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {createdLabel}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Начало периода
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {plannedStart}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Конец периода
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {plannedEnd}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-slate-500 dark:text-slate-400">
              Стоимость доли
            </dt>
            <dd className="flex-1 text-right font-medium text-slate-900 dark:text-slate-100">
              {sharePriceLabel}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm leading-5 font-bold text-slate-900 dark:text-slate-100">
            Доли участников
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {(rental.segments ?? []).map((segment) => (
              <li
                key={segment.id}
                className="flex justify-between text-sm leading-5 text-slate-600 dark:text-slate-400"
              >
                <span>Слот {segment.segment_index + 1}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {segment.is_free
                    ? "Свободен"
                    : segment.participant_name || "Занят"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-sm leading-5 font-bold text-slate-900 dark:text-slate-100">
            Этапы сделки
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            {presentation.rows.map((row: StageRow, position: number) => (
              <div key={`shared-stage-${position}`} className="flex gap-2">
                <StageIcon row={row} />
                <p className="text-sm leading-[22px] text-slate-900 dark:text-slate-100">
                  {row.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {presentation.passiveHintVisible ? (
            <div className="flex min-h-11 flex-col justify-center rounded-[14px] bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
              <p className="text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                {presentation.passiveHintText ??
                  "Активных действий по статусу сейчас нет."}
              </p>
            </div>
          ) : null}

          {(presentation.acceptPrimaryLabel ||
            presentation.fullWidthApproveLabel ||
            presentation.approveReturnLabel ||
            presentation.initiateReturnVisible) && (
            <div className="space-y-2">
              {presentation.fullWidthApproveLabel ? (
                <Button
                  type="button"
                  variant="blue"
                  className="h-11 w-full cursor-pointer rounded-[14px] text-sm font-semibold"
                  disabled={isConfirmReceiptPending}
                  onClick={onConfirmReceipt}
                >
                  <Check className="size-4 text-white" strokeWidth={3} />
                  {presentation.fullWidthApproveLabel}
                </Button>
              ) : null}

              {presentation.approveReturnLabel ? (
                <Button
                  type="button"
                  variant="blue"
                  className="h-11 w-full cursor-pointer rounded-[14px] text-sm font-semibold"
                  disabled={isFinalizePending}
                  onClick={onFinalize}
                >
                  {presentation.approveReturnLabel}
                </Button>
              ) : null}

              {presentation.acceptPrimaryLabel ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="blue"
                    className="h-11 cursor-pointer rounded-[14px]"
                    disabled={isApprovePending}
                    onClick={onApprove}
                  >
                    <Check className="size-4 text-white" strokeWidth={3} />
                    {presentation.acceptPrimaryLabel}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 cursor-pointer rounded-[14px]"
                    disabled={isRejectPending}
                    onClick={onReject}
                  >
                    <X className="size-4" strokeWidth={2.5} />
                    {presentation.outlinePrimaryLabel}
                  </Button>
                </div>
              ) : null}

              {presentation.initiateReturnVisible ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full cursor-pointer rounded-[14px]"
                  disabled={isConfirmReturnPending}
                  onClick={onConfirmReturn}
                >
                  Подтвердить возврат предмета
                </Button>
              ) : null}
            </div>
          )}

          {presentation.leaveVisible ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer rounded-[14px] border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              disabled={isLeavePending}
              onClick={onLeave}
            >
              Покинуть заявку
            </Button>
          ) : null}

          {presentation.cancelVisible ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full cursor-pointer rounded-[14px] border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              disabled={isCancelPending}
              onClick={onCancel}
            >
              Отменить заявку
            </Button>
          ) : null}

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 cursor-pointer rounded-[14px] px-4 text-slate-700 dark:text-slate-200"
              onClick={() => navigate(`/product/${rental.item}`)}
            >
              <PackageOpen className="size-4 text-slate-700 dark:text-slate-200" />
              Товар
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 cursor-pointer rounded-[14px] px-4 text-slate-700 dark:text-slate-200"
              onClick={() => navigate("/messages")}
            >
              <MessageSquare className="size-4 text-slate-700 dark:text-slate-200" />
              Написать
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
