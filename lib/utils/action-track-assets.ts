const ACTION_TRACK_ASSETS_BUCKET = "action-tracks-assets";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export type ActionTrackAssetKind = "track-image" | "track-icon";

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-") || "image";
}

export function getTrackInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1 && words[0].length > 0) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return "AT";
}

function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file (JPEG, PNG, GIF, or WebP).";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

export async function uploadActionTrackAsset(
  file: File,
  options: { trackId: string; kind: ActionTrackAssetKind }
): Promise<{ publicUrl?: string; error?: string }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();

  if (!supabase) {
    return { error: "Storage is not configured." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "You must be logged in to upload track assets." };
  }

  const folderTrackId = options.trackId.trim() || "new";
  const path = `${user.id}/${folderTrackId}/${options.kind}-${Date.now()}-${safeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(ACTION_TRACK_ASSETS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadActionTrackAsset] Storage upload failed", {
      kind: options.kind,
      message: uploadError.message,
    });
    return { error: "Failed to upload image. Please try again." };
  }

  const { data } = supabase.storage
    .from(ACTION_TRACK_ASSETS_BUCKET)
    .getPublicUrl(path);

  if (!data.publicUrl) {
    return { error: "Upload succeeded but the public URL could not be resolved." };
  }

  return { publicUrl: data.publicUrl };
}
