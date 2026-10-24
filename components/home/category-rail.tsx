"use client"

import { CATEGORIES, getCategoryLook } from "@/lib/visual"
import { cn } from "@/lib/utils"

export function CategoryRail({
  value,
  onChange,
}: {
  value: string
  onChange: (slug: string) => void
}) {
  return (
    <div role="radiogroup" aria-label="Categorias" className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8">
      <RailItem active={!value} onClick={() => onChange("")} label="Tudo" emoji="🍽️" bg="var(--surface)" />
      {CATEGORIES.map((c) => {
        const look = getCategoryLook(c.slug)
        return (
          <RailItem
            key={c.slug}
            active={value === c.slug}
            onClick={() => onChange(value === c.slug ? "" : c.slug)}
            label={c.nome}
            emoji={look.emoji}
            bg={look.bg}
          />
        )
      })}
    </div>
  )
}

function RailItem({
  active,
  onClick,
  label,
  emoji,
  bg,
}: {
  active: boolean
  onClick: () => void
  label: string
  emoji: string
  bg: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className="group flex w-[76px] shrink-0 snap-start flex-col items-center gap-1.5 rounded-2xl py-1 outline-offset-2"
    >
      <span
        className={cn(
          "grid size-[64px] place-items-center rounded-full text-[30px] ring-offset-2 ring-offset-background transition-all",
          active ? "ring-[3px] ring-[var(--ink)] dark:ring-[var(--mustard)]" : "group-hover:-translate-y-0.5",
        )}
        style={{ backgroundColor: bg }}
        aria-hidden
      >
        <span className="transition-transform group-hover:scale-110">{emoji}</span>
      </span>
      <span className={cn("max-w-full truncate text-xs", active ? "font-bold text-foreground" : "font-medium text-muted-foreground")}>
        {label}
      </span>
    </button>
  )
}
