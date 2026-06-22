"use server";

import {
  createAdminClient,
  SupabaseConfigError,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";
import { GuideProfile } from "@/lib/types/database";
import { normalizeGuideProfile } from "@/lib/utils/normalize-guide";
import { slugify } from "@/lib/utils/slug";
import { revalidatePath } from "next/cache";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function generateUniqueGuideSlug(
  base: string,
  fallback: string
): Promise<string> {
  const supabase = createAdminClient();
  const slugBase = slugify(base) || fallback;

  const { data: existing, error } = await supabase
    .from("action_track_guides")
    .select("guide_slug")
    .ilike("guide_slug", `${slugBase}%`);

  if (error) {
    throw new Error(error.message);
  }

  const taken = new Set((existing ?? []).map((row) => row.guide_slug));
  if (!taken.has(slugBase)) {
    return slugBase;
  }

  let candidate = `${slugBase}-${Date.now().toString(36).slice(-4)}`;
  while (taken.has(candidate)) {
    candidate = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return candidate;
}

export async function getGuideByUserId(
  userId: string
): Promise<GuideProfile | null> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("action_track_guides")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[getGuideByUserId] Supabase query failed", {
      userId,
      message: error.message,
      code: error.code,
    });
    return null;
  }

  return normalizeGuideProfile(data);
}

export async function getGuideByEmail(
  email: string
): Promise<GuideProfile | null> {
  const supabase = tryCreateAdminClient();
  if (!supabase) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);

  const { data, error } = await supabase
    .from("action_track_guides")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("[getGuideByEmail] Supabase query failed", {
      message: error.message,
      code: error.code,
    });
    return null;
  }

  return normalizeGuideProfile(data);
}

export async function upsertGuideForUser(params: {
  userId: string;
  email: string;
  fullName?: string;
}): Promise<GuideProfile> {
  const supabase = createAdminClient();
  const normalizedEmail = normalizeEmail(params.email);
  const fullName = params.fullName?.trim() || "";

  const existingByEmail = await getGuideByEmail(normalizedEmail);

  if (existingByEmail) {
    const updates: Record<string, unknown> = {
      user_id: params.userId,
      email: normalizedEmail,
      updated_at: new Date().toISOString(),
    };

    if (fullName) {
      updates.full_name = fullName;
    }

    if (!existingByEmail.status) {
      updates.status = "approved";
    }

    const { data, error } = await supabase
      .from("action_track_guides")
      .update(updates)
      .eq("id", existingByEmail.id)
      .select("*")
      .single();

    if (error) {
      console.error("[upsertGuideForUser] Update by email failed", {
        guideId: existingByEmail.id,
        message: error.message,
        code: error.code,
      });
      throw new Error(error.message);
    }

    const guide = normalizeGuideProfile(data);
    if (!guide) {
      throw new Error("Guide profile could not be read after update.");
    }

    return guide;
  }

  const guideSlug = await generateUniqueGuideSlug(
    fullName || normalizedEmail.split("@")[0],
    "guide"
  );

  const { data, error } = await supabase
    .from("action_track_guides")
    .insert({
      user_id: params.userId,
      email: normalizedEmail,
      full_name: fullName || null,
      status: "approved",
      guide_slug: guideSlug,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[upsertGuideForUser] Insert failed", {
      message: error.message,
      code: error.code,
    });
    throw new Error(error.message);
  }

  const guide = normalizeGuideProfile(data);
  if (!guide) {
    throw new Error("Guide profile could not be read after creation.");
  }

  return guide;
}

export async function resolveGuideForUser(
  userId: string,
  email: string
): Promise<GuideProfile | null> {
  const byUserId = await getGuideByUserId(userId);
  if (byUserId) {
    return byUserId;
  }

  const byEmail = await getGuideByEmail(email);
  if (!byEmail) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("action_track_guides")
    .update({
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", byEmail.id)
    .select("*")
    .single();

  if (error) {
    console.error("[resolveGuideForUser] Link by email failed", {
      guideId: byEmail.id,
      userId,
      message: error.message,
      code: error.code,
    });
    return byEmail;
  }

  return normalizeGuideProfile(data);
}

export async function ensureGuideForUser(
  userId: string,
  email: string
): Promise<GuideProfile> {
  const existing = await resolveGuideForUser(userId, email);
  if (existing) {
    return existing;
  }

  return upsertGuideForUser({ userId, email });
}

export async function updateGuideProfile(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { getCurrentUser } = await import("@/lib/auth/guide");
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to update your profile." };
    }

    const guide = await getGuideByUserId(user.id);
    if (!guide) {
      return { error: "Guide profile not found." };
    }

    const supabase = createAdminClient();
    const guideSlugRaw = String(formData.get("guide_slug") ?? "").trim();
    const guideSlug = slugify(guideSlugRaw) || guide.guide_slug;

    if (guideSlug !== guide.guide_slug) {
      const { data: slugConflict } = await supabase
        .from("action_track_guides")
        .select("id")
        .eq("guide_slug", guideSlug)
        .neq("id", guide.id)
        .maybeSingle();

      if (slugConflict) {
        return { error: "That guide slug is already taken. Choose another." };
      }
    }

    const payload = {
      full_name: String(formData.get("full_name") ?? "").trim() || null,
      profile_headline:
        String(formData.get("profile_headline") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      profile_image_url:
        String(formData.get("profile_image_url") ?? "").trim() || null,
      website_url: String(formData.get("website_url") ?? "").trim() || null,
      social_url: String(formData.get("social_url") ?? "").trim() || null,
      public_email: String(formData.get("public_email") ?? "").trim() || null,
      guide_slug: guideSlug,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("action_track_guides")
      .update(payload)
      .eq("id", guide.id);

    if (error) {
      console.error("[updateGuideProfile] Supabase update failed", {
        guideId: guide.id,
        message: error.message,
        code: error.code,
        payloadKeys: Object.keys(payload),
      });
      return { error: "Failed to save profile. Please try again." };
    }

    revalidatePath("/guide/profile");
    revalidatePath("/guide/tracks");
    return { success: true };
  } catch (error) {
    console.error("[updateGuideProfile] Unexpected error", { error });
    const message =
      error instanceof SupabaseConfigError
        ? error.message
        : "Failed to save profile. Please try again.";
    return { error: message };
  }
}
