import { ActionTrackStage } from "@/lib/types/database";

export type StageReleaseStatus =
  | { released: true; releaseAt: Date | null }
  | { released: false; releaseAt: Date };

function parseReleaseDate(value: unknown): Date | null {
  if (value == null || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function normalizeReleaseAt(value: unknown): string | null {
  const parsed = parseReleaseDate(value);
  return parsed ? parsed.toISOString() : null;
}

export function getStageReleaseStatus(
  stage: { release_at?: string | null },
  now = new Date()
): StageReleaseStatus {
  const releaseAt = parseReleaseDate(stage.release_at);
  if (!releaseAt) {
    return { released: true, releaseAt: null };
  }

  if (releaseAt.getTime() <= now.getTime()) {
    return { released: true, releaseAt };
  }

  return { released: false, releaseAt };
}

export function isStageReleased(
  stage: { release_at?: string | null },
  now = new Date()
): boolean {
  return getStageReleaseStatus(stage, now).released;
}

export function getOrderedStagesForRelease(
  stages: ActionTrackStage[]
): ActionTrackStage[] {
  return [...stages].sort((a, b) => {
    if (a.stage_number !== b.stage_number) {
      return a.stage_number - b.stage_number;
    }
    return a.created_at.localeCompare(b.created_at);
  });
}

export function getFirstAvailableStage(
  stages: ActionTrackStage[],
  now = new Date()
): ActionTrackStage | null {
  return (
    getOrderedStagesForRelease(stages).find((stage) => isStageReleased(stage, now)) ??
    null
  );
}

export function getNextAvailableStageLink(
  trackSlug: string,
  stages: ActionTrackStage[],
  now = new Date()
): string | null {
  const slug = trackSlug.trim();
  const first = getFirstAvailableStage(stages, now);
  const stageSlug = first?.slug?.trim();
  if (!slug || !stageSlug) {
    return null;
  }
  return `/track/${slug}/stages/${stageSlug}`;
}

export function getNextUpcomingReleaseAt(
  stages: ActionTrackStage[],
  now = new Date()
): Date | null {
  const upcoming = getOrderedStagesForRelease(stages)
    .map((stage) => getStageReleaseStatus(stage, now))
    .filter((status): status is { released: false; releaseAt: Date } => !status.released)
    .sort((a, b) => a.releaseAt.getTime() - b.releaseAt.getTime());

  return upcoming[0]?.releaseAt ?? null;
}

export function formatReleaseDateTime(value: string | Date | null | undefined): string | null {
  const date = parseReleaseDate(value ?? null);
  if (!date) {
    return null;
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toDatetimeLocalValue(value: string | null | undefined): string {
  const date = parseReleaseDate(value ?? null);
  if (!date) {
    return "";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function datetimeLocalToIso(value: string): string | null {
  return normalizeReleaseAt(value);
}

export function getGuideStageReleaseLabel(stage: { release_at?: string | null }): string {
  const formatted = formatReleaseDateTime(stage.release_at);
  if (!formatted) {
    return "Available immediately";
  }
  return `Releases ${formatted}`;
}
