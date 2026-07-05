import { City } from "@/lib/types";
import { getAllCities } from "@/lib/data";
import { matchesSearch } from "@/utils/filters";
import { slugify } from "@/utils/slug";

export function listCities(search?: string): City[] {
  let cities = getAllCities();

  if (search) {
    cities = cities.filter(
      (city) =>
        matchesSearch(city.nome, search) ||
        matchesSearch(city.uf, search) ||
        matchesSearch(city.estado, search)
    );
  }

  return cities;
}

export function getCityById(id: string): City | null {
  return getAllCities().find((city) => city.id === id) ?? null;
}

export function getCityBySlug(slug: string): City | null {
  return getAllCities().find((city) => city.slug === slug) ?? null;
}
