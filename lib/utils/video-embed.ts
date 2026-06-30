const VIDEO_RESOURCE_TYPES = new Set([
  "video",
  "youtube",
  "vimeo",
  "loom",
  "embed",
]);

const VIDEO_HOST_PATTERNS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "loom.com",
];

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^www\./, "").toLowerCase();
}

export function isVideoLikeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const host = normalizeHostname(parsed.hostname);
    return VIDEO_HOST_PATTERNS.some(
      (pattern) => host === pattern || host.endsWith(`.${pattern}`)
    );
  } catch {
    return false;
  }
}

export function isVideoResourceType(type: string): boolean {
  return VIDEO_RESOURCE_TYPES.has(type.trim().toLowerCase());
}

export function isVideoResource(resource: {
  type: string;
  url: string;
}): boolean {
  if (isVideoResourceType(resource.type)) {
    return true;
  }
  return isVideoLikeUrl(resource.url);
}

function getYouTubeEmbedUrl(url: URL): string | null {
  const host = normalizeHostname(url.hostname);

  if (host === "youtu.be") {
    const videoId = url.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname.startsWith("/embed/")) {
      return url.toString();
    }

    if (url.pathname === "/watch") {
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    const shortsMatch = url.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }
  }

  return null;
}

function getVimeoEmbedUrl(url: URL): string | null {
  const host = normalizeHostname(url.hostname);

  if (host === "player.vimeo.com") {
    return url.toString();
  }

  if (host === "vimeo.com") {
    const videoId = url.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  return null;
}

function getLoomEmbedUrl(url: URL): string | null {
  const host = normalizeHostname(url.hostname);
  if (!host.includes("loom.com")) {
    return null;
  }

  if (url.pathname.includes("/embed/")) {
    return url.toString();
  }

  const shareMatch = url.pathname.match(/\/share\/([^/?]+)/);
  if (shareMatch?.[1]) {
    return `https://www.loom.com/embed/${shareMatch[1]}`;
  }

  return null;
}

export function getVideoEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    return (
      getYouTubeEmbedUrl(parsed) ??
      getVimeoEmbedUrl(parsed) ??
      getLoomEmbedUrl(parsed)
    );
  } catch {
    return null;
  }
}

export function canEmbedVideoResource(resource: {
  type: string;
  url: string;
}): boolean {
  if (!resource.url.trim()) {
    return false;
  }
  if (!isVideoResource(resource)) {
    return false;
  }
  return Boolean(getVideoEmbedUrl(resource.url));
}
