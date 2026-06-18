import { ActionTrack, TrackStatus } from "@/lib/types/database";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return fallback;
  }
  return String(value);
}

function asNullableString(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  const str = String(value).trim();
  return str || null;
}

function asNumberOrNull(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parseTrackStatus(value: unknown): TrackStatus {
  if (value === "active" || value === "archived" || value === "draft") {
    return value;
  }
  return "draft";
}

/** Normalize Postgres/Supabase date values to YYYY-MM-DD for date inputs. */
export function normalizeDateForInput(value: unknown): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const str = String(value).trim();
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

export function normalizeSettingsJson(
  value: unknown
): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
}

/**
 * Produces a plain, serializable ActionTrack safe for Client Components and forms.
 */
export function normalizeActionTrack(raw: unknown): ActionTrack | null {
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
    short_description: asNullableString(row.short_description),
    primary_outcome: asNullableString(row.primary_outcome),
    who_this_is_for: asNullableString(row.who_this_is_for),
    duration_weeks: asNumberOrNull(row.duration_weeks),
    track_type: asNullableString(row.track_type) ?? "live_guided",
    status: parseTrackStatus(row.status),
    start_date: normalizeDateForInput(row.start_date),
    end_date: normalizeDateForInput(row.end_date),
    philosophy: asNullableString(row.philosophy),
    guide_id: asNullableString(row.guide_id),
    welcome_headline: asNullableString(row.welcome_headline),
    completion_headline: asNullableString(row.completion_headline),
    settings_json: normalizeSettingsJson(row.settings_json),
    created_at: asString(row.created_at, new Date().toISOString()),
    updated_at: asString(row.updated_at, new Date().toISOString()),
  };
}
