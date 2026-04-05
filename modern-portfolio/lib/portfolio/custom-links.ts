export type ProjectCustomLink = {
  label: string;
  url: string;
};

export function parseCustomLinks(raw: unknown): ProjectCustomLink[] {
  if (!raw || !Array.isArray(raw)) return [];
  const out: ProjectCustomLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const label = typeof o.label === "string" ? o.label.trim() : "";
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!label || !url) continue;
    out.push({ label, url });
  }
  return out;
}
