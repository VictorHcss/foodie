"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapPin, Search, X } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { SiteFooter } from "@/components/site-footer"
import { RestaurantCard } from "@/components/restaurant-card"
import { CategoryRail } from "@/components/home/category-rail"
import { FiltersSheet } from "@/components/home/filters-sheet"
import { PromoStrip } from "@/components/home/promo-strip"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllCities, getAllRestaurants } from "@/lib/data"
import { getCategoryLook } from "@/lib/visual"
import {
  DEFAULT_FILTERS,
  SORT_LABELS,
  countActive,
  dishMatches,
  filterRestaurants,
  type HomeFilters,
  type SortKey,
} from "@/lib/restaurant-search"
import { cn } from "@/lib/utils"

const CITY_KEY = "foodie-city"
const ALL = "__all"

export default function HomePage() {
  const [filters, setFilters] = useState<HomeFilters>(DEFAULT_FILTERS)
  const [queryInput, setQueryInput] = useState("")
  const resultsRef = useRef<HTMLDivElement>(null)
  const cities = getAllCities()

  // Lembra a cidade escolhida.
  useEffect(() => {
    const saved = localStorage.getItem(CITY_KEY)
    if (saved && cities.some((c) => c.nome === saved)) setFilters((f) => ({ ...f, city: saved }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Busca enquanto digita, com uma pequena espera.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, query: queryInput })), 180)
    return () => clearTimeout(t)
  }, [queryInput])

  const update = (patch: Partial<HomeFilters>) => setFilters((f) => ({ ...f, ...patch }))

  const setCity = (city: string) => {
    update({ city })
    if (city) localStorage.setItem(CITY_KEY, city)
    else localStorage.removeItem(CITY_KEY)
  }

  const dishes = useMemo(() => dishMatches(filters.query), [filters.query])
  const results = useMemo(() => filterRestaurants(filters, dishes), [filters, dishes])
  const active = countActive(filters)
  const browsing = !filters.query && active === 0

  const all = getAllRestaurants()
  const inCity = filters.city ? all.filter((r) => r.cidade === filters.city) : all
  const openNow = inCity.filter((r) => r.aberto).length
  const promos = inCity.filter((r) => r.emPromocao && r.descontoPercentual > 0).sort((a, b) => b.descontoPercentual - a.descontoPercentual)

  const resetAll = () => {
    setQueryInput("")
    setFilters((f) => ({ ...DEFAULT_FILTERS, city: f.city }))
  }

  const heading = filters.query
    ? `Resultados para “${filters.query}”`
    : filters.category
      ? getCategoryLook(filters.category).label
      : filters.city
        ? `Restaurantes em ${filters.city}`
        : "Todos os restaurantes"

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      {/* HERO: a pergunta do dia, em tipografia grande, sobre a mostarda. */}
      <section className="relative overflow-hidden bg-brand text-[var(--ink)]">
        <div className="container-page relative grid items-center gap-8 pb-10 pt-10 md:grid-cols-[1.2fr_.8fr] md:pb-14 md:pt-14">
          <div className="relative z-10">
            <h1 className="font-display text-[64px] font-extrabold sm:text-[88px] lg:text-[112px]">
              Fome
              <br />
              de <span className="text[var(--accent)]">quê?</span>
            </h1>
            <p className="mt-4 max-w-md text-lg font-medium text-[var(--ink)]/75">
              {openNow} {openNow === 1 ? "restaurante aberto" : "restaurantes abertos"} agora
              {filters.city ? ` em ${filters.city}` : ` em ${cities.length} cidades`}. Encontre algo delicioso perto de você.
            </p>

            <form
              role="search"
              className="mt-7 flex max-w-xl flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                update({ query: queryInput })
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              <label className="relative flex-1">
                <span className="sr-only">Buscar restaurante ou prato</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--ink)]/60" />
                <input
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Pizza, açaí, Bella Napoli…"
                  className="h-14 w-full rounded-full border-0 bg-white pl-12 pr-11 text-base text-[var(--ink)] shadow-[0_2px_0_rgba(36,28,22,.15)] outline-none placeholder:text-[var(--ink)]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                />
                {queryInput && (
                  <button
                    type="button"
                    onClick={() => setQueryInput("")}
                    aria-label="Limpar busca"
                    className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[var(--ink)]/60 hover:bg-black/5"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </label>

              <Select value={filters.city || ALL} onValueChange={(v) => setCity(v === ALL ? "" : v)}>
                <SelectTrigger
                  aria-label="Cidade"
                  className="!h-14 w-full rounded-full border-0 bg-[var(--ink)] px-5 text-base font-semibold text-white shadow-none sm:w-auto sm:min-w-[200px] [&_svg]:!text-white/70"
                >
                  <MapPin className="size-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas as cidades</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.nome}>
                      {c.nome}, {c.uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </form>
          </div>

          <HeroPlates />
        </div>
      </section>

      <main className="container-page flex-1 pb-20">
        <div className="-mt-px pt-8">
          <CategoryRail value={filters.category} onChange={(category) => update({ category })} />
        </div>

        {browsing && !filters.category && <PromoStrip restaurants={promos} />}

        <section ref={resultsRef} aria-labelledby="results-title" className="mt-10 scroll-mt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="results-title" className="font-display text-3xl font-extrabold md:text-4xl">
                {heading}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
                {results.length} {results.length === 1 ? "restaurante" : "restaurantes"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <QuickChip on={filters.openNow} onClick={() => update({ openNow: !filters.openNow })}>
                Abertos agora
              </QuickChip>
              <QuickChip on={filters.freeDelivery} onClick={() => update({ freeDelivery: !filters.freeDelivery })}>
                Entrega grátis
              </QuickChip>
              <QuickChip on={filters.promo} onClick={() => update({ promo: !filters.promo })}>
                Promoções
              </QuickChip>
              <Select value={filters.sort} onValueChange={(v) => update({ sort: v as SortKey })}>
                <SelectTrigger aria-label="Ordenar" className="!h-10 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {SORT_LABELS[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FiltersSheet
                filters={filters}
                activeCount={active - Number(!!filters.category)}
                onApply={(f) => {
                  setFilters(f)
                }}
              />
            </div>
          </div>

          {results.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-3xl bg-secondary px-6 py-16 text-center">
              <span className="text-6xl" aria-hidden>
                🥡
              </span>
              <h3 className="font-display mt-4 text-3xl font-extrabold">Nada por aqui com esses filtros</h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                {filters.city
                  ? `Tente outra busca ou veja restaurantes de outras cidades além de ${filters.city}.`
                  : "Tente uma busca mais curta ou tire alguns filtros."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button className="rounded-full" onClick={resetAll}>
                  Limpar filtros
                </Button>
                {filters.city && (
                  <Button variant="outline" className="rounded-full" onClick={() => setCity("")}>
                    Ver todas as cidades
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((r) => (
                <div key={r.id}>
                  <RestaurantCard restaurant={r} />
                  {dishes.get(r.id) && (
                    <p className="mt-1.5 truncate px-0.5 text-sm">
                      <span className="text-muted-foreground">Tem </span>
                      <span className="font-medium">{dishes.get(r.id)!.slice(0, 2).join(", ")}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function QuickChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
        on
          ? "border-[var(--ink)] bg-[var(--ink)] text-white dark:border-[var(--mustard)] dark:bg-[var(--mustard)] dark:text-[var(--ink)]"
          : "bg-background hover:bg-secondary",
      )}
    >
      {children}
    </button>
  )
}

/** Três pratos empilhados: o único momento animado da página. */
function HeroPlates() {
  const plates = [
    { emoji: "🍕", size: "size-56 lg:size-64", pos: "right-[30%] top-2", rot: "-rotate-6", delay: "0ms" },
    { emoji: "🍣", size: "size-40 lg:size-48", pos: "right-0 top-24", rot: "rotate-6", delay: "120ms" },
    { emoji: "🥙", size: "size-36 lg:size-40", pos: "right-[48%] top-[13.5rem] lg:top-[15rem]", rot: "rotate-3", delay: "240ms" },
  ]
  return (
    <div aria-hidden className="relative hidden h-[22rem] md:block lg:h-[25rem]">
      {plates.map((p) => (
        <div
          key={p.emoji}
          className={cn(
            "absolute grid place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(36,28,22,.55)] animate-in fade-in zoom-in-75 spin-in-12 duration-700 fill-mode-both",
            p.size,
            p.pos,
            p.rot,
          )}
          style={{ animationDelay: p.delay }}
        >
          <span className="absolute inset-[9%] rounded-full border-2 border-[var(--ink)]/[.06]" />
          <span className="text-[clamp(4rem,7vw,6.5rem)] leading-none">{p.emoji}</span>
        </div>
      ))}
    </div>
  )
}
