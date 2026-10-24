"use client"

import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { PRICE_RANGES, type HomeFilters, filterRestaurants, DEFAULT_FILTERS } from "@/lib/restaurant-search"

const RATINGS = [
  { value: 0, label: "Qualquer" },
  { value: 3.5, label: "3,5+" },
  { value: 4, label: "4,0+" },
  { value: 4.5, label: "4,5+" },
]

const PRICE_HINT: Record<string, string> = {
  $: "Em conta",
  $$: "Moderado",
  $$$: "Caprichado",
  $$$$: "Especial",
}

export function FiltersSheet({
  filters,
  onApply,
  activeCount,
}: {
  filters: HomeFilters
  onApply: (f: HomeFilters) => void
  activeCount: number
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(filters)
  const preview = filterRestaurants(draft).length

  const set = <K extends keyof HomeFilters>(k: K, v: HomeFilters[K]) => setDraft((d) => ({ ...d, [k]: v }))

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) setDraft(filters)
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10 rounded-full">
          <SlidersHorizontal />
          Filtros
          {activeCount > 0 && (
            <span className="tabular grid min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1.5 text-[11px] leading-5 text-white dark:bg-[var(--mustard)] dark:text-[var(--ink)]">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="font-display text-3xl">Filtros</SheetTitle>
          <SheetDescription>Ajuste e veja quantos restaurantes sobram antes de aplicar.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <fieldset>
            <legend className="mb-3 font-semibold">Faixa de preço</legend>
            <div className="grid grid-cols-4 gap-2">
              {PRICE_RANGES.map((p) => {
                const on = draft.prices.includes(p)
                return (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("prices", on ? draft.prices.filter((x) => x !== p) : [...draft.prices, p])}
                    className={cn(
                      "flex flex-col items-center rounded-xl border py-3 transition-colors",
                      on ? "border-[var(--ink)] bg-[var(--ink)] text-white dark:border-[var(--mustard)] dark:bg-[var(--mustard)] dark:text-[var(--ink)]" : "hover:bg-secondary",
                    )}
                  >
                    <span className="font-bold">{p}</span>
                    <span className={cn("text-[11px]", on ? "opacity-80" : "text-muted-foreground")}>{PRICE_HINT[p]}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-semibold">Nota mínima</legend>
            <div className="flex flex-wrap gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={draft.minRating === r.value}
                  onClick={() => set("minRating", r.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    draft.minRating === r.value
                      ? "border-[var(--ink)] bg-[var(--ink)] text-white dark:border-[var(--mustard)] dark:bg-[var(--mustard)] dark:text-[var(--ink)]"
                      : "hover:bg-secondary",
                  )}
                >
                  {r.value ? `★ ${r.label}` : r.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-3 font-semibold">Entrega</legend>
            <SwitchRow id="f-open" label="Só abertos agora" checked={draft.openNow} onChange={(v) => set("openNow", v)} />
            <SwitchRow id="f-free" label="Entrega grátis" checked={draft.freeDelivery} onChange={(v) => set("freeDelivery", v)} />
            <SwitchRow id="f-promo" label="Com promoção" checked={draft.promo} onChange={(v) => set("promo", v)} />
          </fieldset>
        </div>

        <SheetFooter className="flex-row gap-2 border-t p-4">
          <Button
            variant="ghost"
            className="h-12 flex-1 rounded-full"
            onClick={() =>
              setDraft({ ...DEFAULT_FILTERS, query: draft.query, city: draft.city, category: draft.category, sort: draft.sort })
            }
          >
            Limpar
          </Button>
          <Button
            className="h-12 flex-[2] rounded-full"
            disabled={preview === 0}
            onClick={() => {
              onApply(draft)
              setOpen(false)
            }}
          >
            {preview === 0 ? "Nenhum resultado" : `Ver ${preview} ${preview === 1 ? "restaurante" : "restaurantes"}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SwitchRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-[15px] font-normal">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
