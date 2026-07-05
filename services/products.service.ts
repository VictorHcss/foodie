import { Product, ProductFilters } from "@/lib/types";
import { getAllProducts } from "@/lib/data";
import { matchesSearch, parseBooleanParam, parseNumberParam } from "@/utils/filters";

export function listProducts(filters: ProductFilters = {}): Product[] {
  return getAllProducts().filter((product) => matchesFilters(product, filters));
}

export function getProductById(id: string): Product | null {
  return getAllProducts().find((product) => product.id === id) ?? null;
}

export function getProductsByRestaurant(restaurantId: string): Product[] {
  return getAllProducts().filter((product) => product.restaurantId === restaurantId);
}

function matchesFilters(product: Product, filters: ProductFilters): boolean {
  if (filters.restaurantId && product.restaurantId !== filters.restaurantId) {
    return false;
  }

  if (filters.categoria && product.categoria !== filters.categoria) {
    return false;
  }

  if (filters.precoMax !== undefined && product.preco > filters.precoMax) {
    return false;
  }

  if (filters.disponivel !== undefined && product.disponivel !== filters.disponivel) {
    return false;
  }

  if (filters.busca && !matchesSearch(product.nome, filters.busca) && !matchesSearch(product.descricao, filters.busca)) {
    return false;
  }

  return true;
}

export function buildProductFiltersFromSearchParams(searchParams: URLSearchParams): ProductFilters {
  return {
    restaurantId: searchParams.get("restaurantId") ?? undefined,
    categoria: searchParams.get("categoria") ?? undefined,
    precoMax: parseNumberParam(searchParams.get("precoMax")),
    disponivel: parseBooleanParam(searchParams.get("disponivel")),
    busca: searchParams.get("busca") ?? undefined,
  };
}
