"use client"

import { MenuItemCard } from "./menu-item-card"
import type { MenuItem } from "@/lib/types"

interface MenuSectionProps {
  id: string
  title: string
  items: MenuItem[]
  onOpen: (item: MenuItem) => void
  onQuickAdd?: (item: MenuItem) => void
  cartCounts?: Record<string, number>
  disabled?: boolean
}

export function MenuSection({ id, title, items, onOpen, onQuickAdd, cartCounts = {}, disabled }: MenuSectionProps) {
  if (items.length === 0) return null
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32">
      <h2 id={`${id}-title`} className="font-display mb-2 text-3xl font-extrabold">
        {title}
      </h2>
      <div className="-mx-3 grid gap-1 lg:grid-cols-2">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onOpen={onOpen}
            onQuickAdd={onQuickAdd}
            inCart={cartCounts[item.id] ?? 0}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  )
}
