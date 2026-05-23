import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRubAmount } from "@/lib/format-listing";
import { cn } from "@/lib/utils";

export function PaymentStubForm({
  totalLabel,
  totalAmount,
  isPending,
  error,
  onBack,
  onPay,
}: {
  totalLabel: string;
  totalAmount: number;
  isPending: boolean;
  error: string | null;
  onBack: () => void;
  onPay: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Номер карты
          </Label>
          <Input
            className="h-10 rounded-[10px]"
            placeholder="0000 0000 0000 0000"
            defaultValue="4242 4242 4242 4242"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Срок
            </Label>
            <Input className="h-10 rounded-[10px]" placeholder="MM/YY" defaultValue="12/28" />
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              CVC
            </Label>
            <Input className="h-10 rounded-[10px]" placeholder="CVC" defaultValue="123" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Имя держателя
          </Label>
          <Input className="h-10 rounded-[10px]" placeholder="IVAN IVANOV" defaultValue="IVAN IVANOV" />
        </div>
      </div>

      <div
        className={cn(
          "mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800",
        )}
      >
        <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
          {totalLabel}
        </span>
        <span className="text-lg leading-7 font-bold text-slate-900 dark:text-slate-100">
          {formatRubAmount(totalAmount)} ₽
        </span>
      </div>

      {error && (
        <p className="text-destructive mt-3 text-sm">{error}</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="blue"
          className="h-12 w-full rounded-[14px] text-base"
          disabled={isPending}
          onClick={onPay}
        >
          <CreditCard className="size-4" />
          {isPending ? "Оформляем..." : "Оплатить"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-[14px]"
          disabled={isPending}
          onClick={onBack}
        >
          Назад
        </Button>
      </div>
    </div>
  );
}
