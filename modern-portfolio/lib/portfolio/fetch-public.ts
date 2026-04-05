import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Project, PublicPortfolioData } from "@/lib/types/portfolio";

export async function fetchPublicPortfolio(): Promise<PublicPortfolioData> {
  const supabase = await createSupabaseServerClient();

  const [categoriesRes, projectsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const err =
    categoriesRes.error?.message ??
    projectsRes.error?.message ??
    null;

  const categories = (categoriesRes.data ?? []) as Category[];
  const projects = (projectsRes.data ?? []) as Project[];

  return {
    categories,
    projects,
    error: err,
  };
}

/** Home page: categories only (no project list). */
export async function fetchPublicCategories(): Promise<{
  categories: Category[];
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return {
    categories: (data ?? []) as Category[],
    error: error?.message ?? null,
  };
}

export type CategoryPageData = {
  category: Category | null;
  projects: Project[];
  error: string | null;
};

export async function fetchCategoryPageData(
  slug: string,
): Promise<CategoryPageData> {
  const supabase = await createSupabaseServerClient();
  const { data: category, error: cErr } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (cErr) {
    return { category: null, projects: [], error: cErr.message };
  }
  if (!category) {
    return { category: null, projects: [], error: null };
  }

  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select("*")
    .eq("category_id", category.id)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return {
    category: category as Category,
    projects: (projects ?? []) as Project[],
    error: pErr?.message ?? null,
  };
}

export async function fetchPublishedProjectBySlug(
  slug: string,
): Promise<{ project: Project | null; error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    return { project: null, error: error.message };
  }
  return { project: (project as Project) ?? null, error: null };
}

export async function fetchPublishedProjectWithCategory(slug: string): Promise<{
  project: Project | null;
  category: Category | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data: project, error: pErr } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (pErr) {
    return { project: null, category: null, error: pErr.message };
  }
  if (!project) {
    return { project: null, category: null, error: null };
  }

  const row = project as Project;
  const { data: category, error: cErr } = await supabase
    .from("categories")
    .select("*")
    .eq("id", row.category_id)
    .maybeSingle();

  if (cErr) {
    return { project: row, category: null, error: cErr.message };
  }

  return {
    project: row,
    category: (category as Category) ?? null,
    error: null,
  };
}
