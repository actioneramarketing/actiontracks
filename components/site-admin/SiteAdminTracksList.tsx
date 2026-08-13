"use client";

import { SiteAdminTrackCard } from "@/components/site-admin/SiteAdminTrackCard";
import { EmptyState } from "@/components/builder/EmptyState";
import type { SiteAdminTrackView } from "@/lib/actions/site-admin-tracks";
import { useMemo, useState } from "react";

type StatusFilter = "all" | "active" | "draft" | "archived";

interface SiteAdminTracksListProps {
  tracks: SiteAdminTrackView[];
}

export function SiteAdminTracksList({ tracks }: SiteAdminTracksListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return tracks.filter((track) => {
      if (status !== "all" && track.status !== status) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        track.title.toLowerCase().includes(needle) ||
        track.slug.toLowerCase().includes(needle) ||
        track.guideName.toLowerCase().includes(needle)
      );
    });
  }, [tracks, query, status]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, slug, or guide"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          className="sm:w-44 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="No matching Action Tracks"
          description="Try a different search or status filter."
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((track) => (
            <SiteAdminTrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}
