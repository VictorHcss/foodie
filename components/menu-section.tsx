"use client"

import { MenuItemCard } from "./menu-item-card"
import type { MenuItem } from "@/lib/types"

interface MenuSectionProps {
  title: string
  items: MenuItem[]
  onAddToCart: (item: MenuItem) => void
}

export function MenuSection({ title, items, onAddToCart }: MenuSectionProps) {
  if (items.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="font-serif font-bold text-2xl text-foreground border-b border-border pb-2">{title}</h2>

      <div className="grid gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  )
}
