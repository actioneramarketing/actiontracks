"use client";

import { saveGuideProfileImage } from "@/lib/actions/guides";
import { getGuideInitials } from "@/lib/utils/guide-profile-image";
import { Button } from "@/components/ui/Button";
import { useRef, useState, useTransition } from "react";

interface ProfileImageUploadProps {
  fullName: string;
  email: string;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export function ProfileImageUpload({
  fullName,
  email,
  imageUrl,
  onImageUrlChange,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      const { uploadGuideProfileImage } = await import(
        "@/lib/utils/guide-profile-image"
      );
      const upload = await uploadGuideProfileImage(file);

      if (upload.error || !upload.publicUrl) {
        setError(upload.error ?? "Failed to upload image.");
        return;
      }

      const save = await saveGuideProfileImage(upload.publicUrl);
      if (save.error) {
        setError(save.error);
        return;
      }

      onImageUrlChange(upload.publicUrl);
      setMessage("Profile image updated.");
    });

    event.target.value = "";
  }

  const initials = getGuideInitials(fullName, email);

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-teal-100 shadow-md ring-2 ring-teal-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={fullName || "Guide profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-teal-700">{initials}</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? "Uploading..." : "Upload Profile Image"}
      </Button>

      <p className="mt-2 text-xs text-gray-500">
        JPEG, PNG, GIF, or WebP. Stored in your private guide folder.
      </p>

      {message && <p className="mt-2 text-sm text-teal-700">{message}</p>}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
