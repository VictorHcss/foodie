import type { Product } from "@/lib/types"
import { basePrice, hasPromo } from "@/lib/pricing"
import { formatCurrency } from "@/utils/format"
import { cn } from "@/lib/utils"

export function Price({ product, className }: { product: Product; className?: string }) {
  const promo = hasPromo(product)
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("tabular font-semibold", promo && "text-success")}>{formatCurrency(basePrice(product))}</span>
      {promo && (
        <span className="tabular text-sm text-muted-foreground line-through">
          <span className="sr-only">de </span>
          {formatCurrency(product.preco)}
        </span>
      )}
    </span>
  )
}
