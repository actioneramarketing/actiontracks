import { ActionTrackParticipant } from "@/lib/types/database";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return fallback;
  }
  return String(value);
}

export function normalizeParticipant(
  raw: unknown
): ActionTrackParticipant | null {
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
    user_id: asString(row.user_id),
    email: asString(row.email),
    full_name: asString(row.full_name),
    avatar_url: asString(row.avatar_url),
    status: asString(row.status, "active"),
    created_at: asString(row.created_at, new Date().toISOString()),
    updated_at: asString(row.updated_at, new Date().toISOString()),
  };
}
