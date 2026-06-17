import { EditTrackPageClient } from "@/components/tracks/EditTrackPageClient";
import { getActionTrackById } from "@/lib/actions/tracks";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ trackId: string }>;
}

export default async function EditTrackPage({ params }: PageProps) {
  const { trackId } = await params;
  const { track, error } = await getActionTrackById(trackId);

  if (!track) {
    if (error) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Unable to load track
          </h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      );
    }
    notFound();
  }

  return <EditTrackPageClient track={track} trackId={trackId} />;
}
