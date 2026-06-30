import {
  PARTICIPANT_KEY_COOKIE,
  participantKeyCookieOptions,
} from "@/lib/participant/participant-key";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function getParticipantKeyFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PARTICIPANT_KEY_COOKIE)?.value?.trim();
  return value || null;
}

export async function getOrCreateParticipantKey(): Promise<{
  participantKey: string;
  isNew: boolean;
}> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(PARTICIPANT_KEY_COOKIE)?.value?.trim();

  if (existing) {
    return { participantKey: existing, isNew: false };
  }

  const participantKey = randomUUID();
  cookieStore.set(
    PARTICIPANT_KEY_COOKIE,
    participantKey,
    participantKeyCookieOptions()
  );

  return { participantKey, isNew: true };
}

export async function getOptionalParticipantUser(): Promise<{
  participantUserId: string | null;
  participantEmail: string | null;
}> {
  try {
    const { getCurrentUser } = await import("@/lib/auth/guide");
    const user = await getCurrentUser();
    if (!user) {
      return { participantUserId: null, participantEmail: null };
    }
    return {
      participantUserId: user.id,
      participantEmail: user.email ?? null,
    };
  } catch {
    return { participantUserId: null, participantEmail: null };
  }
}
