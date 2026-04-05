export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  /** Legacy; prefer `custom_links` */
  primary_link_url?: string | null;
  primary_link_label?: string | null;
  custom_links?: unknown;
  repo_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PublicPortfolioData = {
  categories: Category[];
  projects: Project[];
  error: string | null;
};
