import type { ReactNode } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DealModalShell({
  open,
  onOpenChange,
  title,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-h-[calc(100vh-2rem)] gap-0 overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-[25px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:max-w-[448px] dark:border-slate-800 dark:bg-slate-900",
          className,
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <DialogTitle className="text-2xl leading-8 font-bold text-slate-900 dark:text-slate-100">
            {title}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Закрыть"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
