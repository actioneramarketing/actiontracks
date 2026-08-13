import { ActionTrackEnrollment } from "@/lib/types/database";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return fallback;
  }
  return String(value);
}

export function normalizeEnrollment(
  raw: unknown
): ActionTrackEnrollment | null {
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
    track_id: asString(row.track_id),
    participant_id: asString(row.participant_id),
    user_id: asString(row.user_id),
    status: asString(row.status, "active"),
    enrolled_at: asString(row.enrolled_at),
    access_starts_at: asString(row.access_starts_at),
    access_ends_at: asString(row.access_ends_at),
    participant_key: asString(row.participant_key),
    created_at: asString(row.created_at, new Date().toISOString()),
    updated_at: asString(row.updated_at, new Date().toISOString()),
  };
}

function parseAccessBoundary(
  value: string,
  boundary: "start" | "end"
): Date | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const dateOnly = trimmed.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnly) {
    return new Date(
      `${dateOnly[1]}T${boundary === "start" ? "00:00:00.000" : "23:59:59.999"}`
    );
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export function isEnrollmentCurrentlyAccessible(
  enrollment: ActionTrackEnrollment,
  now = new Date()
): boolean {
  if (enrollment.status.trim().toLowerCase() !== "active") {
    return false;
  }

  const startsAt = parseAccessBoundary(enrollment.access_starts_at, "start");
  if (startsAt && now < startsAt) {
    return false;
  }

  const endsAt = parseAccessBoundary(enrollment.access_ends_at, "end");
  if (endsAt && now > endsAt) {
    return false;
  }

  return true;
}
