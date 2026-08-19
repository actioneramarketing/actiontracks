import Link from "next/link";
import { cn } from "@/lib/utils";

interface SiteAdminSubnavProps {
  current: "tracks" | "members";
}

const links = [
  { id: "tracks" as const, href: "/site-admin/action-tracks", label: "Action Tracks" },
  { id: "members" as const, href: "/site-admin/members", label: "Members" },
];

export function SiteAdminSubnav({ current }: SiteAdminSubnavProps) {
  return (
    <nav
      aria-label="Site admin"
      className="mb-6 flex flex-wrap gap-1 border-b border-gray-200"
    >
      {links.map((link) => {
        const isCurrent = link.id === current;
        return (
          <Link
            key={link.id}
            href={link.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              isCurrent
                ? "border-teal-600 text-teal-800"
                : "border-transparent text-gray-500 hover:text-teal-700"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
