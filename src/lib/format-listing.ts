export function formatRubAmount(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const EMPTY_CHARACTERISTICS = "Характеристики отсутствуют.";

/** API может вернуть строку или объект (в т.ч. пустой `{}`). */
export function formatItemCharacteristics(
  value: unknown,
  emptyFallback = EMPTY_CHARACTERISTICS,
): string {
  if (value == null) {
    return emptyFallback;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || emptyFallback;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return emptyFallback;
    }

    return entries
      .map(([key, raw]) => {
        const formatted =
          raw == null || raw === ""
            ? "—"
            : typeof raw === "object"
              ? JSON.stringify(raw)
              : String(raw);
        return `${key}: ${formatted}`;
      })
      .join("\n");
  }

  return String(value);
}

export function reviewsLabel(count: number): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return `${count} отзывов`;
  if (n1 > 1 && n1 < 5) return `${count} отзыва`;
  if (n1 === 1) return `${count} отзыв`;
  return `${count} отзывов`;
}
