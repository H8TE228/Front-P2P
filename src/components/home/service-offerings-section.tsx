import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function ServiceOfferingsSection() {
  return (
    <section className="mb-16 w-full">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        <article
          className={cn(
            "relative min-h-[236px] w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] lg:max-w-none dark:border-[#1D293D] dark:bg-[#0F172B]",
          )}
        >
          <div className="relative z-10 box-border w-full max-w-[417px] pt-[33px] pr-4 pb-[33px] pl-[33px]">
            <h3 className="text-[30px] leading-9 font-bold tracking-[-0.75px] text-[#0F172B] dark:text-[#F1F5F9]">
              Аренда вещей
            </h3>
            <p className="mt-4 max-w-[384px] text-base leading-[26px] font-normal tracking-normal text-[#62748E] dark:text-[#90A1B9]">
              Находите нужные вещи рядом, арендуйте на удобный срок и получайте
              подсказки по выбору, использованию и безопасности.
            </p>
            <Link
              to="#"
              className="mt-[18px] inline-block text-base leading-6 font-medium tracking-normal text-[#155DFC] transition-opacity hover:opacity-80 dark:text-[#51A2FF]"
            >
              Найти вещь →
            </Link>
          </div>

          <div
            className={cn(
              "pointer-events-none absolute h-64 w-64 rounded-full bg-[#E2E8F066] max-lg:top-[-31px] max-lg:-right-10 lg:top-[-31px] lg:left-[391px] dark:bg-[#1D293D80]",
            )}
            aria-hidden
          />
        </article>
        <article
          className={cn(
            "relative min-h-[236px] w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] lg:max-w-none dark:border-[#1D293D] dark:bg-[#0F172B]",
          )}
        >
          <div className="relative z-10 box-border w-full max-w-[417px] pt-[33px] pr-4 pb-[33px] pl-[33px]">
            <h3 className="text-[30px] leading-9 font-bold tracking-[-0.75px] text-[#0F172B] dark:text-[#F1F5F9]">
              Совместное владение
            </h3>
            <p className="mt-4 max-w-[384px] text-base leading-[26px] font-normal tracking-normal text-[#62748E] dark:text-[#90A1B9]">
              Покупайте дорогие вещи вместе с другими и пользуйтесь ими по
              прозрачному графику и понятным правилам.
            </p>
            <Link
              to="#"
              className="mt-[18px] inline-block text-base leading-6 font-medium tracking-normal text-[#155DFC] transition-opacity hover:opacity-80 dark:text-[#51A2FF]"
            >
              Узнать подробнее →
            </Link>
          </div>

          <div
            className={cn(
              "pointer-events-none absolute h-64 w-64 rounded-full bg-[#DBEAFE99] max-lg:top-[-31px] max-lg:-right-10 lg:top-[-31px] lg:left-[391px] dark:bg-[#193CB84D]",
            )}
            aria-hidden
          />
        </article>
      </div>
    </section>
  );
}
