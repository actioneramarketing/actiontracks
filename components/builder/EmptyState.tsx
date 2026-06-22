import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon = "📋",
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card
      padding="lg"
      className="text-center bg-gradient-to-br from-gray-50 to-white border-dashed border-gray-200 shadow-sm"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Button href={actionHref} variant="primary" className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
