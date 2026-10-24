"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

const LABELS = ["", "Ruim", "Fraco", "Bom", "Muito bom", "Excelente"]

export function StarRating({ rating, onRatingChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const sz = { sm: "size-4", md: "size-5", lg: "size-8" }[size]
  const shown = hover || rating

  if (readonly) {
    return (
      <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} aria-hidden className={cn(sz, i < Math.round(rating) ? "fill-[var(--mustard)] text-[var(--mustard)]" : "text-border")} />
        ))}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Sua nota" className="flex" onMouseLeave={() => setHover(0)}>
        {Array.from({ length: 5 }, (_, i) => {
          const v = i + 1
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={rating === v}
              aria-label={`${v} ${v === 1 ? "estrela" : "estrelas"}, ${LABELS[v]}`}
              onClick={() => onRatingChange?.(v)}
              onMouseEnter={() => setHover(v)}
              className="rounded-md p-0.5 transition-transform hover:scale-110"
            >
              <Star className={cn(sz, "transition-colors", shown >= v ? "fill-[var(--mustard)] text-[var(--mustard)]" : "text-input")} />
            </button>
          )
        })}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{shown ? LABELS[shown] : "Toque para dar nota"}</span>
    </div>
  )
}
