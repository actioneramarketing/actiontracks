"use client";

import { updateGuideProfile } from "@/lib/actions/guides";
import { GuideProfile } from "@/lib/types/database";
import {
  SOCIAL_LINK_KEYS,
  SOCIAL_LINK_LABELS,
  GuideSocialLinks,
} from "@/lib/utils/guide-social-links";
import { normalizeOptionalUrl } from "@/lib/utils/guide-profile-urls";
import { resolveProfileImageUrl } from "@/lib/utils/guide-profile-image";
import { ProfileImageUpload } from "@/components/guide/ProfileImageUpload";
import { GuideProfilePreview } from "@/components/guide/GuideProfilePreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState, useTransition } from "react";

interface GuideProfileEditorProps {
  guide: GuideProfile;
}

export function GuideProfileEditor({ guide }: GuideProfileEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(guide.full_name);
  const [profileHeadline, setProfileHeadline] = useState(guide.profile_headline);
  const [bio, setBio] = useState(guide.bio);
  const [websiteUrl, setWebsiteUrl] = useState(guide.website_url);
  const [publicEmail, setPublicEmail] = useState(guide.public_email);
  const [guideSlug, setGuideSlug] = useState(guide.guide_slug);
  const [profileImageUrl, setProfileImageUrl] = useState(
    resolveProfileImageUrl(guide)
  );
  const [socialLinks, setSocialLinks] = useState<GuideSocialLinks>(
    guide.social_links
  );

  function updateSocialLink(key: keyof GuideSocialLinks, value: string) {
    setSocialLinks((current) => ({ ...current, [key]: value }));
  }

  function handleSave(formData: FormData) {
    setMessage(null);
    setError(null);

    formData.set("profile_image_url", profileImageUrl);

    startTransition(async () => {
      const result = await updateGuideProfile(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Profile saved.");
      setWebsiteUrl(normalizeOptionalUrl(String(formData.get("website_url") ?? "")));
      setSocialLinks({
        facebook: normalizeOptionalUrl(String(formData.get("social_facebook") ?? "")),
        instagram: normalizeOptionalUrl(String(formData.get("social_instagram") ?? "")),
        linkedin: normalizeOptionalUrl(String(formData.get("social_linkedin") ?? "")),
        youtube: normalizeOptionalUrl(String(formData.get("social_youtube") ?? "")),
        tiktok: normalizeOptionalUrl(String(formData.get("social_tiktok") ?? "")),
        x: normalizeOptionalUrl(String(formData.get("social_x") ?? "")),
        other: normalizeOptionalUrl(String(formData.get("social_other") ?? "")),
      });
    });
  }

  const previewWebsite = normalizeOptionalUrl(websiteUrl);
  const previewSocial: GuideSocialLinks = {
    facebook: normalizeOptionalUrl(socialLinks.facebook),
    instagram: normalizeOptionalUrl(socialLinks.instagram),
    linkedin: normalizeOptionalUrl(socialLinks.linkedin),
    youtube: normalizeOptionalUrl(socialLinks.youtube),
    tiktok: normalizeOptionalUrl(socialLinks.tiktok),
    x: normalizeOptionalUrl(socialLinks.x),
    other: normalizeOptionalUrl(socialLinks.other),
  };

  return (
    <form action={handleSave}>
      <input type="hidden" name="profile_image_url" value={profileImageUrl} />

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card padding="lg">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Profile Image
            </h2>
            <ProfileImageUpload
              fullName={fullName}
              email={guide.email}
              imageUrl={profileImageUrl}
              onImageUrlChange={setProfileImageUrl}
            />
          </Card>

          <GuideProfilePreview
            fullName={fullName}
            email={guide.email}
            profileHeadline={profileHeadline}
            bio={bio}
            websiteUrl={previewWebsite}
            imageUrl={profileImageUrl}
            socialLinks={previewSocial}
          />
        </div>

        <div className="space-y-6">
          <Card padding="lg">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Public Profile Details
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              This information appears on your public guide profile.
            </p>

            <div className="space-y-5">
              <FormField
                label="Account Email"
                name="account_email_display"
                value={guide.email}
                readOnly
                hint="Sign-in email (read-only)."
              />
              <FormField
                label="Full Name"
                name="full_name"
                value={fullName}
                onChange={setFullName}
              />
              <FormField
                label="Profile Headline"
                name="profile_headline"
                value={profileHeadline}
                onChange={setProfileHeadline}
              />
              <FormField
                label="Bio"
                name="bio"
                value={bio}
                onChange={setBio}
                textarea
              />
              <FormField
                label="Website URL"
                name="website_url"
                value={websiteUrl}
                onChange={setWebsiteUrl}
                hint="https:// is added automatically if omitted."
              />
              <FormField
                label="Public Email"
                name="public_email"
                value={publicEmail}
                onChange={setPublicEmail}
                type="email"
              />
              <FormField
                label="Guide Slug"
                name="guide_slug"
                value={guideSlug}
                onChange={setGuideSlug}
                hint="Lowercase letters, numbers, and hyphens only."
              />
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Social Links
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Optional links shown on your public profile. Leave blank to hide.
            </p>

            <div className="space-y-4">
              {SOCIAL_LINK_KEYS.map((key) => (
                <FormField
                  key={key}
                  label={SOCIAL_LINK_LABELS[key]}
                  name={`social_${key}`}
                  value={socialLinks[key]}
                  onChange={(value) => updateSocialLink(key, value)}
                  hint={
                    key === "other" && guide.social_url && !guide.social_links.other
                      ? "Migrated from your previous social URL."
                      : "https:// is added automatically if omitted."
                  }
                />
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Saving..." : "Save Profile"}
              </Button>
              <Button href="/guide/tracks" variant="secondary">
                Go to Guide Dashboard
              </Button>
              {message && (
                <span className="text-sm text-teal-700">{message}</span>
              )}
              {error && (
                <span className="text-sm text-red-600" role="alert">
                  {error}
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  textarea = false,
  readOnly = false,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  textarea?: boolean;
  readOnly?: boolean;
  hint?: string;
}) {
  const sharedClassName =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={readOnly ? undefined : name}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          rows={4}
          className={sharedClassName}
        />
      ) : (
        <input
          type={type}
          name={readOnly ? undefined : name}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          disabled={readOnly}
          className={sharedClassName}
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
