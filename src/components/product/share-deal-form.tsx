import { Check, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ItemDetail } from "@/api/schema";
import { formatRubAmount } from "@/lib/format-listing";
import { parseListingPrice, shareSlotPercent } from "@/lib/listing-deal";
import { cn } from "@/lib/utils";

const SHARE_BENEFITS = [
  "Юридическое оформление",
  "Доход от сдачи в аренду",
  "Бесплатное использование",
] as const;

export function ShareDealForm({
  product,
  totalSlots,
  remainingSlots,
  sharePercent,
  onSharePercentChange,
  onProceed,
  proceedDisabled = false,
  proceedHint,
}: {
  product: ItemDetail;
  totalSlots: number;
  remainingSlots: number;
  sharePercent: number;
  onSharePercentChange: (value: number) => void;
  onProceed: () => void;
  proceedDisabled?: boolean;
  proceedHint?: string;
}) {
  const itemPrice = parseListingPrice(product.price);
  const shareCost = Math.round((itemPrice * sharePercent) / 100);

  const slotPercent = shareSlotPercent(totalSlots);
  /** За одну оплату — одна доля (один слот), как в API join. */
  const percentOptions = remainingSlots > 0 ? [slotPercent] : [];
  const shareOptionLabel =
    totalSlots > 1
      ? `1 доля (${slotPercent % 1 === 0 ? slotPercent : slotPercent.toFixed(1)}%)`
      : "100%";

  const primaryImage =
    product.images?.find((img) => img.is_main)?.image ??
    product.images?.[0]?.image;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex gap-4 rounded-[14px] border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-[10px] bg-white dark:bg-slate-800">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt=""
              className="size-full rounded-[10px] object-cover"
            />
          ) : (
            <Shield className="size-6 text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-base leading-6 font-medium text-slate-900 dark:text-slate-100">
            Доля в {product.name}
          </p>
          <p className="mt-1.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
            Осталось {remainingSlots} {shareSlotLabel(remainingSlots)} из{" "}
            {totalSlots}
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-2">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Размер доли
        </Label>
        <Select
          value={String(sharePercent)}
          onValueChange={(v) => onSharePercentChange(Number(v))}
        >
          <SelectTrigger className="h-[39px] w-full rounded-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {percentOptions.map((pct) => (
              <SelectItem key={pct} value={String(pct)}>
                {shareOptionLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 rounded-[14px] border border-slate-200 bg-slate-50 px-[17px] py-[17px] dark:border-slate-800 dark:bg-slate-800/40">
        <p className="text-sm leading-5 font-medium text-slate-900 dark:text-slate-100">
          Что вы получаете:
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {SHARE_BENEFITS.map((text) => (
            <li key={text} className="flex items-start gap-2">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                <Check
                  className="size-2.5 text-emerald-500"
                  strokeWidth={3}
                />
              </span>
              <span className="text-sm leading-5 text-slate-600 dark:text-slate-400">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-[25px] dark:border-slate-800">
        <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
          Стоимость {sharePercent % 1 === 0 ? sharePercent : sharePercent.toFixed(1)}% доли
        </span>
        <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
          {formatRubAmount(shareCost)} ₽
        </span>
      </div>

      {proceedHint && (
        <p className="text-sm leading-5 text-slate-500 dark:text-slate-400">
          {proceedHint}
        </p>
      )}

      <Button
        type="button"
        variant="blue"
        className={cn("mt-6 h-12 w-full rounded-[14px] text-base")}
        disabled={!proceedDisabled && remainingSlots <= 0}
        onClick={onProceed}
      >
        {proceedDisabled ? "Перейти к заявкам" : "Перейти к оплате"}
      </Button>

      <p className="mt-4 text-center text-xs leading-4 text-slate-500 dark:text-slate-400">
        Нажимая кнопку, вы соглашаетесь с условиями договора оферты
      </p>
    </div>
  );
}

function shareSlotLabel(count: number) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return "долей";
  if (n1 > 1 && n1 < 5) return "доли";
  if (n1 === 1) return "доля";
  return "долей";
}

export function getShareCheckoutAmount(
  product: ItemDetail,
  sharePercent: number,
) {
  const itemPrice = parseListingPrice(product.price);
  return Math.round((itemPrice * sharePercent) / 100);
}
