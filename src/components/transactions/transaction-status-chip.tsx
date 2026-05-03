import { cn } from "@/lib/utils";

export type TransactionStatusTone =
  | "pending"
  | "approved"
  | "active"
  | "returning"
  | "completed"
  | "rejected";

export function TransactionStatusChip({
  label,
  tone,
  dotClassName,
}: {
  label: string;
  tone: TransactionStatusTone;
  dotClassName: string;
}) {
  const skins: Record<
    TransactionStatusTone,
    { pill: string; text: string; ring: string }
  > = {
    pending: {
      pill:
        "border-t border-[#FEF3C6] bg-[#FFFBEB] text-[#BB4D00] dark:bg-[#FFFBEB]/90",
      text: "text-[#BB4D00]",
      ring: "",
    },
    approved: {
      pill:
        "border-t border-[#DBEAFE] bg-[#EFF6FF] text-[#1447E6] dark:bg-[#EFF6FF]/90",
      text: "text-[#1447E6]",
      ring: "",
    },
    active: {
      pill:
        "border-t border-[#D0FAE5] bg-[#ECFDF5] text-[#007A55] dark:bg-[#ECFDF5]/90",
      text: "text-[#007A55]",
      ring: "",
    },
    returning: {
      pill:
        "border-t border-[#EDE9FE] bg-[#F5F3FF] text-[#7008E7] dark:bg-[#F5F3FF]/90",
      text: "text-[#7008E7]",
      ring: "",
    },
    completed: {
      pill:
        "border-t border-[#E2E8F0] bg-[#F1F5F9] text-[#314158] dark:bg-[#1D293D] dark:text-[#F1F5F9]",
      text: "text-[#314158]",
      ring: "",
    },
    rejected: {
      pill:
        "border-t border-[#FFE4E6] bg-[#FFF1F2] text-[#C70036] dark:bg-[#FFF1F2]/90",
      text: "text-[#C70036]",
      ring: "",
    },
  };

  const skin = skins[tone];

  return (
    <span
      className={cn(
        "inline-flex max-w-max items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-[12px] leading-4 font-semibold",
        skin.pill,
        skin.text,
      )}
    >
      <span className={cn("size-[6px] shrink-0 rounded-full", dotClassName)} />
      {label}
    </span>
  );
}
