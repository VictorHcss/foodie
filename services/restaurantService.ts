import type { Restaurant, SearchFilters } from "@/lib/types";
import { restaurants } from "@/data/restaurants";

export const restaurantService = {
  getAll: (): Restaurant[] => restaurants,
  getById: (id: string): Restaurant | undefined =>
    restaurants.find((r) => r.id === id),
  search: (filters: SearchFilters): Restaurant[] => {
    let results = [...restaurants];
    const search = filters.search;
    const categories = filters.categories;
    const cities = filters.cities;
    const priceRanges = filters.priceRanges;
    const minRating = filters.minRating;
    const isOpenNow = filters.isOpenNow;
    const isFeatured = filters.isFeatured;
    const sortBy = filters.sortBy;

    // Search by name, description, tags
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          r.menu.some((m) => m.name.toLowerCase().includes(searchLower))
      );
    }

    // Filter by categories
    if (categories && categories.length > 0) {
      results = results.filter((r) => categories.includes(r.category));
    }

    // Filter by cities
    if (cities && cities.length > 0) {
      results = results.filter((r) => cities.includes(r.city));
    }

    // Filter by price ranges
    if (priceRanges && priceRanges.length > 0) {
      results = results.filter((r) => priceRanges.includes(r.priceRange));
    }

    // Filter by minimum rating
    if (typeof minRating === "number") {
      results = results.filter((r) => r.rating >= minRating);
    }

    // Filter by open now
    if (isOpenNow) {
      results = results.filter((r) => r.isOpenNow);
    }

    // Filter by featured
    if (isFeatured) {
      results = results.filter((r) => r.isFeatured);
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case "rating":
          results.sort((a, b) => b.rating - a.rating);
          break;
        case "price":
          results.sort((a, b) => {
            const priceOrder = { $: 0, $$: 1, $$$: 2 };
            return priceOrder[a.priceRange] - priceOrder[b.priceRange];
          });
          break;
        case "name":
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return results;
  },
  getFeatured: (): Restaurant[] =>
    restaurants.filter((r) => r.isFeatured).slice(0, 6),
  getTopRated: (limit: number = 10): Restaurant[] =>
    [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, limit),
};
