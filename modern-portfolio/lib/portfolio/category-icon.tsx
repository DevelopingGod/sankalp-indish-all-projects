import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Brain,
  Cloud,
  Code2,
  Database,
  Globe,
  LayoutGrid,
  LineChart,
  Server,
} from "lucide-react";

const slugDefaults: Record<string, LucideIcon> = {
  ai: Brain,
  "artificial-intelligence": Brain,
  software: LineChart,
  cloud: Cloud,
  fullstack: Globe,
  data: Database,
};

const keyMap: Record<string, LucideIcon> = {
  brain: Brain,
  "fa-brain": Brain,
  "chart-line": LineChart,
  "fa-chart-line": LineChart,
  cloud: Cloud,
  "fa-cloud": Cloud,
  globe: Globe,
  "fa-globe": Globe,
  code: Code2,
  code2: Code2,
  database: Database,
  barchart: BarChart3,
  barchart3: BarChart3,
  server: Server,
  layoutgrid: LayoutGrid,
};

function normalizeKey(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^fa-/, "")
    .replace(/_/g, "-");
}

export function getCategoryIcon(
  slug: string,
  iconField: string | null | undefined,
): LucideIcon {
  const fromSlug = slugDefaults[slug.toLowerCase()];
  if (fromSlug) return fromSlug;

  if (iconField) {
    const k = normalizeKey(iconField);
    if (keyMap[k]) return keyMap[k];
    const pascal = iconField
      .replace(/[-_](\w)/g, (_, c: string) => c.toUpperCase())
      .replace(/^(\w)/, (c) => c.toUpperCase());
    const dynamic = (
      {
        Brain,
        Cloud,
        Globe,
        LineChart,
        Code2,
        Database,
        BarChart3,
        Server,
        LayoutGrid,
      } as Record<string, LucideIcon>
    )[pascal];
    if (dynamic) return dynamic;
  }

  return LayoutGrid;
}
