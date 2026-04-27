import { useUserProfile } from "@/hooks";
import { useAppSelector } from "@/hooks/rtk";
import { MapPin, Shield, Star } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

export function UserProfilePage() {
  const { id } = useParams();
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const isOwnProfile = Boolean(
    id && currentUserId && id === String(currentUserId),
  );
  const { data } = useUserProfile(id ?? "", !isOwnProfile);

  if (isOwnProfile) {
    return <Navigate to="/my-profile" replace />;
  }

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8">
      <div className="w-full max-w-[1248px]">
        <section className="mb-10 flex h-32 items-center gap-5 border-b pb-8">
          {/* <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-[#e2e8f0]">
            {data?.profile_picture ? (
              <img
                src={data.profile_picture}
                alt={data?.first_name || data?.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-gray-600">
                {(
                  data?.username?.[0] ||
                  "?"
                ).toUpperCase()}
              </span>
            )}
          </div> */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start overflow-hidden rounded-full bg-[#e2e8f0]">
            <span className="text-2xl font-semibold text-gray-600">
              {(data?.username?.[0] || "?").toUpperCase()}
            </span>
          </div>
          <div className="flex h-full w-full justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{data?.username}</h1>
              <span className="text-muted-foreground mb-2 flex gap-5 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="size-4.5" />
                  {data?.rating || 0}
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
          </div>
        </section>

        <section className="mb-8">
          <div className="relative flex justify-between border-b">
            <div className="w-61 border-b-3 border-black pb-5">
              <h2 className="text-lg font-semibold">Объявления пользователя</h2>
            </div>
          </div>
        </section>

        <section className="grid min-h-104 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* {data?.items?.map((p: any) => (
            <ListingCard key={p.id} product={p} />
          ))} */}
        </section>
      </div>
    </main>
  );
}
