import { cn } from "@/lib/utils";

export function TransactionTabBar<T extends string>({
  items,
  activeId,
  onChange,
  counts,
}: {
  items: readonly { id: T; label: string }[];
  activeId: T;
  onChange: (next: T) => void;
  counts: Partial<Record<T, number>>;
}) {
  return (
    <div className="-mx-1 flex gap-8 overflow-x-auto border-b border-[#E2E8F0]">
      {items.map((tab) => {
        const selected = tab.id === activeId;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative shrink-0 cursor-pointer border-0 border-b-[3px] bg-transparent pb-4 text-lg leading-7 font-bold transition-colors hover:text-[#314158]",
              selected
                ? "border-[#0F172B] text-[#0F172B]"
                : "border-transparent text-[#0F172B]",
            )}
          >
            <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap")}>
              <span>{tab.label}</span>
              <span className="text-base leading-6 font-semibold text-[#45556C]">
                {count === undefined ? "—" : count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
