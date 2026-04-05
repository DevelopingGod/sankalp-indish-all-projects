import { fetchPublicCategories } from "@/lib/portfolio/fetch-public";
import { CategoryGrid } from "./CategoryGrid";
import { PortfolioErrorBanner } from "./PortfolioErrorBanner";

export async function ViewerGallery() {
  const { categories, error } = await fetchPublicCategories();

  if (error) {
    return <PortfolioErrorBanner message={error} />;
  }

  return <CategoryGrid categories={categories} />;
}
