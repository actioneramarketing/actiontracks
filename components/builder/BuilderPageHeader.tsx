import { cn } from "@/lib/utils";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { getTrackInitials } from "@/lib/utils/action-track-assets";

interface BuilderPageHeaderProps {
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  status?: "active" | "draft" | "archived";
  trackIconUrl?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function BuilderPageHeader({
  backHref,
  backLabel = "Back",
  title,
  subtitle,
  status,
  trackIconUrl,
  actions,
  className,
}: BuilderPageHeaderProps) {
  const initials = getTrackInitials(title);

  return (
    <div className={cn("mb-8", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="text-sm text-gray-500 hover:text-teal-700 transition-colors"
        >
          ← {backLabel}
        </Link>
      ) : null}

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {trackIconUrl ? (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-teal-50 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trackIconUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-sm font-bold text-teal-700">
                {initials}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {status ? <StatusBadge status={status} /> : null}
          </div>
          {subtitle ? (
            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
