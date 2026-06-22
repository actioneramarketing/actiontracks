import { GuideProfile } from "@/lib/types/database";
import { normalizeSocialLinks } from "@/lib/utils/guide-social-links";

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return fallback;
  }
  return String(value);
}

export function normalizeGuideProfile(raw: unknown): GuideProfile | null {
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
    bio: asString(row.bio),
    status: asString(row.status, "approved"),
    profile_headline: asString(row.profile_headline),
    website_url: asString(row.website_url),
    social_url: asString(row.social_url),
    profile_image_url: asString(row.profile_image_url),
    public_email: asString(row.public_email),
    guide_slug: asString(row.guide_slug),
    social_links: normalizeSocialLinks(row.social_links, asString(row.social_url)),
    created_at: asString(row.created_at, new Date().toISOString()),
    updated_at: asString(row.updated_at, new Date().toISOString()),
  };
}
