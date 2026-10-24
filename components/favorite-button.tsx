"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export function FavoriteButton({
  restaurantId,
  restaurantName,
  className,
}: {
  restaurantId: string
  restaurantName: string
  className?: string
}) {
  const { state, isFavorite, toggleFavorite } = useAuth()
  const router = useRouter()
  const active = isFavorite(restaurantId)

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Tirar ${restaurantName} dos favoritos` : `Favoritar ${restaurantName}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!state.user) {
          toast("Entre na sua conta para guardar favoritos", {
            action: { label: "Entrar", onClick: () => router.push("/login") },
          })
          return
        }
        const now = toggleFavorite(restaurantId)
        toast(now ? `${restaurantName} está nos favoritos` : `${restaurantName} saiu dos favoritos`)
      }}
      className={cn(
        "grid size-9 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow-sm backdrop-blur transition-transform hover:scale-105 active:scale-95",
        className,
      )}
    >
      <Heart className={cn("size-[18px]", active && "fill-[var(--pimenta)] text-[var(--pimenta)]")} />
    </button>
  )
}
