"use client";

import { cn } from "@/lib/utils";

export const shadowSoft = "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]";

export type CollapsibleCardId =
  | "todo"
  | "partner"
  | "ai"
  | "journal"
  | "content"
  | "resources";

export type FeedFilter = "stage1" | "all" | "general";

export type ModalId = "ai-mentor" | "journal";

export interface StageDashboardUIHandlers {
  expandedCards: Record<CollapsibleCardId, boolean>;
  toggleCard: (id: CollapsibleCardId) => void;
  activeModal: ModalId | null;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  feedFilter: FeedFilter;
  setFeedFilter: (filter: FeedFilter) => void;
  openComments: Record<string, boolean>;
  toggleComments: (postId: string) => void;
}

export function CollapsiblePanel({
  expanded,
  children,
  className,
}: {
  expanded: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-[max-height] duration-500 ease-in-out",
        expanded ? "max-h-[2000px]" : "max-h-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardToggle({
  expanded,
  onClick,
}: {
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-slate-400 hover:text-slate-600 transition-transform"
      aria-expanded={expanded}
    >
      <i
        className={cn(
          "fa-solid fa-chevron-down transition-transform duration-300",
          expanded && "rotate-180"
        )}
      />
    </button>
  );
}
