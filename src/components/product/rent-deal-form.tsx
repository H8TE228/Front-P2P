import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DELIVERY_METHOD_LABELS,
  parseListingPrice,
} from "@/lib/listing-deal";
import { cn } from "@/lib/utils";

export type RentDealFormState = {
  startDate: string;
  endDate: string;
  deliveryMethod: string;
};

function countRentDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

export function RentDealForm({
  product,
  form,
  onChange,
  rentRangeInvalid,
  onProceed,
}: {
  product: ItemDetail;
  form: RentDealFormState;
  onChange: (patch: Partial<RentDealFormState>) => void;
  rentRangeInvalid: boolean;
  onProceed: () => void;
}) {
  const pricePerDay = parseListingPrice(product.price);
  const days = countRentDays(form.startDate, form.endDate);
  const rentTotal = pricePerDay * (days || 1);
  const depositTotal = Math.round(pricePerDay * 4);
  const grandTotal = rentTotal + depositTotal;

  const primaryImage =
    product.images?.find((img) => img.is_main)?.image ??
    product.images?.[0]?.image;

  const deliveryValue = form.deliveryMethod || product.delivery_method || "pickup";

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex gap-4 rounded-[14px] border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white dark:bg-slate-800">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Camera className="size-6 text-slate-300 dark:text-slate-600" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base leading-6 font-medium text-slate-900 dark:text-slate-100">
            {product.name}
          </p>
          <p className="mt-1.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
            {formatRubAmount(pricePerDay)} ₽ / день
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-2">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Даты аренды
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="h-[38px] flex-1 rounded-[10px]"
            value={form.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
          <span className="shrink-0 text-base text-slate-400">—</span>
          <Input
            type="date"
            className="h-[38px] flex-1 rounded-[10px]"
            value={form.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
        {rentRangeInvalid && form.startDate && form.endDate && (
          <p className="text-destructive text-sm">
            Укажите корректный период: окончание позже начала.
          </p>
        )}
      </div>

      <div className="mb-4 grid gap-2">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Способ получения
        </Label>
        <Select
          value={deliveryValue}
          onValueChange={(value) => onChange({ deliveryMethod: value })}
        >
          <SelectTrigger className="h-[39px] w-full rounded-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DELIVERY_METHOD_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="flex items-center justify-between gap-4">
          <span className="text-base leading-6 text-slate-600 dark:text-slate-400">
            Аренда ({days || 1} {days === 1 ? "день" : days < 5 ? "дня" : "дней"})
          </span>
          <span className="text-base leading-6 font-medium text-slate-900 dark:text-slate-100">
            {formatRubAmount(rentTotal)} ₽
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-base leading-6 text-slate-600 dark:text-slate-400">
            Залог (возвратный)
          </span>
          <span className="text-base leading-6 font-medium text-slate-900 dark:text-slate-100">
            {formatRubAmount(depositTotal)} ₽
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
            Итого к оплате
          </span>
          <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
            {formatRubAmount(grandTotal)} ₽
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="blue"
        className={cn("mt-6 h-12 w-full rounded-[14px] text-base")}
        disabled={rentRangeInvalid || !form.startDate || !form.endDate}
        onClick={onProceed}
      >
        Перейти к оплате
      </Button>

      <p className="mt-4 text-center text-xs leading-4 text-slate-500 dark:text-slate-400">
        Нажимая кнопку, вы соглашаетесь с условиями договора оферты
      </p>
    </div>
  );
}

export function getRentCheckoutTotals(
  product: ItemDetail,
  form: RentDealFormState,
) {
  const pricePerDay = parseListingPrice(product.price);
  const days = countRentDays(form.startDate, form.endDate) || 1;
  const rentTotal = pricePerDay * days;
  const depositTotal = Math.round(pricePerDay * 4);
  return {
    days,
    rentTotal,
    depositTotal,
    grandTotal: rentTotal + depositTotal,
  };
}
