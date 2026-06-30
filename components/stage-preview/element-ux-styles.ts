import { StageElementType } from "@/lib/types/database";

export interface ElementUxStyle {
  border: string;
  iconBg: string;
  iconText: string;
  iconClass: string;
}

export const ELEMENT_UX_STYLES: Record<StageElementType, ElementUxStyle> = {
  live_call: {
    border: "border-purple-500",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    iconClass: "fa-video",
  },
  commitment_builder: {
    border: "border-emerald-500",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    iconClass: "fa-handshake",
  },
  task_list: {
    border: "border-teal-500",
    iconBg: "bg-teal-100",
    iconText: "text-teal-600",
    iconClass: "fa-list-check",
  },
  ai_mentor: {
    border: "border-indigo-500",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    iconClass: "fa-robot",
  },
  reflection_journal: {
    border: "border-pink-500",
    iconBg: "bg-pink-100",
    iconText: "text-pink-600",
    iconClass: "fa-book",
  },
  resources: {
    border: "border-amber-500",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    iconClass: "fa-folder-open",
  },
  track_feed: {
    border: "border-slate-400",
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    iconClass: "fa-comments",
  },
  completion_submission: {
    border: "border-violet-500",
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
    iconClass: "fa-paper-plane",
  },
  reward_activation: {
    border: "border-yellow-500",
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-700",
    iconClass: "fa-trophy",
  },
};

export const DEFAULT_ELEMENT_UX_STYLE: ElementUxStyle = {
  border: "border-slate-400",
  iconBg: "bg-slate-100",
  iconText: "text-slate-600",
  iconClass: "fa-puzzle-piece",
};

export function priorityBadgeClass(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export function priorityIconClass(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "fa-circle-exclamation";
    case "low":
      return "fa-circle";
    default:
      return "fa-circle-half-stroke";
  }
}

export function resourceIconClass(type: string): string {
  switch (type.toLowerCase()) {
    case "pdf":
      return "fa-regular fa-file-pdf text-red-500";
    case "doc":
    case "docx":
    case "word":
    case "document":
      return "fa-regular fa-file-word text-blue-500";
    case "video":
    case "youtube":
    case "vimeo":
    case "loom":
    case "embed":
      return "fa-solid fa-play text-red-500";
    case "audio":
      return "fa-solid fa-volume-high text-purple-500";
    case "image":
      return "fa-regular fa-image text-indigo-500";
    case "link":
    case "url":
    case "website":
    case "external_tool":
      return "fa-solid fa-link text-[#14b8a6]";
    case "worksheet":
    case "template":
      return "fa-regular fa-file-lines text-blue-500";
    default:
      return "fa-regular fa-file text-slate-500";
  }
}
