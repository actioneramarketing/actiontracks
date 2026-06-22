import { cn } from "@/lib/utils";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";

interface BuilderPageHeaderProps {
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  status?: "active" | "draft" | "archived";
  actions?: React.ReactNode;
  className?: string;
}

export function BuilderPageHeader({
  backHref,
  backLabel = "Back",
  title,
  subtitle,
  status,
  actions,
  className,
}: BuilderPageHeaderProps) {
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
