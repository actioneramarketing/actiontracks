"use client";

import { useCallback, useEffect, useState } from "react";
import { StageDashboardActions } from "./StageDashboardActions";
import { StageDashboardFeed } from "./StageDashboardFeed";
import { StageDashboardHeader } from "./StageDashboardHeader";
import { StageDashboardModals } from "./StageDashboardModals";
import { StageDashboardSidebar } from "./StageDashboardSidebar";
import type {
  CollapsibleCardId,
  FeedFilter,
  ModalId,
  StageDashboardUIHandlers,
} from "./shared";
import "./stage-dashboard-preview.css";

const INITIAL_EXPANDED: Record<CollapsibleCardId, boolean> = {
  todo: true,
  partner: false,
  ai: false,
  journal: false,
  content: false,
  resources: false,
};

export function StageDashboardPreview() {
  const [expandedCards, setExpandedCards] =
    useState<Record<CollapsibleCardId, boolean>>(INITIAL_EXPANDED);
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("stage1");
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  const toggleCard = useCallback((id: CollapsibleCardId) => {
    setExpandedCards((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const openModal = useCallback((id: ModalId) => {
    setActiveModal(id);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const toggleComments = useCallback((postId: string) => {
    setOpenComments((current) => ({ ...current, [postId]: !current[postId] }));
  }, []);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [activeModal]);

  const handlers: StageDashboardUIHandlers = {
    expandedCards,
    toggleCard,
    activeModal,
    openModal,
    closeModal,
    feedFilter,
    setFeedFilter,
    openComments,
    toggleComments,
  };

  return (
    <div className="stage-dashboard-preview w-full text-slate-800 overflow-x-hidden bg-[#f1f5f9] font-[family-name:var(--font-inter,'Inter',ui-sans-serif,system-ui,sans-serif)]">
      <div className="p-4 sm:p-8 w-full max-w-6xl mx-auto space-y-8">
        <StageDashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StageDashboardActions handlers={handlers} />
            <StageDashboardFeed handlers={handlers} />
          </div>
          <StageDashboardSidebar handlers={handlers} />
        </div>
      </div>

      <StageDashboardModals handlers={handlers} />
    </div>
  );
}
