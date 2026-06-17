export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, suffix: string): string {
  const slugBase = slugify(base) || "action-track";
  return `${slugBase}-${suffix}`;
}
