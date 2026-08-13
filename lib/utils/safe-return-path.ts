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

export function withReturnToQuery(path: string, returnTo?: string | null): string {
  const safe = getSafeReturnPath(returnTo);
  if (!safe) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}returnTo=${encodeURIComponent(safe)}`;
}
