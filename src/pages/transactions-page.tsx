import { transactionsQueries } from "@/api";
import type { PaginatedTransactionList, Transaction } from "@/api/schema";
import {
  TRANSACTION_TAB_ITEMS,
  type TransactionTabFilter,
  TransactionDetailPanel,
  TransactionListCard,
  TransactionTabBar,
  filterTabStatus,
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
  useRejectTransaction,
  useReturnTransaction,
  useTransactionLookups,
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

const PAGE_LIMIT = 8;

export function TransactionsPage() {
  const viewer = useAppSelector((state) => state.auth.user);
  const viewerId = viewer?.id;

  const [activeTab, setActiveTab] = useState<TransactionTabFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(
    null,
  );
  const [publishedReviewRecords, setPublishedReviewRecords] = useState<number[]>(
    [],
  );
  const [reviewStarsState, setReviewStarsState] = useState<
    Record<number, number>
  >({});
  const [reviewBodiesState, setReviewBodiesState] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

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
    viewerId !== undefined ? transactionQueryInputs : undefined,
    viewerId !== undefined,
  );

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

  const reviewPublicationSet = useMemo(
    () => new Set(publishedReviewRecords),
    [publishedReviewRecords],
  );

  const detailCopy =
    focusedTransaction !== undefined && viewerId !== undefined
      ? resolveDetailUi({
          reviewSubmitted: reviewPublicationSet.has(focusedTransaction.id),
          transaction: focusedTransaction,
          viewerId,
        })
      : null;

  const reviewGrade =
    focusedTransaction !== undefined ? reviewStarsState[focusedTransaction.id] ?? 0 : 0;
  const reviewBody =
    focusedTransaction !== undefined
      ? reviewBodiesState[focusedTransaction.id] ?? ""
      : "";

  const synchronizeReviewStars = (value: number) => {
    if (focusedTransaction === undefined) {
      return;
    }

    setReviewStarsState((before) => ({
      ...before,
      [focusedTransaction.id]: value,
    }));
  };

  const synchronizeReviewBody = (value: string) => {
    if (focusedTransaction === undefined) {
      return;
    }

    setReviewBodiesState((before) => ({
      ...before,
      [focusedTransaction.id]: value,
    }));
  };

  const commitReviewPublication = () => {
    if (focusedTransaction === undefined) {
      return;
    }

    if (reviewGrade <= 0) {
      return;
    }

    setPublishedReviewRecords((past) =>
      past.includes(focusedTransaction.id) ? past : [...past, focusedTransaction.id],
    );
  };

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pt-8 pb-16">
      <h1 className="text-[30px] leading-9 font-bold tracking-[-0.75px] text-[#0F172B]">
        Транзакции
      </h1>

      <div className="mt-6">
        <TransactionTabBar
          items={TRANSACTION_TAB_ITEMS}
          activeId={activeTab}
          counts={tallyByTab}
          onChange={(nextLedger) => {
            setActiveTab(nextLedger);
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

          {viewerId !== undefined && isLoading ? (
            <div className="text-muted-foreground text-center text-sm">
              Загружаем сделки…
            </div>
          ) : null}

          {viewerId !== undefined && !isLoading && !transactionRows.length ? (
            <div className="text-muted-foreground rounded-2xl border border-dashed border-[#CBD5F5] p-12 text-center text-sm leading-6">
              Пока нет сделок в этом разделе.
            </div>
          ) : null}

          {viewerId !== undefined &&
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
                  reviewSubmitted: reviewPublicationSet.has(payload.id),
                  transaction: payload,
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
          {focusedTransaction !== undefined &&
          viewerId !== undefined &&
          detailCopy !== null ? (
            <TransactionDetailPanel
              counterpartNameDetail={elongatedCounterpart}
              counterpartNameShort={abbreviatedCounterpart}
              isApprovePending={approveMutation.isPending}
              isRejectPending={rejectMutation.isPending}
              isReturnPending={returnMutation.isPending}
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
          ) : (
            <div className="text-muted-foreground rounded-[24px] border border-transparent border-t-[#E2E8F0] bg-white p-12 text-center text-sm shadow-sm">
              Выберите сделку из списка.
            </div>
          )}
        </aside>
      </div>

    </main>
  );
}
