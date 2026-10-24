"use client"

import Link from "next/link"
import type { Restaurant } from "@/lib/types"
import { FoodImage } from "./food-image"
import { FavoriteButton } from "./favorite-button"
import { RestaurantMeta } from "./restaurant-meta"
import { getCategoryLook } from "@/lib/visual"
import { cn } from "@/lib/utils"

interface RestaurantCardProps {
  restaurant: Restaurant
  /** Mantido por compatibilidade; o card agora é um link. */
  onClick?: () => void
  className?: string
}

export function RestaurantCard({ restaurant: r, className }: RestaurantCardProps) {
  const look = getCategoryLook(r.categoriaSlug)

  return (
    <Link
      href={`/restaurant/${r.id}`}
      className={cn("group block rounded-2xl outline-offset-4", className)}
      aria-label={`${r.nome}, ${look.label}${r.aberto ? "" : ", fechado agora"}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <FoodImage
          src={r.capa || r.coverImage}
          alt=""
          categorySlug={r.categoriaSlug}
          emojiClassName="text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
          className={cn("transition-transform duration-500 group-hover:scale-[1.03]", !r.aberto && "grayscale-[.7] opacity-80")}
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {r.emPromocao && r.descontoPercentual > 0 && (
            <span className="rounded-full bg-[var(--pimenta)] px-2.5 py-1 text-xs font-bold text-white">
              {r.descontoPercentual}% off
            </span>
          )}
        </div>

        <FavoriteButton restaurantId={r.id} restaurantName={r.nome} className="absolute right-3 top-3" />

        {!r.aberto && (
          <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[var(--ink)]/85 px-3 py-2 text-xs font-medium text-white backdrop-blur">
            Fechado agora. Abre às {r.horario?.abertura}
          </div>
        )}
      </div>

      <div className="px-0.5 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display-wide truncate text-lg font-bold leading-tight">{r.nome}</h3>
          <span className="shrink-0 text-sm text-muted-foreground">{r.faixaDePreco}</span>
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {look.label} em {r.cidade}
          {r.patrocinado && <span className="ml-2 text-xs opacity-70">Patrocinado</span>}
        </p>
        <RestaurantMeta restaurant={r} className="mt-2" />
      </div>
    </Link>
  )
}
