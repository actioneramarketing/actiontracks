export const PARTICIPANT_KEY_COOKIE = "action_tracks_participant_key";

/** 180 days in seconds */
export const PARTICIPANT_KEY_MAX_AGE = 180 * 24 * 60 * 60;

export function participantKeyCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: PARTICIPANT_KEY_MAX_AGE,
    path: "/",
  };
}
