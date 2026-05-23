import { transactionsQueries } from "@/api";
import type { PaginatedTransactionList, Transaction } from "@/api/schema";
import {
  TRANSACTION_TAB_ITEMS,
  type TransactionTabFilter,
  TransactionDetailPanel,
  TransactionListCard,
  SharedRentalListCard,
  SharedRentalDetailPanel,
  TransactionTabBar,
  filterTabStatus,
  filterSharedRentalsByTab,
  tallySharedRentalsByTab,
  resolveCardUi,
  resolveDetailUi,
} from "@/components/transactions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useApproveTransaction,
  useCreateReview,
  useMyReviews,
  useRejectTransaction,
  useReturnTransaction,
  useTransactionLookups,
  useApproveSharedRental,
  useConfirmSharedRentalReceipt,
  useConfirmSharedRentalReturn,
  useFinalizeSharedRental,
  useRejectSharedRental,
  useCancelSharedRental,
  useLeaveSharedRental,
  useSharedRental,
  useSharedRentalsForDeals,
  useTransactions,
} from "@/hooks";
import { useAppSelector } from "@/hooks/rtk";
import {
  formatTransactionDateTime,
  formatTransactionRub,
  shortUserDisplayName,
} from "@/lib/format-transaction";
import { useQueries } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { SharedRental } from "@/api";

const PAGE_LIMIT = 8;

function reviewDraftKey(transactionId: number, viewerIsOwner: boolean) {
  return `${transactionId}:${viewerIsOwner ? "owner" : "renter"}`;
}

type DealsView = "rental" | "shared";

export function TransactionsPage() {
  const viewer = useAppSelector((state) => state.auth.user);
  const viewerId = viewer?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const dealsView: DealsView =
    searchParams.get("view") === "shared" ? "shared" : "rental";

  const [activeTab, setActiveTab] = useState<TransactionTabFilter>("all");
  const [activeSharedTab, setActiveSharedTab] =
    useState<TransactionTabFilter>("all");
  const [selectedSharedRentalId, setSelectedSharedRentalId] = useState<
    number | null
  >(null);
  const [page, setPage] = useState(1);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(
    null,
  );
  const [reviewStarsState, setReviewStarsState] = useState<
    Record<string, number>
  >({});
  const [reviewBodiesState, setReviewBodiesState] = useState<
    Record<string, string>
  >({});

  const activeStatus = filterTabStatus(activeTab);

  const transactionQueryInputs = useMemo(
    () => ({
      ...(activeStatus ? { status: activeStatus } : {}),
      page,
      page_size: PAGE_LIMIT,
    }),
    [page, activeStatus],
  );

  const { data: incomingPages, isLoading } = useTransactions(
    viewerId !== undefined && dealsView === "rental"
      ? transactionQueryInputs
      : undefined,
    viewerId !== undefined && dealsView === "rental",
  );

  const { data: mySharedRentals, isLoading: isSharedLoading } =
    useSharedRentalsForDeals(viewerId !== undefined && dealsView === "shared");

  const { data: sharedRentalDetail, isLoading: isSharedDetailLoading } =
    useSharedRental(
      dealsView === "shared" && selectedSharedRentalId != null
        ? selectedSharedRentalId
        : undefined,
    );

  const filteredSharedRentals = useMemo(() => {
    if (!mySharedRentals?.length) {
      return [];
    }

    return filterSharedRentalsByTab(mySharedRentals, activeSharedTab);
  }, [mySharedRentals, activeSharedTab]);

  const tallyBySharedTab = useMemo(() => {
    if (!mySharedRentals?.length) {
      return {};
    }

    return tallySharedRentalsByTab(mySharedRentals);
  }, [mySharedRentals]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, activeTab, activeSharedTab, dealsView]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (!filteredSharedRentals.length) {
      setSelectedSharedRentalId(null);
      return;
    }

    const stillListed =
      selectedSharedRentalId &&
      filteredSharedRentals.some((row) => row.id === selectedSharedRentalId);

    if (!stillListed) {
      setSelectedSharedRentalId(filteredSharedRentals[0]?.id ?? null);
    }
  }, [filteredSharedRentals, selectedSharedRentalId]);

  const focusedSharedRentalSummary =
    selectedSharedRentalId === null
      ? undefined
      : filteredSharedRentals.find((row) => row.id === selectedSharedRentalId);

  const focusedSharedRental =
    sharedRentalDetail ?? focusedSharedRentalSummary;

  const transactionRows = incomingPages?.results ?? [];
  const pageTotal =
    incomingPages !== undefined && incomingPages.count > 0
      ? Math.max(1, Math.ceil(incomingPages.count / PAGE_LIMIT))
      : 1;

  useEffect(() => {
    if (page > pageTotal) {
      setPage(pageTotal);
    }
  }, [page, pageTotal]);

  const lookups = useTransactionLookups(transactionRows);

  const countReads = useQueries({
    queries: TRANSACTION_TAB_ITEMS.map((ledger) => ({
      queryKey: ["transactions", "count", ledger.id],
      queryFn: () =>
        transactionsQueries.getTransactions(
          ledger.id === "all"
            ? { page_size: 1 }
            : {
                status: filterTabStatus(ledger.id)!,
                page_size: 1,
              },
        ),
      select: (response: PaginatedTransactionList) => response.count,
      enabled: viewerId !== undefined,
    })),
  });

  const tallyByTab = useMemo(() => {
    const tally: Partial<Record<TransactionTabFilter, number>> = {};
    TRANSACTION_TAB_ITEMS.forEach((ledger, marker) => {
      const fetched = countReads[marker]?.data;
      if (typeof fetched === "number") {
        tally[ledger.id] = fetched;
      }
    });
    return tally;
  }, [countReads]);

  useEffect(() => {
    if (!transactionRows.length) {
      setSelectedTransactionId(null);
      return;
    }

    const stillListed =
      selectedTransactionId &&
      transactionRows.some((row) => row.id === selectedTransactionId);

    if (stillListed) {
      return;
    }

    setSelectedTransactionId(transactionRows[0]?.id ?? null);
  }, [transactionRows, selectedTransactionId]);

  const focusedTransaction =
    selectedTransactionId === null
      ? undefined
      : transactionRows.find((row) => row.id === selectedTransactionId);

  const approveMutation = useApproveTransaction();
  const rejectMutation = useRejectTransaction();
  const returnMutation = useReturnTransaction();
  const approveSharedRental = useApproveSharedRental();
  const rejectSharedRental = useRejectSharedRental();
  const confirmSharedReceipt = useConfirmSharedRentalReceipt();
  const confirmSharedReturn = useConfirmSharedRentalReturn();
  const finalizeSharedRental = useFinalizeSharedRental();
  const leaveSharedRental = useLeaveSharedRental();
  const cancelSharedRental = useCancelSharedRental();
  const createReviewMutation = useCreateReview();

  const myReviewsQuery = useMyReviews(viewerId !== undefined);

  const reviewedTransactionIds = useMemo(() => {
    const rows = myReviewsQuery.data ?? [];
    return new Set(rows.map((row) => row.transaction));
  }, [myReviewsQuery.data]);

  const counterpartIdentifier =
    focusedTransaction && viewerId !== undefined
      ? focusedTransaction.owner === viewerId
        ? focusedTransaction.renter
        : focusedTransaction.owner
      : undefined;

  const counterpartPage =
    counterpartIdentifier !== undefined
      ? lookups.profileByUserId.get(counterpartIdentifier)
      : undefined;

  const abbreviatedCounterpart = counterpartPage
    ? shortUserDisplayName({
        first_name: counterpartPage.first_name,
        last_name: counterpartPage.last_name,
        username: counterpartPage.username,
      })
    : "";

  const elongatedCounterpart =
    counterpartPage &&
    counterpartPage.first_name &&
    counterpartPage.last_name
      ? `${counterpartPage.first_name} ${counterpartPage.last_name}`
      : counterpartPage?.username?.trim() ?? abbreviatedCounterpart;

  const activeItemRecord =
    focusedTransaction !== undefined
      ? lookups.itemById.get(focusedTransaction.item)
      : undefined;

  const ownerLens =
    focusedTransaction !== undefined && viewerId !== undefined
      ? focusedTransaction.owner === viewerId
      : false;

  const detailCopy =
    focusedTransaction !== undefined && viewerId !== undefined
      ? resolveDetailUi({
          transaction: focusedTransaction,
          viewerHasSubmittedReview: reviewedTransactionIds.has(
            focusedTransaction.id,
          ),
          viewerId,
        })
      : null;

  const activeReviewDraftKey =
    focusedTransaction !== undefined
      ? reviewDraftKey(focusedTransaction.id, ownerLens)
      : "";

  const reviewGrade =
    activeReviewDraftKey !== ""
      ? (reviewStarsState[activeReviewDraftKey] ?? 0)
      : 0;
  const reviewBody =
    activeReviewDraftKey !== ""
      ? (reviewBodiesState[activeReviewDraftKey] ?? "")
      : "";

  const synchronizeReviewStars = (value: number) => {
    if (focusedTransaction === undefined) {
      return;
    }

    const ledger = reviewDraftKey(focusedTransaction.id, ownerLens);

    setReviewStarsState((before) => ({
      ...before,
      [ledger]: value,
    }));
  };

  const synchronizeReviewBody = (value: string) => {
    if (focusedTransaction === undefined) {
      return;
    }

    const ledger = reviewDraftKey(focusedTransaction.id, ownerLens);

    setReviewBodiesState((before) => ({
      ...before,
      [ledger]: value,
    }));
  };

  const commitReviewPublication = () => {
    if (focusedTransaction === undefined) {
      return;
    }

    if (reviewGrade <= 0) {
      return;
    }

    if (reviewedTransactionIds.has(focusedTransaction.id)) {
      return;
    }

    if (createReviewMutation.isPending) {
      return;
    }

    createReviewMutation.mutate({
      transaction: focusedTransaction.id,
      rating: reviewGrade,
      comment: reviewBody.trim() ? reviewBody.trim() : null,
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pt-8 pb-16">
      <h1 className="text-[30px] leading-9 font-bold tracking-[-0.75px] text-slate-900 dark:text-slate-100">
        Сделки
      </h1>

      <div className="mt-6 flex gap-2">
        {(
          [
            { id: "rental" as const, label: "Аренда" },
            { id: "shared" as const, label: "Совладение" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === "shared") {
                setSearchParams({ view: "shared" });
              } else {
                setSearchParams({});
              }
            }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              dealsView === item.id
                ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-600"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <TransactionTabBar
          items={TRANSACTION_TAB_ITEMS}
          activeId={dealsView === "shared" ? activeSharedTab : activeTab}
          counts={dealsView === "shared" ? tallyBySharedTab : tallyByTab}
          onChange={(nextLedger) => {
            if (dealsView === "shared") {
              setActiveSharedTab(nextLedger);
            } else {
              setActiveTab(nextLedger);
            }
          }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-6">
        <div className="flex min-h-[400px] w-full shrink-0 flex-col gap-3 xl:max-w-[824px]">
          {viewerId === undefined ? (
            <div className="text-muted-foreground text-sm leading-6">
              Нужна авторизация, чтобы загрузить сделки.
            </div>
          ) : null}

          {viewerId !== undefined && dealsView === "shared" && isSharedLoading ? (
            <div className="text-muted-foreground text-center text-sm">
              Загружаем совладение…
            </div>
          ) : null}

          {viewerId !== undefined &&
          dealsView === "shared" &&
          !isSharedLoading &&
          !mySharedRentals?.length ? (
            <div className="text-muted-foreground rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm leading-6 dark:border-slate-800">
              Пока нет заявок на совладение.
            </div>
          ) : null}

          {viewerId !== undefined &&
          dealsView === "shared" &&
          !isSharedLoading &&
          mySharedRentals &&
          mySharedRentals.length > 0 &&
          !filteredSharedRentals.length ? (
            <div className="text-muted-foreground rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm leading-6 dark:border-slate-800">
              Пока нет заявок на совладение в этом разделе.
            </div>
          ) : null}

          {viewerId !== undefined &&
          dealsView === "shared" &&
          !isSharedLoading &&
          filteredSharedRentals.length > 0
            ? filteredSharedRentals.map((rental: SharedRental) => (
                <SharedRentalListCard
                  key={rental.id}
                  rental={rental}
                  viewerId={viewerId}
                  selected={rental.id === selectedSharedRentalId}
                  onSelect={setSelectedSharedRentalId}
                />
              ))
            : null}

          {viewerId !== undefined && dealsView === "rental" && isLoading ? (
            <div className="text-muted-foreground text-center text-sm">
              Загружаем сделки…
            </div>
          ) : null}

          {viewerId !== undefined &&
          dealsView === "rental" &&
          !isLoading &&
          !transactionRows.length ? (
            <div className="text-muted-foreground rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm leading-6 dark:border-slate-800">
              Пока нет сделок в этом разделе.
            </div>
          ) : null}

          {viewerId !== undefined &&
          dealsView === "rental" &&
          !isLoading &&
          transactionRows.length > 0
            ? transactionRows.map((payload: Transaction) => {
                const observerId = viewerId;
                const counterpartNumber =
                  payload.owner === observerId ? payload.renter : payload.owner;

                const profileSnapshot =
                  lookups.profileByUserId.get(counterpartNumber);

                const counterpartShort = profileSnapshot
                  ? shortUserDisplayName({
                      first_name: profileSnapshot.first_name,
                      last_name: profileSnapshot.last_name,
                      username: profileSnapshot.username,
                    })
                  : "…";

                const itemSnapshot = lookups.itemById.get(payload.item);
                const productTitle = itemSnapshot?.name ?? "Объявление";

                const mainImageCandidate = itemSnapshot?.images?.find(
                  (graphic) => Boolean(graphic.is_main),
                );

                const mainImageHref =
                  mainImageCandidate?.image ?? itemSnapshot?.images?.[0]?.image;

                const tariffLabel =
                  itemSnapshot !== undefined
                    ? formatTransactionRub(itemSnapshot.price)
                    : "…";

                const rentalStamp = formatTransactionDateTime(payload.rented_at);

                const narration = resolveCardUi({
                  counterpartName: counterpartShort,
                  transaction: payload,
                  viewerHasSubmittedReview: reviewedTransactionIds.has(
                    payload.id,
                  ),
                  viewerId: observerId,
                });

                return (
                  <TransactionListCard
                    key={payload.id}
                    productName={productTitle}
                    priceLabel={tariffLabel}
                    presentation={narration}
                    rentedAtLabel={rentalStamp}
                    selected={payload.id === selectedTransactionId}
                    thumbUrl={mainImageHref}
                    transaction={payload}
                    onSelect={(incoming) => setSelectedTransactionId(incoming)}
                  />
                );
              })
            : null}

          {viewerId !== undefined &&
          dealsView === "rental" &&
          incomingPages !== undefined &&
          pageTotal > 1 ? (
            <Pagination className="pt-2">
              <PaginationContent className="flex flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((digit) => Math.max(1, digit - 1))}
                  />
                </PaginationItem>

                {Array.from({ length: pageTotal }).map((_slot, ordinal) => {
                  const ordinalPage = ordinal + 1;

                  return (
                    <PaginationItem key={ordinalPage}>
                      <PaginationLink
                        isActive={page === ordinalPage}
                        onClick={() => setPage(ordinalPage)}
                      >
                        {ordinalPage}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((digit) => Math.min(pageTotal, digit + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>

        <aside className="w-full xl:sticky xl:top-24 xl:max-w-[400px] xl:shrink-0">
          {dealsView === "shared" &&
          focusedSharedRental &&
          viewerId !== undefined &&
          !isSharedDetailLoading ? (
            <SharedRentalDetailPanel
              rental={focusedSharedRental}
              viewerId={viewerId}
              isApprovePending={approveSharedRental.isPending}
              isRejectPending={rejectSharedRental.isPending}
              isConfirmReceiptPending={confirmSharedReceipt.isPending}
              isConfirmReturnPending={confirmSharedReturn.isPending}
              isFinalizePending={finalizeSharedRental.isPending}
              isLeavePending={leaveSharedRental.isPending}
              isCancelPending={cancelSharedRental.isPending}
              onApprove={() =>
                approveSharedRental.mutate(focusedSharedRental.id)
              }
              onReject={() =>
                rejectSharedRental.mutate(focusedSharedRental.id)
              }
              onConfirmReceipt={() =>
                confirmSharedReceipt.mutate(focusedSharedRental.id)
              }
              onConfirmReturn={() =>
                confirmSharedReturn.mutate(focusedSharedRental.id)
              }
              onFinalize={() =>
                finalizeSharedRental.mutate(focusedSharedRental.id)
              }
              onLeave={() => leaveSharedRental.mutate(focusedSharedRental.id)}
              onCancel={() => cancelSharedRental.mutate(focusedSharedRental.id)}
            />
          ) : null}

          {dealsView === "shared" && isSharedDetailLoading ? (
            <div className="text-muted-foreground rounded-[24px] border border-slate-200 bg-white p-12 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              Загружаем детали…
            </div>
          ) : null}

          {dealsView === "shared" && !focusedSharedRental ? (
            <div className="text-muted-foreground rounded-[24px] border border-slate-200 bg-white p-12 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              Выберите заявку на совладение.
            </div>
          ) : null}

          {dealsView === "rental" &&
          focusedTransaction !== undefined &&
          viewerId !== undefined &&
          detailCopy !== null ? (
            <TransactionDetailPanel
              counterpartNameDetail={elongatedCounterpart}
              counterpartNameShort={abbreviatedCounterpart}
              isApprovePending={approveMutation.isPending}
              isRejectPending={rejectMutation.isPending}
              isReturnPending={returnMutation.isPending}
              isReviewPending={createReviewMutation.isPending}
              item={activeItemRecord}
              onApprove={() => approveMutation.mutate(focusedTransaction.id)}
              onInitiateReturn={() =>
                returnMutation.mutate(focusedTransaction.id)
              }
              onPublishReview={commitReviewPublication}
              onReject={() => rejectMutation.mutate(focusedTransaction.id)}
              onReturnComplete={() =>
                approveMutation.mutate(focusedTransaction.id)
              }
              onReviewRating={synchronizeReviewStars}
              onReviewText={synchronizeReviewBody}
              presentation={detailCopy}
              reviewAvailablityKind={detailCopy.reviewAvailablity}
              reviewRating={reviewGrade}
              reviewText={reviewBody}
              transaction={focusedTransaction}
              viewerIsOwner={ownerLens}
            />
          ) : null}

          {dealsView === "rental" &&
          (focusedTransaction === undefined ||
            viewerId === undefined ||
            detailCopy === null) ? (
            <div className="text-muted-foreground rounded-[24px] border border-slate-200 bg-white p-12 text-center text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
              Выберите сделку из списка.
            </div>
          ) : null}
        </aside>
      </div>

    </main>
  );
}
