import { ActionTrack, TrackStatus } from "@/lib/types/database";

export type NormalizedActionTrack = ActionTrack;

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return fallback;
  }
  return String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  if (value == null || value === "") {
    return fallback;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function parseTrackStatus(value: unknown): TrackStatus {
  if (value === "active" || value === "archived" || value === "draft") {
    return value;
  }
  return "draft";
}

/** Normalize Postgres/Supabase date values to YYYY-MM-DD for date inputs. */
export function normalizeDateForInput(value: unknown): string {
  if (value == null || value === "") {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const str = String(value).trim();
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

export function normalizeSettingsJson(
  value: unknown
): Record<string, unknown> {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return {};
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return JSON.parse(JSON.stringify(parsed)) as Record<string, unknown>;
      }
    } catch {
      return {};
    }
    return {};
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
  }

  return {};
}

/**
 * Produces a plain, serializable ActionTrack safe for Client Components and forms.
 */
export function normalizeActionTrack(raw: unknown): NormalizedActionTrack | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const row = raw as Record<string, unknown>;
  const id = asString(row.id).trim();
  if (!id) {
    return null;
  }

  return {
    id,
    slug: asString(row.slug),
    title: asString(row.title),
    short_description: asString(row.short_description),
    full_description: asString(row.full_description),
    primary_outcome: asString(row.primary_outcome),
    who_this_is_for: asString(row.who_this_is_for),
    current_struggle: asString(row.current_struggle),
    track_type: asString(row.track_type, "live_guided"),
    status: parseTrackStatus(row.status),
    duration_weeks: asNumber(row.duration_weeks, 0),
    start_date: normalizeDateForInput(row.start_date),
    end_date: normalizeDateForInput(row.end_date),
    visibility: asString(row.visibility),
    hero_image_url: asString(row.hero_image_url),
    reward_title: asString(row.reward_title),
    guide_id: asString(row.guide_id),
    settings_json: normalizeSettingsJson(row.settings_json),
    created_at: asString(row.created_at, new Date().toISOString()),
    updated_at: asString(row.updated_at, new Date().toISOString()),
  };
}

/** Extra safety pass before passing track props to Client Components. */
export function serializeActionTrackForClient(
  track: NormalizedActionTrack
): NormalizedActionTrack {
  return JSON.parse(JSON.stringify(track)) as NormalizedActionTrack;
}
