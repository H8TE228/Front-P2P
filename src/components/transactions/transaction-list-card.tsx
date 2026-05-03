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
        "relative flex min-h-[10rem] w-full cursor-pointer flex-col rounded-2xl border border-transparent border-t-[#BEDBFF] bg-white p-[17px] pb-4 text-left shadow-sm ring-[#155DFC1A] ring-offset-0 hover:brightness-[99%]",
        "[box-shadow:0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]",
        selected && "shadow-md ring-[3px]",
      )}
    >
      <div className="flex gap-4">
        <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white p-[1px]">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={productName}
              className="size-full rounded-[14px] object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-[14px] bg-white">
              <Camera className="size-8 text-[#CAD5E2]" strokeWidth={1.75} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base leading-6 font-bold text-[#0F172B]">
                {productName || "Объявление"}
              </p>
              <p className="mt-1 text-sm leading-5 font-medium text-[#62748E]">
                {presentation.roleLead}
              </p>
              <p className="mt-3 text-sm leading-6 font-medium text-[#45556C]">
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

          <div className="flex flex-wrap items-start justify-between gap-3 pt-4">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-lg leading-7 font-bold text-[#0F172B]">
                {priceLabel}
              </span>
              <span className="text-sm leading-5 font-medium text-[#62748E]">
                {rentedAtLabel}
              </span>
            </div>

            {presentation.footerAccent ? (
              <span className="inline-flex shrink-0 self-start text-sm leading-5 font-medium text-[#155DFC]">
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
