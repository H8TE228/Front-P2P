import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ItemDetail } from "@/api/schema";
import {
  useCreateItemSharedRental,
  useCreateTransaction,
  useJoinSharedRental,
  useSharedRentals,
} from "@/hooks";
import { useAppSelector } from "@/hooks/rtk";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  countFreeSharedSegments,
  defaultSharedRentalPeriod,
  findUserCollectingRental,
  isShareListing,
  pickJoinableSharedRental,
  shareSlotPercent,
} from "@/lib/listing-deal";

import { DealModalShell } from "./deal-modal-shell";
import {
  getRentCheckoutTotals,
  RentDealForm,
  type RentDealFormState,
} from "./rent-deal-form";
import {
  getShareCheckoutAmount,
  ShareDealForm,
} from "./share-deal-form";
import { PaymentStubForm } from "./payment-stub-form";

type DealStep = "form" | "payment";

const SHARED_DEALS_PATH = "/transactions?view=shared";

const defaultRentForm = (): RentDealFormState => {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 3);
  const toDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return {
    startDate: toDate(start),
    endDate: toDate(end),
    deliveryMethod: "pickup",
  };
};

export function ProductDealDialog({
  product,
  open,
  onOpenChange,
}: {
  product: ItemDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const viewer = useAppSelector((state) => state.auth.user);
  const viewerId = viewer?.id;

  const isShare = isShareListing(product);
  const totalSlots = product.max_active_transactions ?? 2;

  const [step, setStep] = useState<DealStep>("form");
  const [rentForm, setRentForm] = useState<RentDealFormState>(defaultRentForm);
  const [sharePercent, setSharePercent] = useState(shareSlotPercent(totalSlots));
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { data: openRentalsData } = useSharedRentals(
    { item: product.id, only_open: 1 },
    open && isShare,
  );

  const openRentals = openRentalsData?.results;

  const userCollectingRental = useMemo(
    () =>
      viewerId !== undefined
        ? findUserCollectingRental(openRentals, viewerId)
        : undefined,
    [openRentals, viewerId],
  );

  const joinableRental = useMemo(
    () =>
      viewerId !== undefined
        ? pickJoinableSharedRental(openRentals, viewerId)
        : undefined,
    [openRentals, viewerId],
  );

  const displayRental = joinableRental ?? userCollectingRental;
  const remainingSlots = countFreeSharedSegments(displayRental, totalSlots);
  const alreadyParticipating = Boolean(userCollectingRental);

  const createTransaction = useCreateTransaction();
  const createItemSharedRental = useCreateItemSharedRental();
  const joinSharedRental = useJoinSharedRental();

  const rentRangeInvalid =
    !rentForm.startDate ||
    !rentForm.endDate ||
    rentForm.startDate >= rentForm.endDate;

  const rentTotals = getRentCheckoutTotals(product, rentForm);
  const shareAmount = getShareCheckoutAmount(product, sharePercent);

  const paymentTotal = isShare ? shareAmount : rentTotals.grandTotal;
  const paymentLabel = isShare ? "К оплате" : "Итого к оплате";

  const isPaymentPending =
    createTransaction.isPending ||
    createItemSharedRental.isPending ||
    joinSharedRental.isPending;

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setRentForm(defaultRentForm());
    setSharePercent(shareSlotPercent(totalSlots));
    setPaymentError(null);
  }, [open, totalSlots]);

  useEffect(() => {
    if (!open || !isShare) return;
    setSharePercent(shareSlotPercent(displayRental?.slots_needed ?? totalSlots));
  }, [open, isShare, totalSlots, displayRental?.slots_needed, remainingSlots]);

  const finishSharedDeal = () => {
    onOpenChange(false);
    navigate(SHARED_DEALS_PATH);
  };

  const handleClose = (next: boolean) => {
    if (!next && isPaymentPending) return;
    onOpenChange(next);
  };

  const handleRentPay = () => {
    setPaymentError(null);
    const plannedStart = new Date(`${rentForm.startDate}T00:00:00`).toISOString();
    const plannedEnd = new Date(`${rentForm.endDate}T23:59:59`).toISOString();

    createTransaction.mutate(
      {
        itemId: String(product.id),
        planned_start: plannedStart,
        planned_end: plannedEnd,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          navigate("/transactions");
        },
        onError: (err) => {
          setPaymentError(getApiErrorMessage(err, "Не удалось оформить аренду"));
        },
      },
    );
  };

  const handleSharePay = () => {
    setPaymentError(null);

    if (viewerId === undefined) {
      setPaymentError("Нужна авторизация");
      return;
    }

    if (alreadyParticipating) {
      finishSharedDeal();
      return;
    }

    const completeJoin = () => {
      if (!joinableRental) return;

      const freeSegment = joinableRental.segments
        .filter((s) => s.is_free)
        .sort((a, b) => a.segment_index - b.segment_index)[0];

      if (!freeSegment) {
        setPaymentError("Свободных долей в этой заявке не осталось");
        return;
      }

      joinSharedRental.mutate(
        { id: joinableRental.id, segment_index: freeSegment.segment_index },
        {
          onSuccess: finishSharedDeal,
          onError: (err) => {
            setPaymentError(
              getApiErrorMessage(err, "Не удалось присоединиться к заявке"),
            );
          },
        },
      );
    };

    const completeCreate = () => {
      const period = defaultSharedRentalPeriod(totalSlots);

      createItemSharedRental.mutate(
        {
          itemId: String(product.id),
          ...period,
          slots_needed: totalSlots,
          creator_segment_index: 0,
        },
        {
          onSuccess: finishSharedDeal,
          onError: (err) => {
            setPaymentError(
              getApiErrorMessage(err, "Не удалось создать заявку на совладение"),
            );
          },
        },
      );
    };

    if (joinableRental) {
      if (joinableRental.is_full) {
        setPaymentError("Все доли в этой заявке уже заняты");
        return;
      }
      completeJoin();
      return;
    }

    const collectingOnItem = openRentals?.find(
      (r) => r.status === "collecting",
    );
    if (collectingOnItem?.is_full) {
      setPaymentError(
        "Набор участников завершён. Дождитесь решения владельца объявления.",
      );
      return;
    }

    completeCreate();
  };

  const modalTitle =
    step === "payment"
      ? "Оплата"
      : isShare
        ? "Покупка доли"
        : "Оформление аренды";

  return (
    <DealModalShell open={open} onOpenChange={handleClose} title={modalTitle}>
      {step === "form" && isShare && (
        <ShareDealForm
          product={product}
          totalSlots={displayRental?.slots_needed ?? totalSlots}
          remainingSlots={remainingSlots}
          sharePercent={sharePercent}
          onSharePercentChange={setSharePercent}
          onProceed={() => {
            setPaymentError(null);
            if (alreadyParticipating) {
              finishSharedDeal();
              return;
            }
            setStep("payment");
          }}
          proceedDisabled={alreadyParticipating}
          proceedHint={
            alreadyParticipating
              ? "Вы уже участвуете в открытой заявке на этот товар"
              : undefined
          }
        />
      )}

      {step === "form" && !isShare && (
        <RentDealForm
          product={product}
          form={rentForm}
          onChange={(patch) => setRentForm((prev) => ({ ...prev, ...patch }))}
          rentRangeInvalid={rentRangeInvalid}
          onProceed={() => {
            setPaymentError(null);
            setStep("payment");
          }}
        />
      )}

      {step === "payment" && (
        <PaymentStubForm
          totalLabel={paymentLabel}
          totalAmount={paymentTotal}
          isPending={isPaymentPending}
          error={paymentError}
          onBack={() => {
            setPaymentError(null);
            setStep("form");
          }}
          onPay={isShare ? handleSharePay : handleRentPay}
        />
      )}
    </DealModalShell>
  );
}
