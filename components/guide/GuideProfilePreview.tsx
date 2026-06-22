"use client";

import {
  getActiveSocialLinks,
  GuideSocialLinks,
} from "@/lib/utils/guide-social-links";
import { getGuideInitials } from "@/lib/utils/guide-profile-image";
import { Card } from "@/components/ui/Card";

interface GuideProfilePreviewProps {
  fullName: string;
  email: string;
  profileHeadline: string;
  bio: string;
  websiteUrl: string;
  imageUrl: string;
  socialLinks: GuideSocialLinks;
}

export function GuideProfilePreview({
  fullName,
  email,
  profileHeadline,
  bio,
  websiteUrl,
  imageUrl,
  socialLinks,
}: GuideProfilePreviewProps) {
  const displayName = fullName.trim() || "Your Name";
  const headline = profileHeadline.trim() || "Your profile headline";
  const bioPreview = bio.trim() || "Your bio will appear here.";
  const activeSocial = getActiveSocialLinks(socialLinks);
  const initials = getGuideInitials(fullName, email);

  return (
    <Card padding="lg" className="bg-gradient-to-br from-gray-50 to-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-4">
        Preview
      </p>

      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 ring-2 ring-teal-50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-teal-700">{initials}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {displayName}
          </h3>
          <p className="text-sm text-teal-700 mt-0.5">{headline}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600 line-clamp-4 leading-relaxed">
        {bioPreview}
      </p>

      {websiteUrl.trim() ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline truncate max-w-full"
        >
          {websiteUrl.replace(/^https?:\/\//, "")}
        </a>
      ) : null}

      {activeSocial.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeSocial.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 hover:ring-teal-200 hover:text-teal-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
