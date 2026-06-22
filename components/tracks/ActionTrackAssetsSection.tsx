"use client";

import { uploadActionTrackAsset } from "@/lib/utils/action-track-assets";
import { Button } from "@/components/ui/Button";
import { useRef, useState, useTransition } from "react";

interface ActionTrackAssetsSectionProps {
  trackId?: string;
  trackImageUrl?: string;
  trackIconUrl?: string;
}

export function ActionTrackAssetsSection({
  trackId = "new",
  trackImageUrl = "",
  trackIconUrl = "",
}: ActionTrackAssetsSectionProps) {
  const trackImageInputRef = useRef<HTMLInputElement>(null);
  const trackIconInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(trackImageUrl);
  const [iconUrl, setIconUrl] = useState(trackIconUrl);
  const [imageError, setImageError] = useState<string | null>(null);
  const [iconError, setIconError] = useState<string | null>(null);
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const [iconMessage, setIconMessage] = useState<string | null>(null);
  const [isImagePending, startImageTransition] = useTransition();
  const [isIconPending, startIconTransition] = useTransition();

  function handleTrackImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setImageError(null);
    setImageMessage(null);

    startImageTransition(async () => {
      const result = await uploadActionTrackAsset(file, {
        trackId,
        kind: "track-image",
      });

      if (result.error || !result.publicUrl) {
        setImageError(result.error ?? "Failed to upload track image.");
        return;
      }

      setImageUrl(result.publicUrl);
      setImageMessage("Track image uploaded. Save the form to keep this change.");
    });
  }

  function handleTrackIconChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setIconError(null);
    setIconMessage(null);

    startIconTransition(async () => {
      const result = await uploadActionTrackAsset(file, {
        trackId,
        kind: "track-icon",
      });

      if (result.error || !result.publicUrl) {
        setIconError(result.error ?? "Failed to upload track icon.");
        return;
      }

      setIconUrl(result.publicUrl);
      setIconMessage("Track icon uploaded. Save the form to keep this change.");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <input type="hidden" name="track_image_url" value={imageUrl} />
      <input type="hidden" name="track_icon_url" value={iconUrl} />

      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">Action Track Image</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Recommended size: 16:9 image. This will be used on library cards, guide
          dashboards, and future track pages.
        </p>

        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-teal-50 via-gray-50 to-violet-50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Action Track preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-2xl mb-1 opacity-80" aria-hidden>
                🖼
              </span>
              <p className="text-xs font-medium text-gray-500">No track image yet</p>
            </div>
          )}
        </div>

        <input
          ref={trackImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleTrackImageChange}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isImagePending}
          onClick={() => trackImageInputRef.current?.click()}
        >
          {isImagePending
            ? "Uploading..."
            : imageUrl
              ? "Replace Track Image"
              : "Upload Track Image"}
        </Button>
        <p className="mt-2 text-xs text-gray-500">JPEG, PNG, GIF, or WebP. Max 5 MB.</p>
        {imageMessage ? (
          <p className="mt-2 text-sm text-teal-700">{imageMessage}</p>
        ) : null}
        {imageError ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {imageError}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
        <p className="text-sm font-medium text-gray-900 mb-1">Action Track Icon</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Upload a square icon or simple brand mark for this Action Track.
        </p>

        <div className="mb-4 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconUrl}
                alt="Action Track icon"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl opacity-70" aria-hidden>
                ✦
              </span>
            )}
          </div>
        </div>

        <input
          ref={trackIconInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleTrackIconChange}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isIconPending}
          onClick={() => trackIconInputRef.current?.click()}
        >
          {isIconPending
            ? "Uploading..."
            : iconUrl
              ? "Replace Track Icon"
              : "Upload Track Icon"}
        </Button>
        <p className="mt-2 text-xs text-gray-500">Square images work best. Max 5 MB.</p>
        {iconMessage ? (
          <p className="mt-2 text-sm text-teal-700">{iconMessage}</p>
        ) : null}
        {iconError ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {iconError}
          </p>
        ) : null}
      </div>
    </div>
  );
}
