import { cn } from "@/lib/utils";

const interFont =
  '"Inter Variable", Inter, system-ui, sans-serif' as const;

export type ServiceOfferingCardProps = {
  title: string;
  description: string;
  linkLabel: string;
  href?: string;
  /** Декоративный круг справа (цвет + непрозрачность из макета) */
  accentCircleClassName: string;
  className?: string;
};

export function ServiceOfferingCard({
  title,
  description,
  linkLabel,
  href = "#",
  accentCircleClassName,
  className,
}: ServiceOfferingCardProps) {
  return (
    <article
      className={cn(
        "relative min-h-[236px] w-full max-w-[616px] overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] lg:max-w-none",
        className,
      )}
      style={{ fontFamily: interFont }}
    >
      <div className="relative z-10 box-border w-full max-w-[417px] pt-[33px] pb-[33px] pl-[33px] pr-4">
        <h3 className="text-[30px] font-bold leading-9 tracking-[-0.75px] text-[var(--app-text)]">
          {title}
        </h3>
        <p className="mt-4 max-w-[384px] text-base font-normal leading-[26px] tracking-normal text-[var(--app-text-muted)]">
          {description}
        </p>
        <a
          href={href}
          className="mt-[18px] inline-block text-base font-medium leading-6 tracking-normal text-[var(--app-link)] transition-opacity hover:opacity-80"
        >
          {linkLabel}
        </a>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute h-64 w-64 rounded-full max-lg:-right-10 max-lg:top-[-31px] lg:left-[391px] lg:top-[-31px]",
          accentCircleClassName,
        )}
        aria-hidden
      />
    </article>
  );
}
