const PROFILE_IMAGE_BUCKET = "guide-profile-images";

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-") || "image";
}

export function getGuideInitials(fullName: string, email: string): string {
  const fromName = fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (fromName) {
    return fromName;
  }

  return email.slice(0, 2).toUpperCase() || "G";
}

export function resolveProfileImageUrl(guide: {
  profile_image_url: string;
  avatar_url: string;
}): string {
  return guide.profile_image_url || guide.avatar_url || "";
}

export async function uploadGuideProfileImage(
  file: File
): Promise<{ publicUrl?: string; error?: string }> {
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();

  if (!supabase) {
    return { error: "Storage is not configured." };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Please choose an image file (JPEG, PNG, GIF, or WebP)." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to upload a profile image." };
  }

  const path = `${user.id}/profile-image-${Date.now()}-${safeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadGuideProfileImage] Storage upload failed", {
      message: uploadError.message,
    });
    return { error: "Failed to upload image. Please try again." };
  }

  const { data } = supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .getPublicUrl(path);

  if (!data.publicUrl) {
    return { error: "Upload succeeded but the public URL could not be resolved." };
  }

  return { publicUrl: data.publicUrl };
}
