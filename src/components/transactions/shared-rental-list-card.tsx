import type { SharedRental } from "@/api";
import { formatTransactionDateTime } from "@/lib/format-transaction";
import { resolveSharedRentalStatusPresentation } from "@/lib/listing-deal";
import { cn } from "@/lib/utils";
import { Camera, Users } from "lucide-react";

import { TransactionStatusChip } from "./transaction-status-chip";

export function SharedRentalListCard({
  rental,
  selected,
  viewerId,
  onSelect,
}: {
  rental: SharedRental;
  selected: boolean;
  viewerId?: number;
  onSelect: (id: number) => void;
}) {
  const item = rental.item_detail;
  const productName = item?.name ?? "Объявление";
  const thumbUrl =
    item?.images?.find((img) => img.is_main)?.image ?? item?.images?.[0]?.image;
  const status = resolveSharedRentalStatusPresentation(rental, viewerId);

  return (
    <button
      type="button"
      onClick={() => onSelect(rental.id)}
      className={cn(
        "relative flex min-h-[10rem] w-full cursor-pointer flex-col rounded-2xl border-t border-slate-200 bg-white p-[17px] pb-4 text-left ring-blue-500/10 ring-offset-0 hover:brightness-[99%] dark:border-slate-800 dark:bg-slate-900 dark:ring-blue-500/20",
        "[box-shadow:0px_1px_2px_-1px_#0000001A,0px_1px_3px_0px_#0000001A]",
        selected && "ring-[3px]",
      )}
    >
      <div className="flex gap-4">
        <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[16px] border border-slate-200 bg-white p-px dark:border-slate-800 dark:bg-slate-900">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={productName}
              className="size-full rounded-[14px] object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-[14px] bg-slate-100 dark:bg-slate-800">
              <Camera
                className="size-8 text-slate-300 dark:text-slate-600"
                strokeWidth={1.75}
              />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base leading-6 font-bold text-slate-900 dark:text-slate-100">
                {productName}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm leading-5 font-medium text-slate-500 dark:text-slate-400">
                <Users className="size-3.5 shrink-0" />
                {rental.participants_count ?? 0} / {rental.slots_needed ?? "—"}{" "}
                участников
              </p>
              <p className="mt-3 text-sm leading-6 font-medium text-slate-600 dark:text-slate-300">
                {formatTransactionDateTime(rental.planned_start)} —{" "}
                {formatTransactionDateTime(rental.planned_end)}
              </p>
            </div>

            <div className="shrink-0">
              <TransactionStatusChip
                label={status.label}
                tone={status.tone}
                dotClassName={status.dotClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
