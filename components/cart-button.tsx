"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { formatCurrency } from "@/utils/format"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export function CartButton({ className }: { className?: string }) {
  const { toggleCart, getTotalItems, getTotal } = useCart()
  const count = getTotalItems()
  const [bump, setBump] = useState(false)
  const prev = useRef(count)

  // Pequeno "pulo" quando um item entra: confirma a ação sem tirar o foco.
  useEffect(() => {
    if (count > prev.current) {
      setBump(true)
      const t = setTimeout(() => setBump(false), 350)
      prev.current = count
      return () => clearTimeout(t)
    }
    prev.current = count
  }, [count])

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={count ? `Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}` : "Abrir sacola"}
      className={cn(
        "relative inline-flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors",
        count ? "bg-brand text-brand-foreground hover:bg-[var(--mustard-deep)]" : "bg-secondary hover:bg-accent",
        bump && "animate-in zoom-in-90",
        className,
      )}
    >
      <ShoppingBag className="size-[18px]" />
      {count > 0 ? (
        <>
          <span className="tabular hidden sm:inline">{formatCurrency(getTotal())}</span>
          <span className="tabular grid min-w-5 place-items-center rounded-full bg-[var(--ink)] px-1.5 text-[11px] leading-5 text-white">
            {count > 99 ? "99+" : count}
          </span>
        </>
      ) : (
        <span className="hidden sm:inline">Sacola</span>
      )}
    </button>
  )
}
