import type { Restaurant, SearchFilters } from "@/lib/types";
import { restaurants } from "@/data/restaurants";

export const restaurantService = {
  getAll: (): Restaurant[] => restaurants,
  getById: (id: string): Restaurant | undefined =>
    restaurants.find((r) => r.id === id),
  search: (filters: SearchFilters): Restaurant[] => {
    let results = [...restaurants];

    // Search by name, description, tags
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          r.menu.some((m) => m.name.toLowerCase().includes(searchLower))
      );
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter((r) =>
        filters.categories!.includes(r.category)
      );
    }

    // Filter by cities
    if (filters.cities && filters.cities.length > 0) {
      results = results.filter((r) => filters.cities!.includes(r.city));
    }

    // Filter by price ranges
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      results = results.filter((r) =>
        filters.priceRanges!.includes(r.priceRange)
      );
    }

    // Filter by minimum rating
    if (filters.minRating) {
      results = results.filter((r) => r.rating >= filters.minRating);
    }

    // Filter by open now
    if (filters.isOpenNow) {
      results = results.filter((r) => r.isOpenNow);
    }

    // Filter by featured
    if (filters.isFeatured) {
      results = results.filter((r) => r.isFeatured);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
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
