import { asString } from "@/lib/utils/element-settings";

export interface StageResourceItem {
  title: string;
  type: string;
  url: string;
  description: string;
  fileName: string;
  fileSize: string;
  buttonText: string;
}

function normalizeResourceItem(raw: unknown): StageResourceItem | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const resource = raw as Record<string, unknown>;
  const title = asString(resource.title).trim();
  const url = asString(resource.url).trim();

  if (!title && !url) {
    return null;
  }

  return {
    title: title || "Resource",
    type: asString(resource.type, "link").trim() || "link",
    url,
    description: asString(resource.description),
    fileName: asString(resource.file_name),
    fileSize: asString(resource.file_size),
    buttonText: asString(resource.button_text),
  };
}

export function parseStageResources(
  settings: Record<string, unknown> | null | undefined
): StageResourceItem[] {
  const data = settings ?? {};
  const items: StageResourceItem[] = [];

  if (Array.isArray(data.resources)) {
    for (const raw of data.resources) {
      const item = normalizeResourceItem(raw);
      if (item) {
        items.push(item);
      }
    }
  }

  if (items.length === 0 && data.resource) {
    const legacy = normalizeResourceItem(data.resource);
    if (legacy) {
      items.push(legacy);
    }
  }

  return items;
}

export function formatResourceCountLabel(count: number): string {
  if (count === 0) {
    return "No resources yet";
  }
  return count === 1 ? "1 resource" : `${count} resources`;
}

export function formatResourceSubtitle(resource: StageResourceItem): string {
  if (resource.description.trim()) {
    return resource.description.trim();
  }

  const typeLabel = resource.type.replace(/_/g, " ");
  const parts = [typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)];

  if (resource.fileSize.trim()) {
    parts.push(resource.fileSize.trim());
  } else if (resource.fileName.trim()) {
    parts.push(resource.fileName.trim());
  }

  return parts.join(" · ");
}

export function resourceActionIcon(type: string, hasUrl: boolean): string {
  if (!hasUrl) {
    return "fa-link";
  }

  switch (type.toLowerCase()) {
    case "video":
    case "youtube":
    case "vimeo":
    case "loom":
    case "embed":
      return "fa-play";
    case "link":
    case "url":
    case "website":
    case "external_tool":
      return "fa-arrow-up-right-from-square";
    default:
      return "fa-download";
  }
}
