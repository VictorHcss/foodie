import { Category } from "@/lib/types";
import { getAllCategories } from "@/lib/data";

export function listCategories(): Category[] {
  return getAllCategories().sort((a, b) => a.ordem - b.ordem);
}

export function getCategoryById(id: string): Category | null {
  return getAllCategories().find((category) => category.id === id) ?? null;
}

export function getCategoryBySlug(slug: string): Category | null {
  return getAllCategories().find((category) => category.slug === slug) ?? null;
}
