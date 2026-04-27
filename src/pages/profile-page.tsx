import { ListingCard } from "@/components";
import { Button } from "@/components/ui/button";
import { useProducts, useProfile } from "@/hooks";
import { useAppDispatch } from "@/hooks/rtk";
import { logout } from "@/store/auth-slice";
import { MapPin, MapPinOff, Pen, Shield, Star } from "lucide-react";
import { DoorClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import listingPlaceholder from "@/assets/react.svg";

export function ProfilePage() {
  const navigate = useNavigate();
  const { data } = useProfile();
  const { data: listingsData, isLoading: isListingsLoading } = useProducts({
    page_size: 200,
    owner: data?.id,
  });
  const dispatch = useAppDispatch();
  const myListingsRaw = Array.isArray((listingsData as any)?.results)
    ? (listingsData as any).results
    : [];
  const rawDealFormatMap = localStorage.getItem("listing-deal-format-map");
  const dealFormatMap: Record<string, "rent" | "coownership"> =
    rawDealFormatMap && rawDealFormatMap.trim().length > 0
      ? JSON.parse(rawDealFormatMap)
      : {};
  const myListings = myListingsRaw
    .filter((item: any) => {
      const ownerId =
        typeof item?.owner === "number"
          ? item.owner
          : typeof item?.owner?.id === "number"
            ? item.owner.id
            : undefined;
      return data?.id ? ownerId === data.id : true;
    })
    .map((item: any) => {
      const listingTag = dealFormatMap[String(item.id)] ?? "rent";
      return {
        id: String(item.id),
        tag: listingTag,
        imageSrc:
          item.images?.find((image: any) => image?.is_main)?.url ||
          item.images?.[0]?.url ||
          listingPlaceholder,
        priceRub: Number(item.price) || 0,
        price:
          listingTag === "coownership"
            ? ({ kind: "share", percent: 50 } as const)
            : ({ kind: "per_day" } as const),
        title: item.name || "Без названия",
        rating: 0,
        reviewsCount: 0,
        location: item.owner?.city || item.category_name || "Локация не указана",
      };
    });

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="w-full max-w-[1248px]">
        <section className="mb-10 flex items-center gap-5 border-b pb-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-[#e2e8f0]">
            {data?.profile_picture ? (
              <img
                src={data.profile_picture}
                alt={data?.first_name || data?.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-600">
                {(
                  data?.first_name?.[0] ||
                  data?.username?.[0] ||
                  "?"
                ).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex h-full w-full justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{data?.username}</h1>
              <span className="text-muted-foreground mb-2 flex gap-5 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="size-4.5" />
                  Нет отзывов
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="size-4.5" />
                  Документы не указаны
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-4.5" />
                  {data?.city || "Город не указан"}
                </div>
              </span>
              <div className="text-muted-foreground">описание</div>
            </div>
            <div className="flex w-full max-w-40 flex-col justify-between">
              <Button
                className="h-10 rounded-2xl border shadow-sm"
                onClick={() => navigate("/profile/edit")}
                variant="outline"
              >
                <Pen className="size-4" />
                Редактировать
              </Button>
              <Button
                variant="destructive"
                className="border-destructive/20 h-10 rounded-2xl shadow-sm"
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                <DoorClosed className="size-4" />
                Выйти
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="relative flex justify-between border-b">
            <div className="w-41 border-b-3 border-black pb-5">
              <h2 className="text-lg font-semibold">Мои объявления</h2>
            </div>
            <Button
              variant="blue"
              className="absolute right-0 -bottom-1/3 h-9.5 rounded-2xl border-[#155dfc] shadow-md"
              onClick={() => {
                navigate("/listing-form");
              }}
            >
              Разместить объявление
            </Button>
          </div>
        </section>

        <section className="grid min-h-104 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isListingsLoading ? <div>Загрузка...</div> : null}
          {!isListingsLoading &&
            myListings.map((p: any) => <ListingCard key={p.id} listing={p} />)}
          {!isListingsLoading && myListings.length === 0 ? (
            <div className="text-muted-foreground col-span-full py-10 text-center">
              У вас пока нет объявлений
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
