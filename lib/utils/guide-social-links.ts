export const SOCIAL_LINK_KEYS = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "x",
  "other",
] as const;

export type SocialLinkKey = (typeof SOCIAL_LINK_KEYS)[number];

export interface GuideSocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  x: string;
  other: string;
}

export const SOCIAL_LINK_LABELS: Record<SocialLinkKey, string> = {
  facebook: "Facebook URL",
  instagram: "Instagram URL",
  linkedin: "LinkedIn URL",
  youtube: "YouTube URL",
  tiktok: "TikTok URL",
  x: "X / Twitter URL",
  other: "Other URL",
};

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (value == null) {
    return "";
  }
  return String(value);
}

export function emptySocialLinks(): GuideSocialLinks {
  return {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    x: "",
    other: "",
  };
}

export function normalizeSocialLinks(
  raw: unknown,
  legacySocialUrl = ""
): GuideSocialLinks {
  const links = emptySocialLinks();

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    for (const key of SOCIAL_LINK_KEYS) {
      links[key] = asString(obj[key]);
    }
  }

  if (!links.other.trim() && legacySocialUrl.trim()) {
    links.other = legacySocialUrl.trim();
  }

  return links;
}

import { normalizeOptionalUrl } from "@/lib/utils/guide-profile-urls";

export function socialLinksFromFormData(formData: FormData): GuideSocialLinks {
  return {
    facebook: normalizeOptionalUrl(String(formData.get("social_facebook") ?? "")),
    instagram: normalizeOptionalUrl(String(formData.get("social_instagram") ?? "")),
    linkedin: normalizeOptionalUrl(String(formData.get("social_linkedin") ?? "")),
    youtube: normalizeOptionalUrl(String(formData.get("social_youtube") ?? "")),
    tiktok: normalizeOptionalUrl(String(formData.get("social_tiktok") ?? "")),
    x: normalizeOptionalUrl(String(formData.get("social_x") ?? "")),
    other: normalizeOptionalUrl(String(formData.get("social_other") ?? "")),
  };
}

export function getActiveSocialLinks(links: GuideSocialLinks): Array<{
  key: SocialLinkKey;
  label: string;
  url: string;
}> {
  return SOCIAL_LINK_KEYS.filter((key) => links[key].trim()).map((key) => ({
    key,
    label: SOCIAL_LINK_LABELS[key].replace(" URL", ""),
    url: links[key],
  }));
}
