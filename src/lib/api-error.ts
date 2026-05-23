export function getApiErrorMessage(
  err: unknown,
  fallback = "Произошла ошибка",
): string {
  const anyErr = err as { response?: { data?: unknown }; message?: string };
  const data = anyErr?.response?.data;

  let detail: unknown =
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    ("detail" in data || "message" in data)
      ? (data as { detail?: unknown; message?: unknown }).detail ??
        (data as { message?: unknown }).message
      : anyErr?.message;

  if (
    detail == null &&
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    const parts = Object.entries(data as Record<string, unknown>).flatMap(
      ([key, val]) =>
        Array.isArray(val)
          ? val.map((x) => `${key}: ${String(x)}`)
          : [`${key}: ${String(val)}`],
    );
    if (parts.length > 0) detail = parts.join(" ");
  }

  return typeof detail === "string" && detail.trim().length > 0
    ? detail
    : fallback;
}
