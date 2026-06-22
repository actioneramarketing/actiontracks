import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface HelpCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function HelpCard({ title, children, className }: HelpCardProps) {
  return (
    <Card
      padding="lg"
      className={cn(
        "bg-gradient-to-br from-teal-50/80 to-white border-teal-100/80 shadow-sm",
        className
      )}
    >
      <h2 className="text-sm font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">
        {children}
      </div>
    </Card>
  );
}
