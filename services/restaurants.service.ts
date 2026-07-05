import { Restaurant, RestaurantFilters } from "@/lib/types";
import { getAllRestaurants } from "@/lib/data";
import { matchesSearch, parseBooleanParam, parseNumberParam } from "@/utils/filters";
import { isWithinBusinessHours } from "@/utils/format";
import { slugify } from "@/utils/slug";

export function listRestaurants(filters: RestaurantFilters = {}): Restaurant[] {
  return getAllRestaurants().filter((restaurant) => matchesFilters(restaurant, filters));
}

export function getRestaurantById(id: string): Restaurant | null {
  return getAllRestaurants().find((restaurant) => restaurant.id === id) ?? null;
}

export function getRestaurantBySlug(slug: string): Restaurant | null {
  return getAllRestaurants().find((restaurant) => restaurant.slug === slug) ?? null;
}

export function listFeaturedRestaurants(): Restaurant[] {
  return getAllRestaurants().filter((restaurant) => restaurant.destaque);
}

export function listSponsoredRestaurants(): Restaurant[] {
  return getAllRestaurants().filter((restaurant) => restaurant.patrocinado);
}

export function isRestaurantCurrentlyOpen(restaurant: Restaurant): boolean {
  if (!restaurant.aberto) return false;
  return isWithinBusinessHours(restaurant.horario.abertura, restaurant.horario.fechamento);
}

function matchesFilters(restaurant: Restaurant, filters: RestaurantFilters): boolean {
  if (filters.cidade) {
    const matchesId = restaurant.cidadeId === filters.cidade;
    const matchesSlug = slugify(restaurant.cidade) === filters.cidade;
    const matchesName = matchesSearch(restaurant.cidade, filters.cidade);
    if (!matchesId && !matchesSlug && !matchesName) {
      return false;
    }
  }

  if (filters.categoria && restaurant.categoriaSlug !== filters.categoria && restaurant.categoriaId !== filters.categoria) {
    return false;
  }

  if (filters.precoMax !== undefined && restaurant.precoMedio > filters.precoMax) {
    return false;
  }

  if (filters.notaMin !== undefined && restaurant.nota < filters.notaMin) {
    return false;
  }

  if (filters.aberto !== undefined && restaurant.aberto !== filters.aberto) {
    return false;
  }

  if (filters.entregaGratis !== undefined && restaurant.entregaGratis !== filters.entregaGratis) {
    return false;
  }

  if (filters.emPromocao !== undefined && restaurant.emPromocao !== filters.emPromocao) {
    return false;
  }

  if (filters.destaque !== undefined && restaurant.destaque !== filters.destaque) {
    return false;
  }

  if (filters.busca && !matchesSearch(restaurant.nome, filters.busca) && !matchesSearch(restaurant.descricao, filters.busca)) {
    return false;
  }

  return true;
}

export function buildRestaurantFiltersFromSearchParams(searchParams: URLSearchParams): RestaurantFilters {
  return {
    cidade: searchParams.get("cidade") ?? undefined,
    categoria: searchParams.get("categoria") ?? undefined,
    precoMax: parseNumberParam(searchParams.get("precoMax")),
    notaMin: parseNumberParam(searchParams.get("notaMin")),
    aberto: parseBooleanParam(searchParams.get("aberto")),
    entregaGratis: parseBooleanParam(searchParams.get("entregaGratis")),
    emPromocao: parseBooleanParam(searchParams.get("emPromocao")),
    destaque: parseBooleanParam(searchParams.get("destaque")),
    busca: searchParams.get("busca") ?? undefined,
  };
}
