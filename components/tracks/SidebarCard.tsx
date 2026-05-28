import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SidebarCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
}

export function SidebarCard({
  title,
  children,
  className,
  icon,
}: SidebarCardProps) {
  return (
    <Card padding="sm" className={cn("", className)}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-base">{icon}</span>}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="text-sm text-gray-600">{children}</div>
    </Card>
  );
}
