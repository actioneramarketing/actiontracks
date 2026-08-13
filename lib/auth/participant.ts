import "server-only";

import {
  ensureParticipantForUser,
  getParticipantByEmail,
  getParticipantByUserId,
} from "@/lib/actions/participants";
import { getCurrentUser } from "@/lib/auth/guide";
import { ActionTrackParticipant } from "@/lib/types/database";
import type { User } from "@supabase/supabase-js";

export { ensureParticipantForUser } from "@/lib/actions/participants";

function metadataFullName(user: User): string | undefined {
  const value = user.user_metadata?.full_name;
  return typeof value === "string" ? value : undefined;
}

export async function getCurrentParticipant(): Promise<ActionTrackParticipant | null> {
  const user = await getCurrentUser();
  if (!user?.email) {
    return null;
  }

  try {
    const byUserId = await getParticipantByUserId(user.id);
    if (byUserId) {
      return byUserId;
    }

    return getParticipantByEmail(user.email);
  } catch (error) {
    console.error("[getCurrentParticipant] Unexpected error", {
      userId: user.id,
      error,
    });
    return null;
  }
}

export type RequireParticipantResult =
  | { status: "unauthenticated" }
  | { status: "ok"; participant: ActionTrackParticipant; user: User };

export async function requireParticipant(): Promise<RequireParticipantResult> {
  const user = await getCurrentUser();
  if (!user?.email) {
    return { status: "unauthenticated" };
  }

  const participant = await ensureParticipantForUser(
    user.id,
    user.email,
    metadataFullName(user)
  );

  return { status: "ok", participant, user };
}
