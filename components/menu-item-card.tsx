"use client"

import { Plus } from "lucide-react"
import type { MenuItem } from "@/lib/types"
import { FoodImage } from "./food-image"
import { Price } from "./price"
import { hasPromo } from "@/lib/pricing"
import { cn } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
  /** Abre o detalhe do prato. */
  onOpen: (item: MenuItem) => void
  /** Adiciona direto, sem adicionais. */
  onQuickAdd?: (item: MenuItem) => void
  inCart?: number
  disabled?: boolean
}

export function MenuItemCard({ item, onOpen, onQuickAdd, inCart = 0, disabled }: MenuItemCardProps) {
  const unavailable = !item.disponivel
  return (
    <div className={cn("group relative flex gap-4 rounded-2xl p-3 transition-colors hover:bg-secondary/70", unavailable && "opacity-60")}>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="absolute inset-0 rounded-2xl"
        aria-label={`Ver ${item.nome}`}
      />
      <div className="pointer-events-none min-w-0 flex-1 py-1">
        <div className="flex items-center gap-2">
          {inCart > 0 && (
            <span className="tabular grid min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold leading-6 text-brand-foreground">
              {inCart}×
            </span>
          )}
          <h4 className="truncate font-semibold">{item.nome}</h4>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.descricao}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Price product={item} />
          {hasPromo(item) && (
            <span className="rounded-full bg-[var(--pimenta)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--pimenta)]">
              Promoção
            </span>
          )}
          {unavailable && <span className="text-xs font-medium text-muted-foreground">Indisponível hoje</span>}
        </div>
      </div>

      <div className="relative size-28 shrink-0 overflow-hidden rounded-xl sm:size-32">
        <FoodImage
          src={item.imagem || item.image}
          alt=""
          categorySlug={item.categoria}
          dishName={item.nome}
          variant="flat"
          emojiClassName="text-5xl transition-transform duration-300 group-hover:scale-110"
        />
        {onQuickAdd && !unavailable && !disabled && (
          <button
            type="button"
            onClick={() => onQuickAdd(item)}
            aria-label={`Adicionar ${item.nome} à sacola`}
            className="absolute bottom-2 right-2 z-10 grid size-9 place-items-center rounded-full bg-white text-[var(--ink)] shadow-md transition-transform hover:scale-110 active:scale-95"
          >
            <Plus className="size-5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}
