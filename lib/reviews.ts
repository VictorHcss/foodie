import type { Review } from "@/lib/types"
import reviewsJson from "@/data/reviews.json"

/**
 * Avaliações: as de exemplo (data/reviews.json usa ids curtos "1", "2"…,
 * que aqui são casados com "restaurante-001", "restaurante-002"…) mais
 * as enviadas neste navegador.
 */
const KEY = "foodie-reviews"

const normalizeId = (id: string) => (/^\d+$/.test(id) ? `restaurante-${id.padStart(3, "0")}` : id)

export function getReviews(restaurantId: string): Review[] {
  const seeded = (reviewsJson as Review[])
    .map((r) => ({ ...r, restaurantId: normalizeId(r.restaurantId) }))
    .filter((r) => r.restaurantId === restaurantId)
  let local: Review[] = []
  if (typeof window !== "undefined") {
    try {
      local = (JSON.parse(localStorage.getItem(KEY) || "[]") as Review[]).filter(
        (r) => r.restaurantId === restaurantId,
      )
    } catch {}
  }
  return [...local, ...seeded].sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function addReview(review: Omit<Review, "id" | "date">): Review {
  const full: Review = { ...review, id: `review-${Date.now()}`, date: new Date().toISOString() }
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || "[]") as Review[]
    localStorage.setItem(KEY, JSON.stringify([full, ...all]))
  } catch {}
  return full
}
