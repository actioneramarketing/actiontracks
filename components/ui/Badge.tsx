import { cn } from "@/lib/utils";
import { TrackStatus } from "@/lib/demo-data";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info" | "purple";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  info: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  purple: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusBadgeVariant(status: TrackStatus): BadgeProps["variant"] {
  switch (status) {
    case "active":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "default";
    default:
      return "default";
  }
}

export function StatusBadge({ status }: { status: TrackStatus }) {
  const labels: Record<TrackStatus, string> = {
    active: "Active",
    draft: "Draft",
    archived: "Archived",
  };

  return (
    <Badge variant={statusBadgeVariant(status)}>{labels[status]}</Badge>
  );
}
