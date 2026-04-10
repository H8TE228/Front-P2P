import { Star } from "lucide-react";
import { formatRubAmount, reviewsLabel } from "@/lib/format-listing";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

const tagCoClass =
  "rounded-full bg-[#155DFC] px-2.5 py-1 text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-white";

const tagRentClass =
  "rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#314158] dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#CAD5E2]";

export function ListingCard({ listing }: { listing: Listing }) {
  const priceStr = `${formatRubAmount(listing.priceRub)} ₽`;
  const suffix =
    listing.price.kind === "per_day"
      ? "день"
      : `доля ${listing.price.percent}%`;

  const ratingStr =
    listing.rating % 1 === 0
      ? `${listing.rating}.0`
      : String(listing.rating);

  return (
    <article className="flex w-full min-w-0 cursor-pointer flex-col">
      <div className="relative w-full">
        <img
          src={listing.imageSrc}
          alt=""
          className="aspect-square w-full rounded-[14px] border border-[#E2E8F0] object-cover dark:border-[#1D293D]"
        />
        {listing.tag === "coownership" ? (
          <span className={cn("absolute left-[13px] top-[13px]", tagCoClass)}>
            Совладение
          </span>
        ) : (
          <span className={cn("absolute left-[13px] top-[13px]", tagRentClass)}>
            Аренда
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col">
        <p className="flex flex-wrap items-baseline gap-x-1">
          <span className="text-lg font-bold leading-[22.5px] text-[#0F172B] dark:text-[#F1F5F9]">
            {priceStr}
          </span>
          <span className="text-sm font-normal leading-5 tracking-normal text-[#62748E] dark:text-[#90A1B9]">
            {" "}
            / {suffix}
          </span>
        </p>

        <h3 className="mt-1 text-sm font-medium leading-[19.25px] text-[#0F172B] dark:text-[#F1F5F9]">
          {listing.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-1 text-xs leading-4">
          <Star
            className="size-3.5 shrink-0 fill-[#CAD5E2] text-[#CAD5E2] dark:fill-[#45556C] dark:text-[#45556C]"
            aria-hidden
          />
          <span className="font-medium text-[#314158] dark:text-[#CAD5E2]">{ratingStr}</span>
          <span className="font-normal text-[#62748E] dark:text-[#90A1B9]">
            · {reviewsLabel(listing.reviewsCount)}
          </span>
        </div>

        <p className="mt-1 text-xs font-normal leading-4 text-[#62748E] dark:text-[#90A1B9]">
          {listing.location}
        </p>
      </div>
    </article>
  );
}
