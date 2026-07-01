import { restaurants } from "@/data/restaurants";
import type { Restaurant, SearchFilters } from "@/lib/types";

export const restaurantService = {
  getAll(): Restaurant[] {
    return restaurants;
  },

  getById(id: string): Restaurant | undefined {
    return restaurants.find((r) => r.id === id);
  },

  search(filters: SearchFilters): Restaurant[] {
    return restaurants.filter((restaurant) => {
      // Search by text
      if (
        filters.search &&
        !restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !restaurant.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Filter by categories
      if (
        filters.categories &&
        filters.categories.length > 0 &&
        !filters.categories.includes(restaurant.category)
      ) {
        return false;
      }

      // Filter by cities
      if (
        filters.cities &&
        filters.cities.length > 0 &&
        !filters.cities.includes(restaurant.city)
      ) {
        return false;
      }

      // Filter by price range
      if (
        filters.priceRanges &&
        filters.priceRanges.length > 0 &&
        !filters.priceRanges.includes(restaurant.priceRange)
      ) {
        return false;
      }

      // Filter by rating
      if (
        filters.minRating !== undefined &&
        restaurant.rating < filters.minRating
      ) {
        return false;
      }

      // Filter by open now
      if (filters.isOpenNow && !restaurant.isOpenNow) {
        return false;
      }

      // Filter by featured
      if (filters.isFeatured && !restaurant.isFeatured) {
        return false;
      }

      return true;
    });
  },

  getFeatured(): Restaurant[] {
    return restaurants.filter((r) => r.isFeatured);
  },

  getTopRated(limit: number = 10): Restaurant[] {
    return [...restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },
};
