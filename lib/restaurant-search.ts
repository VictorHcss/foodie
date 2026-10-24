import type { Restaurant } from "@/lib/types"
import { getAllProducts, getAllRestaurants } from "@/lib/data"
import { matchesSearch } from "@/utils/filters"
import { getCategoryLook } from "@/lib/visual"

export type SortKey = "relevancia" | "nota" | "tempo" | "taxa" | "preco"

export const SORT_LABELS: Record<SortKey, string> = {
  relevancia: "Relevância",
  nota: "Melhor avaliados",
  tempo: "Entrega mais rápida",
  taxa: "Menor taxa",
  preco: "Menor preço médio",
}

export const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"] as const

export interface HomeFilters {
  query: string
  city: string // "" = todas
  category: string // "" = todas
  openNow: boolean
  freeDelivery: boolean
  promo: boolean
  prices: string[] // vazio = todos
  minRating: number
  sort: SortKey
}

export const DEFAULT_FILTERS: HomeFilters = {
  query: "",
  city: "",
  category: "",
  openNow: false,
  freeDelivery: false,
  promo: false,
  prices: [],
  minRating: 0,
  sort: "relevancia",
}

/** Pratos que casam com a busca, por restaurante (para mostrar no card). */
export function dishMatches(query: string): Map<string, string[]> {
  const map = new Map<string, string[]>()
  if (!query.trim()) return map
  for (const p of getAllProducts()) {
    if (matchesSearch(p.nome, query)) {
      const list = map.get(p.restaurantId) ?? []
      list.push(p.nome)
      map.set(p.restaurantId, list)
    }
  }
  return map
}

export function filterRestaurants(f: HomeFilters, dishes = dishMatches(f.query)): Restaurant[] {
  const q = f.query.trim()
  const list = getAllRestaurants().filter((r) => {
    if (f.city && r.cidade !== f.city) return false
    if (f.category && r.categoriaSlug !== f.category) return false
    if (f.openNow && !r.aberto) return false
    if (f.freeDelivery && !r.entregaGratis) return false
    if (f.promo && !r.emPromocao) return false
    if (f.prices.length && !f.prices.includes(r.faixaDePreco)) return false
    if (f.minRating && r.nota < f.minRating) return false
    if (q) {
      const hit =
        matchesSearch(r.nome, q) ||
        matchesSearch(getCategoryLook(r.categoriaSlug).label, q) ||
        r.tags.some((t) => matchesSearch(t, q)) ||
        dishes.has(r.id)
      if (!hit) return false
    }
    return true
  })

  const byOpen = (a: Restaurant, b: Restaurant) => Number(b.aberto) - Number(a.aberto)
  const sorters: Record<SortKey, (a: Restaurant, b: Restaurant) => number> = {
    relevancia: (a, b) =>
      byOpen(a, b) ||
      Number(b.patrocinado) - Number(a.patrocinado) ||
      Number(b.destaque) - Number(a.destaque) ||
      b.nota - a.nota,
    nota: (a, b) => byOpen(a, b) || b.nota - a.nota || b.avaliacoes - a.avaliacoes,
    tempo: (a, b) => byOpen(a, b) || a.tempoEntregaMax - b.tempoEntregaMax,
    taxa: (a, b) => byOpen(a, b) || (a.entregaGratis ? 0 : a.taxaEntrega) - (b.entregaGratis ? 0 : b.taxaEntrega),
    preco: (a, b) => byOpen(a, b) || a.precoMedio - b.precoMedio,
  }
  return list.sort(sorters[f.sort])
}

export function countActive(f: HomeFilters) {
  return (
    Number(!!f.category) +
    Number(f.openNow) +
    Number(f.freeDelivery) +
    Number(f.promo) +
    Number(f.prices.length > 0) +
    Number(f.minRating > 0)
  )
}
