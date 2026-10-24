"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  removable = false,
  label = "Quantidade",
  className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  size?: "sm" | "md"
  /** Quando true e value === 1, o botão de menos vira lixeira. */
  removable?: boolean
  label?: string
  className?: string
}) {
  const btn = size === "sm" ? "size-8" : "size-11"
  const showTrash = removable && value <= 1
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border bg-background", className)}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!removable && value <= min}
        aria-label={showTrash ? "Remover" : "Diminuir"}
        className={cn("grid place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40", btn, showTrash && "text-destructive")}
      >
        {showTrash ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
      </button>
      <span className={cn("tabular text-center font-semibold", size === "sm" ? "w-6 text-sm" : "w-8")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar"
        className={cn("grid place-items-center rounded-full transition-colors hover:bg-secondary disabled:opacity-40", btn)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
