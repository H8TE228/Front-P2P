import { cn } from "@/lib/utils";

export type ServiceOfferingCardProps = {
  title: string;
  description: string;
  linkLabel: string;
  href?: string;
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
        "relative min-h-[236px] w-full max-w-[616px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] lg:max-w-none dark:border-[#1D293D] dark:bg-[#0F172B]",
        className,
      )}
    >
      <div className="relative z-10 box-border w-full max-w-[417px] pt-[33px] pr-4 pb-[33px] pl-[33px]">
        <h3 className="text-[30px] leading-9 font-bold tracking-[-0.75px] text-[#0F172B] dark:text-[#F1F5F9]">
          {title}
        </h3>
        <p className="mt-4 max-w-[384px] text-base leading-[26px] font-normal tracking-normal text-[#62748E] dark:text-[#90A1B9]">
          {description}
        </p>
        <a
          href={href}
          className="mt-[18px] inline-block text-base leading-6 font-medium tracking-normal text-[#155DFC] transition-opacity hover:opacity-80 dark:text-[#51A2FF]"
        >
          {linkLabel}
        </a>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute h-64 w-64 rounded-full max-lg:top-[-31px] max-lg:-right-10 lg:top-[-31px] lg:left-[391px]",
          accentCircleClassName,
        )}
        aria-hidden
      />
    </article>
  );
}
