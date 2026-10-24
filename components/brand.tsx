import Link from "next/link"
import { cn } from "@/lib/utils"

/** Marca: "foodie" em Bricolage condensada com o selo mostarda. */
export function Brand({ className, onDark = false, onBrand = false }: { className?: string; onDark?: boolean; onBrand?: boolean }) {
  return (
    <Link href="/" aria-label="Foodie, ir para o início" className={cn("group inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={cn("grid size-9 place-items-center rounded-[11px] font-display text-[26px] font-extrabold leading-none transition-transform group-hover:-rotate-6", onBrand ? "bg-[var(--ink)] text-[var(--mustard)]" : "bg-brand text-brand-foreground")}
      >
        f
      </span>
      <span className={cn("font-display text-[28px] font-extrabold", onDark ? "text-white" : onBrand ? "text-[var(--ink)]" : "text-foreground")}>
        foodie
      </span>
    </Link>
  )
}
