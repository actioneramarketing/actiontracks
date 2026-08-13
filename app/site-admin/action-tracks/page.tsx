import { PageContainer } from "@/components/layout/PageContainer";
import { BuilderPageHeader } from "@/components/builder/BuilderPageHeader";
import { EmptyState } from "@/components/builder/EmptyState";
import {
  SiteAdminAccessDeniedCard,
  SiteAdminLoginRequiredCard,
} from "@/components/auth/SiteAdminAccessCards";
import { SiteAdminTracksList } from "@/components/site-admin/SiteAdminTracksList";
import { getActionTracksForSiteAdmin } from "@/lib/actions/site-admin-tracks";
import { getSiteAdminAccess } from "@/lib/auth/site-admin";

export default async function SiteAdminActionTracksPage() {
  const access = await getSiteAdminAccess();

  if (access.status === "unauthenticated") {
    return <SiteAdminLoginRequiredCard />;
  }

  if (access.status === "denied") {
    return <SiteAdminAccessDeniedCard />;
  }

  const { tracks, error } = await getActionTracksForSiteAdmin();

  return (
    <PageContainer className="max-w-6xl">
      <BuilderPageHeader
        title="Action Tracks Admin"
        subtitle="View and copy join links for Action Tracks across all guides."
      />

      {error ? (
        <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          Some track details could not be loaded. Join links below may still be
          usable.
        </p>
      ) : null}

      {tracks.length === 0 && !error ? (
        <EmptyState
          icon="🎯"
          title="No Action Tracks yet"
          description="When guides create Action Tracks, their join and preview links will appear here."
        />
      ) : tracks.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Unable to load Action Tracks"
          description="Please try again in a moment."
        />
      ) : (
        <SiteAdminTracksList tracks={tracks} />
      )}
    </PageContainer>
  );
}
