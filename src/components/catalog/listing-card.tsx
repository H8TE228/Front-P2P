import { Star, Trash } from "lucide-react";
import { formatRubAmount, reviewsLabel } from "@/lib/format-listing";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Item } from "@/api/schema";
import { useDeleteProduct } from "@/hooks";

const productStatus: Record<string, string> = {
  available: "Доступен",
  rented: "Сдан",
  maintenance: "На обслуживании",
  unavailable: "Недоступен",
};

export function ListingCard({
  product,
  isMine,
}: {
  product: Item;
  isMine?: boolean;
}) {
  const { mutate, isPending } = useDeleteProduct();
  // const priceStr = `${formatRubAmount(product.priceRub)} ₽`;
  // const suffix =
  //   product.price.kind === "per_day"
  //     ? "день"
  //     : `доля ${product.price.percent}%`;

  return (
    <Link
      to={`/product/${product.id}`}
      className="flex w-full min-w-0 cursor-pointer flex-col rounded-xl p-2 transition-all hover:shadow-sm"
    >
      <div className="relative w-full">
        <img
          src={
            product.images![0]?.url ||
            "https://via.placeholder.com/300?text=No+Image"
          }
          alt={product.name}
          className="aspect-square w-full rounded-[14px] border border-[#E2E8F0] object-cover dark:border-[#1D293D]"
        />
        {/* {product.tag === "coownership" ? (
          <span
            className={cn(
              "absolute top-[13px] left-[13px]",
              "rounded-full bg-[#155DFC] px-2.5 py-1 text-[10px] leading-[15px] font-bold tracking-[0.5px] text-white uppercase",
            )}
          >
            Совладение
          </span>
        ) : (
          <span
            className={cn(
              "absolute top-[13px] left-[13px]",
              "rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[10px] leading-[15px] font-bold tracking-[0.5px] text-[#314158] uppercase dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#CAD5E2]",
            )}
          >
            Аренда
          </span>
        )} */}
        <span
          className={cn(
            "absolute top-[13px] left-[13px]",
            "rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-[10px] leading-[15px] font-bold tracking-[0.5px] text-[#314158] uppercase dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#CAD5E2]",
          )}
        >
          {productStatus[String(product.status)] ?? "Статус не указан"}
        </span>
        {isMine && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const isConfirmed = window.confirm("Удалить товар?");

              if (!isConfirmed) return;

              mutate(String(product.id));
            }}
            className="absolute top-[13px] right-[13px] flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 dark:border-[#1D293D] dark:bg-[#0F172B] dark:text-[#CAD5E2]"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col">
        <p className="flex flex-wrap items-baseline gap-x-1">
          <span className="text-lg leading-[22.5px] font-bold text-[#0F172B] dark:text-[#F1F5F9]">
            {product.price
              ? `${formatRubAmount(Number(product.price))} ₽`
              : "Цена не указана"}
          </span>
          {/* <span className="text-sm leading-5 font-normal tracking-normal text-[#62748E] dark:text-[#90A1B9]">
            / {suffix}
          </span> */}
        </p>

        <h3 className="mt-1 text-sm leading-[19.25px] font-medium text-[#0F172B] dark:text-[#F1F5F9]">
          {product.name}
        </h3>

        <div className="text-muted-foreground mt-1 line-clamp-2 overflow-hidden text-sm leading-[19.25px] break-words">
          {product.description}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-1 text-xs leading-4">
          {/* <Star
            className="size-3.5 shrink-0 fill-[#F5B400] text-[#F5B400]"
            aria-hidden
          /> */}
          <span className="font-medium text-[#314158] dark:text-[#CAD5E2]">
            {/* {ratingStr} */}
          </span>
          <span className="font-normal text-[#62748E] dark:text-[#90A1B9]">
            {/* · {reviewsLabel(product.reviewsCount)} */}
          </span>
        </div>

        <p className="mt-1 text-xs leading-4 font-normal text-[#62748E] dark:text-[#90A1B9]">
          {/* {product.location} */}
        </p>
      </div>
    </Link>
  );
}
