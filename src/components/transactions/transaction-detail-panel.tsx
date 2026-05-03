import type { ItemDetail, Transaction } from "@/api/schema";
import { TransactionStatusEnum } from "@/api/schema";
import {
  formatTransactionDateTime,
  formatTransactionRub,
} from "@/lib/format-transaction";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Check,
  Clock,
  Lock,
  MessageSquare,
  PackageOpen,
  PackageCheck,
  Star,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { TransactionStatusChip } from "./transaction-status-chip";
import type { DetailUi, StageRow } from "./transactions-view-model";

function StageIcon({ row }: { row: StageRow }) {
  if (row.kind === "done") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
        <Check className="size-3 text-[#155DFC]" strokeWidth={3} />
      </span>
    );
  }

  if (row.kind === "wait") {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
        <Clock className="size-3 text-[#155DFC]" strokeWidth={2.5} />
      </span>
    );
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2]">
      <X className="size-3 text-[#FF2056]" strokeWidth={2.75} />
    </span>
  );
}

export function TransactionDetailPanel({
  transaction,
  counterpartNameShort,
  counterpartNameDetail,
  viewerIsOwner,
  item,
  presentation,
  reviewAvailablityKind,
  reviewRating,
  reviewText,
  onReviewRating,
  onReviewText,
  onPublishReview,
  onApprove,
  onReject,
  onReturnComplete,
  onInitiateReturn,
  isApprovePending,
  isRejectPending,
  isReturnPending,
}: {
  transaction: Transaction;
  counterpartNameShort: string;
  counterpartNameDetail: string;
  viewerIsOwner: boolean;
  item?: ItemDetail;
  presentation: DetailUi;
  reviewAvailablityKind: "locked" | "open" | "submitted";
  reviewRating: number;
  reviewText: string;
  onReviewRating: (stars: number) => void;
  onReviewText: (value: string) => void;
  onPublishReview: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReturnComplete: () => void;
  onInitiateReturn: () => void;
  isApprovePending: boolean;
  isRejectPending: boolean;
  isReturnPending: boolean;
}) {
  const navigate = useNavigate();

  const productName = item?.name ?? "Объявление";
  const primaryImageUrl = item?.images?.find((payload) =>
    Boolean(payload.is_main),
  )?.image ?? item?.images?.[0]?.image;
  const priceLabel = item
    ? formatTransactionRub(item.price)
    : "—";

  const createdLabel = formatTransactionDateTime(transaction.rented_at);
  const rentedLabel = formatTransactionDateTime(transaction.rented_at);
  const returnLabel = transaction.returned_at
    ? formatTransactionDateTime(transaction.returned_at)
    : "—";

  return (
    <section
      className={cn(
        "sticky top-[88px] w-full shrink-0 rounded-[24px] border border-[#E2E8F0] bg-white lg:max-w-[400px] lg:flex-1",
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
            aria-label="Краткая справка"
            className="flex size-9 cursor-default items-center justify-center rounded-full border-none bg-[#F1F5F9] px-2 text-[#62748E]"
          >
            <PackageCheck className="size-5" strokeWidth={2} />
          </button>
        </div>

        <h2 className="mt-2 text-xl leading-[25px] font-bold tracking-[-0.5px] text-[#0F172B]">
          Детали аренды
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#62748E]">
          {presentation.statusSubtitle}
        </p>

        <div className="mt-6 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-[17px]">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] px-3.5",
                primaryImageUrl ? "bg-white" : "bg-[#F1F5F9]",
              )}
            >
              {primaryImageUrl ? (
                <img
                  alt={productName}
                  src={primaryImageUrl}
                  className="size-full rounded-[14px] object-cover"
                />
              ) : (
                <Camera className="size-7 text-[#CAD5E2]" strokeWidth={1.75} />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-base leading-6 font-semibold text-[#0F172B]">
                {productName}
              </p>
              <p className="mt-1 text-sm leading-5 text-[#62748E]">
                {priceLabel}
              </p>
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm leading-5">
          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-[#62748E]">Тип сделки</dt>
            <dd className="flex-1 text-right font-medium text-[#0F172B]">
              Аренда
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-[#62748E]">Ваша роль</dt>
            <dd className="flex-1 text-right font-medium text-[#0F172B]">
              {viewerIsOwner ? "Вы владелец" : "Вы арендатор"}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-[#62748E]">Вторая сторона</dt>
            <dd className="flex-1 text-right font-medium text-[#0F172B]">
              {counterpartNameDetail.trim() ||
                counterpartNameShort.trim() ||
                "—"}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-[#62748E]">Создана</dt>
            <dd className="flex-1 text-right font-medium text-[#0F172B]">
              {createdLabel}
            </dd>
          </div>

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-[#62748E]">Дата аренды</dt>
            <dd className="flex-1 text-right font-medium text-[#0F172B]">
              {rentedLabel}
            </dd>
          </div>

          {transaction.status === TransactionStatusEnum.completed && (
            <div className="flex gap-6">
              <dt className="w-44 shrink-0 text-[#62748E]">Дата возврата</dt>
              <dd className="flex-1 text-right font-medium text-[#0F172B]">
                {returnLabel}
              </dd>
            </div>
          )}

          <div className="flex gap-6">
            <dt className="w-44 shrink-0 text-[#62748E]">Сумма</dt>
            <dd className="flex-1 text-right font-medium text-[#0F172B]">
              {priceLabel}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm leading-5 font-bold text-[#0F172B]">
            Этапы сделки
          </h3>
          <div className="mt-3 flex flex-col gap-3">
            {presentation.rows.map((row: StageRow, position: number) => (
              <div key={`stage-${position}`} className="flex gap-2">
                <StageIcon row={row} />
                <p className="text-sm leading-[22px] text-[#0F172B]">
                  {row.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {presentation.passiveHintVisible ? (
            <div className="flex min-h-11 flex-col justify-center rounded-[14px] bg-[#F8FAFC] px-4 py-3">
              <p className="text-sm leading-5 font-normal text-[#62748E]">
                Активных действий по статусу сейчас нет.
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
                  disabled={isApprovePending}
                  onClick={onApprove}
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
                  disabled={isApprovePending}
                  onClick={onReturnComplete}
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
                  disabled={isReturnPending}
                  onClick={onInitiateReturn}
                >
                  Отметить возврат предмета
                </Button>
              ) : null}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 cursor-pointer rounded-[14px] px-4 text-[#314158]"
              onClick={() => navigate(`/product/${transaction.item}`)}
            >
              <PackageOpen className="size-4 text-[#314158]" />
              Товар
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 cursor-pointer rounded-[14px] px-4 text-[#314158]"
              onClick={() => navigate("/messages")}
            >
              <MessageSquare className="size-4 text-[#314158]" />
              Написать
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {reviewAvailablityKind === "submitted" ? (
            <div className="flex gap-4 rounded-2xl border border-transparent border-t-[#D0FAE5] bg-[#ECFDF5B2] p-[17px]">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
                <Check className="size-4 text-[#009966]" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-5 font-bold text-[#0F172B]">
                  Оценка и отзыв
                </p>
                <p className="mt-1 text-sm leading-6 text-[#45556C]">
                  Отзыв по этой завершённой аренде уже опубликован и учтён в рейтинге участника.
                </p>
              </div>
            </div>
          ) : null}

          {reviewAvailablityKind === "locked" ? (
            <div className="relative rounded-2xl border border-transparent border-t-[#E2E8F0] bg-[#F8FAFCB2] px-5 py-6 opacity-[0.85]">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-5 font-bold text-[#0F172B]">
                  Оценка и отзыв
                </p>
                <Lock className="size-4 shrink-0 text-[#90A1B9]" />
              </div>
              <p className="mt-2 text-sm leading-6 text-[#62748E]">
                Оценка станет доступна после завершения аренды.
              </p>
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }).map((_entry, idx) => (
                  <Star
                    key={`static-${idx + 1}`}
                    aria-hidden
                    className="size-6 text-[#CAD5E2]"
                    strokeWidth={1.75}
                  />
                ))}
              </div>
              <textarea
                readOnly
                rows={4}
                className={cn(
                  "mt-4 w-full cursor-not-allowed resize-none rounded-[14px] border border-transparent border-t-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 text-[14px] leading-6 text-[#45556C] outline-none",
                )}
                placeholder="Коротко опишите, как прошла аренда"
              />

              <Button
                type="button"
                disabled
                className="mt-5 h-10 w-full cursor-not-allowed rounded-[14px] border-none bg-[#E2E8F0] text-[#90A1B9]"
              >
                Опубликовать отзыв
              </Button>
            </div>
          ) : null}

          {reviewAvailablityKind === "open" ? (
            <div className="rounded-2xl border border-transparent border-t-[#E2E8F0] bg-[#F8FAFC] px-5 py-6">
              <p className="text-sm leading-5 font-bold text-[#0F172B]">
                Оценка и отзыв
              </p>
              <div className="mt-6 flex gap-1">
                {Array.from({ length: 5 }).map((_entry, idx) => {
                  const tier = idx + 1;

                  const active =
                    tier <= (reviewRating > 0 ? reviewRating : 0);

                  return (
                    <button
                      key={tier}
                      type="button"
                      aria-label={`${tier} звёзды`}
                      onClick={() => onReviewRating(tier)}
                      className="cursor-pointer border-none bg-transparent p-0 leading-none outline-none transition-transform hover:translate-y-[1px]"
                    >
                      <Star
                        className={cn(
                          "size-6",
                          active ? "text-[#FFB900]" : "text-[#CAD5E2]",
                        )}
                        fill={active ? "currentColor" : "transparent"}
                      />
                    </button>
                  );
                })}
              </div>

              <textarea
                value={reviewText}
                onChange={(event) => onReviewText(event.target.value)}
                rows={4}
                className="mt-6 w-full resize-none rounded-[14px] border border-transparent border-t-[#E2E8F0] bg-white px-4 py-2 text-[14px] leading-6 text-[#0F172B] outline-none"
                placeholder="Коротко опишите, как прошла аренда"
              />

              <Button
                type="button"
                variant="blue"
                className={cn(
                  "mt-5 h-10 w-full cursor-pointer rounded-[14px] bg-[#155DFC]",
                  reviewRating <= 0 && "pointer-events-none opacity-85",
                )}
                disabled={reviewRating <= 0}
                onClick={onPublishReview}
              >
                Опубликовать отзыв
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
