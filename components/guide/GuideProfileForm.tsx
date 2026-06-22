"use client";

import { updateGuideProfile } from "@/lib/actions/guides";
import { GuideProfile } from "@/lib/types/database";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState, useTransition } from "react";

interface GuideProfileFormProps {
  guide: GuideProfile;
}

export function GuideProfileForm({ guide }: GuideProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSave(formData: FormData) {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await updateGuideProfile(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Profile saved.");
    });
  }

  return (
    <Card padding="lg" className="max-w-2xl">
      <form action={handleSave} className="space-y-5">
        <FormField
          label="Full Name"
          name="full_name"
          defaultValue={guide.full_name}
        />
        <FormField
          label="Profile Headline"
          name="profile_headline"
          defaultValue={guide.profile_headline}
        />
        <FormField
          label="Bio"
          name="bio"
          defaultValue={guide.bio}
          textarea
        />
        <FormField
          label="Profile Image URL"
          name="profile_image_url"
          defaultValue={guide.profile_image_url}
        />
        <FormField
          label="Website URL"
          name="website_url"
          defaultValue={guide.website_url}
        />
        <FormField
          label="Social URL"
          name="social_url"
          defaultValue={guide.social_url}
        />
        <FormField
          label="Public Email"
          name="public_email"
          defaultValue={guide.public_email}
          type="email"
        />
        <FormField
          label="Guide Slug"
          name="guide_slug"
          defaultValue={guide.guide_slug}
          hint="Used in public guide profile URLs."
        />

        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Saving..." : "Save Profile"}
          </Button>
          <Button href="/guide/tracks" variant="secondary">
            Go to Guide Dashboard
          </Button>
          {message && <span className="text-sm text-teal-700">{message}</span>}
          {error && (
            <span className="text-sm text-red-600" role="alert">
              {error}
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  type = "text",
  textarea = false,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={4}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
