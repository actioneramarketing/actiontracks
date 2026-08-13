export function getSafeReturnPath(
  raw: string | null | undefined,
  fallback = ""
): string {
  if (!raw) {
    return fallback;
  }

  const value = raw.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return fallback;
  }

  return value;
}
