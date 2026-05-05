import type { Transaction } from "@/api/schema";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

import { TransactionStatusChip } from "./transaction-status-chip";
import type { CardUi } from "./transactions-view-model";

export function TransactionListCard({
  transaction,
  thumbUrl,
  productName,
  priceLabel,
  rentedAtLabel,
  presentation,
  selected,
  onSelect,
}: {
  transaction: Transaction;
  thumbUrl?: string;
  productName: string;
  priceLabel: string;
  rentedAtLabel: string;
  presentation: CardUi;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button
      key={transaction.id}
      type="button"
      onClick={() => onSelect(transaction.id)}
      className={cn(
        "relative flex min-h-[10rem] w-full cursor-pointer flex-col rounded-2xl border-t border-slate-200 bg-white p-[17px] pb-4 text-left ring-blue-500/10 ring-offset-0 hover:brightness-[99%] dark:border-slate-800 dark:bg-slate-900 dark:ring-blue-500/20",
        "[box-shadow:0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]",
        selected && "ring-[3px]",
      )}
    >
      <div className="flex gap-4">
        <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[16px] border border-slate-200 bg-white p-[1px] dark:border-slate-800 dark:bg-slate-900">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={productName}
              className="size-full rounded-[14px] object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-[14px] bg-slate-100 dark:bg-slate-800">
              <Camera className="size-8 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base leading-6 font-bold text-slate-900 dark:text-slate-100">
                {productName || "Объявление"}
              </p>
              <p className="mt-1 text-sm leading-5 font-medium text-slate-500 dark:text-slate-400">
                {presentation.roleLead}
              </p>
              <p className="mt-3 text-sm leading-6 font-medium text-slate-600 dark:text-slate-300">
                {presentation.description}
              </p>
            </div>

            <div className="shrink-0">
              <TransactionStatusChip
                label={presentation.chipLabel}
                tone={presentation.chipTone}
                dotClassName={presentation.chipDotClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
                {priceLabel}
              </span>
              <span className="text-sm leading-5 font-medium text-slate-500 dark:text-slate-400">
                {rentedAtLabel}
              </span>
            </div>

            {presentation.footerAccent ? (
              <span className="inline-flex shrink-0 text-sm leading-5 font-medium text-blue-600 dark:text-blue-500">
                {presentation.footerAccent}
              </span>
            ) : (
              <span className="h-5 shrink-0" aria-hidden />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
