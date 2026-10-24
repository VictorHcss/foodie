"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getCategoryLook, getDishEmoji } from "@/lib/visual"

interface FoodImageProps {
  src?: string | null
  alt: string
  categorySlug?: string
  /** Nome do prato, usado para escolher o emoji do fallback. */
  dishName?: string
  className?: string
  emojiClassName?: string
  /** Estilo do fallback: "plate" desenha um prato; "flat" só a cor. */
  variant?: "plate" | "flat"
}

/**
 * Mostra a foto quando ela existe; se não existir ou falhar ao carregar,
 * desenha um prato na cor da categoria com o emoji do prato.
 */
export function FoodImage({
  src,
  alt,
  categorySlug,
  dishName,
  className,
  emojiClassName,
  variant = "plate",
}: FoodImageProps) {
  const [failed, setFailed] = useState(false)
  const usable = !!src && !src.endsWith("undefined") && !src.includes("placeholder") && !failed
  const look = getCategoryLook(categorySlug)
  const emoji = dishName ? getDishEmoji(dishName, categorySlug) : look.emoji

  if (usable) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src!}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
      style={{ backgroundColor: look.bg }}
    >
      {variant === "plate" && (
        <span
          aria-hidden
          className="absolute aspect-square w-[58%] max-w-[220px] rounded-full"
          style={{
            background: "radial-gradient(circle, #ffffff 0 58%, rgba(255,255,255,.55) 59% 66%, transparent 67%)",
            boxShadow: `0 10px 30px -12px ${look.fg}55`,
          }}
        />
      )}
      <span
        aria-hidden
        className={cn("relative select-none leading-none text-5xl drop-shadow-sm", emojiClassName)}
      >
        {emoji}
      </span>
    </div>
  )
}
