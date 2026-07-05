import { Restaurant, Product, SearchResult as SearchResultType } from "@/lib/types";
import { listRestaurants, listProducts } from "@/services";
import { matchesSearch } from "@/utils/filters";

export function search(query: string, limit = 10): SearchResultType {
  if (!query) {
    return {
      restaurants: [],
      products: [],
    };
  }

  const restaurants = listRestaurants({ busca: query }).slice(0, limit);
  const products = listProducts({ busca: query }).slice(0, limit);

  return {
    restaurants,
    products,
  };
}
