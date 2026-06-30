"use client";

import { GuideProfile } from "@/lib/types/database";
import {
  getActiveSocialLinks,
  normalizeSocialLinks,
} from "@/lib/utils/guide-social-links";
import {
  getGuideInitials,
  resolveProfileImageUrl,
} from "@/lib/utils/guide-profile-image";
import { normalizeOptionalUrl } from "@/lib/utils/guide-profile-urls";

interface GuideProfileModalProps {
  guide: GuideProfile | null;
  onClose: () => void;
}

export function GuideProfileModal({ guide, onClose }: GuideProfileModalProps) {
  if (!guide) {
    return (
      <div
        className="stage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Guide Profile</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500">Guide profile coming soon.</p>
          </div>
        </div>
      </div>
    );
  }

  const guideImage = resolveProfileImageUrl(guide);
  const guideName = guide.full_name?.trim() || "Your Guide";
  const guideHeadline = guide.profile_headline?.trim() || "Your Track Guide";
  const bio = guide.bio?.trim();
  const websiteUrl = normalizeOptionalUrl(guide.website_url);
  const publicEmail = guide.public_email?.trim() || "";
  const socialLinks = getActiveSocialLinks(
    normalizeSocialLinks(guide.social_links, guide.social_url)
  );
  const hasConnectSection = Boolean(
    websiteUrl || publicEmail || socialLinks.length > 0
  );
  const initials = getGuideInitials(guide.full_name, guide.email);

  return (
    <div
      className="stage-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="stage-modal-content bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-profile-modal-title"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-4">
          <h3 id="guide-profile-modal-title" className="text-xl font-bold text-slate-800">
            Guide Profile
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none shrink-0"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              {guideImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={guideImage}
                  alt={guideName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-teal-100 border-4 border-white shadow-md flex items-center justify-center text-teal-700 font-bold text-2xl">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="min-w-0">
              <h4 className="text-2xl font-bold text-slate-800">{guideName}</h4>
              <p className="text-sm font-semibold text-[#14b8a6] uppercase tracking-wider mt-1">
                {guideHeadline}
              </p>
            </div>
          </div>

          <section>
            <h5 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              About
            </h5>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {bio || "This guide has not added a full bio yet."}
              </p>
            </div>
          </section>

          <section>
            <h5 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Connect
            </h5>
            {!hasConnectSection ? (
              <p className="text-sm text-slate-500">
                No public contact links added yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {websiteUrl ? (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-sm"
                  >
                    <i className="fa-solid fa-globe" />
                    Visit Website
                  </a>
                ) : null}
                {publicEmail ? (
                  <a
                    href={`mailto:${publicEmail}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm"
                  >
                    <i className="fa-regular fa-envelope" />
                    {publicEmail}
                  </a>
                ) : null}
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={normalizeOptionalUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm"
                  >
                    <i className="fa-solid fa-link text-xs text-teal-600" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
