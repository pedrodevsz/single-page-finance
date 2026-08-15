export function getLocalDateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value || typeof value !== "string") return null;

  // YYYY-MM-DD (LocalDate from backend)
  const localDateMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (localDateMatch) {
    const [y, m, d] = value.split("-").map((v) => Number(v));
    if (Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d)) {
      return new Date(y, m - 1, d);
    }
    return null;
  }

  // Try to parse ISO/UTC datetime or other formats
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed;
}
