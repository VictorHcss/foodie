import { Bike, Clock, Star } from "lucide-react"
import type { Restaurant } from "@/lib/types"
import { formatCurrency } from "@/utils/format"
import { cn } from "@/lib/utils"

export function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`
  return String(n)
}

export function deliveryFeeLabel(r: Restaurant) {
  return r.entregaGratis || r.freeDelivery ? "Entrega grátis" : formatCurrency(r.taxaEntrega || r.deliveryFee || 0)
}

/** Linha de nota, tempo e taxa, usada no card e no topo do restaurante. */
export function RestaurantMeta({ restaurant: r, className, showCount = true }: { restaurant: Restaurant; className?: string; showCount?: boolean }) {
  const free = r.entregaGratis || r.freeDelivery
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-1 font-semibold text-foreground">
        <Star className="size-4 fill-[var(--mustard)] text-[var(--mustard)]" aria-hidden />
        <span className="tabular">{r.nota.toFixed(1).replace(".", ",")}</span>
        {showCount && <span className="font-normal text-muted-foreground">({formatCount(r.avaliacoes)})</span>}
        <span className="sr-only">de 5 estrelas</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-4" aria-hidden />
        <span className="tabular">
          {r.tempoEntregaMin}–{r.tempoEntregaMax} min
        </span>
      </span>
      <span className={cn("inline-flex items-center gap-1", free && "font-semibold text-success")}>
        <Bike className="size-4" aria-hidden />
        <span className="tabular">{deliveryFeeLabel(r)}</span>
      </span>
    </div>
  )
}
