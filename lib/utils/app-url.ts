export function buildAppUrl(path: string): string {
  const origin = (process.env.NEXT_PUBLIC_APP_URL ?? "").trim().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!origin) {
    return normalizedPath;
  }
  return `${origin}${normalizedPath}`;
}

export function buildTrackJoinPath(trackSlug: string): string {
  return `/join/${trackSlug.trim()}`;
}

export function buildTrackPreviewPath(trackSlug: string, stageSlug: string): string {
  return `/track/${trackSlug.trim()}/stages/${stageSlug.trim()}`;
}
