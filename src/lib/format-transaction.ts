import { formatRubAmount } from "@/lib/format-listing";

export function formatTransactionDateTime(iso: string): string {
  const date = new Date(iso);

  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function formatTransactionRub(price: string): string {
  const n = Number(price);
  if (Number.isNaN(n)) {
    return price;
  }

  return `${formatRubAmount(n)} ₽`;
}

export function shortUserDisplayName(profile: {
  first_name?: string;
  last_name?: string;
  username?: string;
}): string {
  const first = profile.first_name?.trim();
  const last = profile.last_name?.trim();
  const initial = last?.[0];
  if (first && initial) {
    return `${first} ${initial}.`;
  }

  return profile.username || "Пользователь";
}
