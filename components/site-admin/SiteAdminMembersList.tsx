"use client";

import { EnrollmentStatusActions } from "@/components/site-admin/EnrollmentStatusActions";
import { EmptyState } from "@/components/builder/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { SiteAdminMemberView } from "@/lib/actions/site-admin-members";
import { useMemo, useState } from "react";

type StatusFilter = "all" | "active" | "paused" | "revoked" | "completed";

interface SiteAdminMembersListProps {
  members: SiteAdminMemberView[];
}

function formatDateTime(value: string): string {
  if (!value.trim()) {
    return "—";
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return new Date(parsed).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(value: string): string {
  if (!value.trim()) {
    return "—";
  }
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    return new Date(`${match[1]}T12:00:00`).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return new Date(parsed).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadgeVariant(
  status: string
): "success" | "warning" | "danger" | "info" | "default" {
  switch (status.trim().toLowerCase()) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "revoked":
      return "danger";
    case "completed":
      return "info";
    default:
      return "default";
  }
}

function formatStatus(status: string): string {
  const normalized = status.trim() || "active";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function SiteAdminMembersList({ members }: SiteAdminMembersListProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [trackId, setTrackId] = useState("all");

  const tracks = useMemo(() => {
    const byId = new Map<string, string>();
    for (const member of members) {
      if (member.trackId && !byId.has(member.trackId)) {
        byId.set(member.trackId, member.trackTitle);
      }
    }
    return [...byId.entries()]
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [members]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      if (status !== "all" && member.status.trim().toLowerCase() !== status) {
        return false;
      }
      if (trackId !== "all" && member.trackId !== trackId) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        member.participantName.toLowerCase().includes(needle) ||
        member.participantEmail.toLowerCase().includes(needle) ||
        member.trackTitle.toLowerCase().includes(needle) ||
        member.trackSlug.toLowerCase().includes(needle)
      );
    });
  }, [members, query, status, trackId]);

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, or track"
          className="sm:col-span-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="revoked">Revoked</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={trackId}
          onChange={(event) => setTrackId(event.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="all">All Action Tracks</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="No matching members"
          description="Try a different search, status, or Action Track filter."
        />
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Action Track</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((member) => (
                  <tr key={member.enrollmentId} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">
                        {member.participantName}
                      </p>
                      {member.participantEmail ? (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {member.participantEmail}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{member.trackTitle}</p>
                      {member.trackSlug ? (
                        <p className="mt-0.5 font-mono text-xs text-gray-500">
                          {member.trackSlug}
                        </p>
                      ) : null}
                      {member.guideName ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Guide: {member.guideName}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusBadgeVariant(member.status)}>
                        {formatStatus(member.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 space-y-1">
                      <p>Enrolled {formatDateTime(member.enrolledAt)}</p>
                      <p>Starts {formatDate(member.accessStartsAt)}</p>
                      <p>Ends {formatDate(member.accessEndsAt)}</p>
                      <p>Updated {formatDateTime(member.updatedAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <EnrollmentStatusActions
                        enrollmentId={member.enrollmentId}
                        status={member.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filtered.map((member) => (
              <Card key={member.enrollmentId} padding="md" className="shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {member.participantName}
                    </p>
                    {member.participantEmail ? (
                      <p className="mt-0.5 text-sm text-gray-500 truncate">
                        {member.participantEmail}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant={statusBadgeVariant(member.status)}>
                    {formatStatus(member.status)}
                  </Badge>
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  <p className="font-medium">{member.trackTitle}</p>
                  {member.trackSlug ? (
                    <p className="font-mono text-xs text-gray-500">{member.trackSlug}</p>
                  ) : null}
                  {member.guideName ? (
                    <p className="mt-1 text-xs text-gray-500">
                      Guide: {member.guideName}
                    </p>
                  ) : null}
                </div>
                <dl className="mt-3 space-y-1 text-xs text-gray-500">
                  <div>Enrolled {formatDateTime(member.enrolledAt)}</div>
                  <div>Starts {formatDate(member.accessStartsAt)}</div>
                  <div>Ends {formatDate(member.accessEndsAt)}</div>
                  <div>Updated {formatDateTime(member.updatedAt)}</div>
                </dl>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <EnrollmentStatusActions
                    enrollmentId={member.enrollmentId}
                    status={member.status}
                  />
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
