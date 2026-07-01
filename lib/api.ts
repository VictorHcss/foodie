import type { Restaurant, Review } from "./types"

export async function getRestaurants(filters?: {
  search?: string
  cuisine?: string
  neighborhood?: string
  minRating?: number
  maxPrice?: number
}): Promise<Restaurant[]> {
  const params = new URLSearchParams()

  if (filters?.search) params.append("search", filters.search)
  if (filters?.cuisine) params.append("cuisine", filters.cuisine)
  if (filters?.neighborhood) params.append("neighborhood", filters.neighborhood)
  if (filters?.minRating) params.append("minRating", filters.minRating.toString())
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())

  const response = await fetch(`/api/restaurants?${params.toString()}`)
  if (!response.ok) throw new Error("Failed to fetch restaurants")
  return response.json()
}

export async function getRestaurant(id: string): Promise<Restaurant> {
  const response = await fetch(`/api/restaurants/${id}`)
  if (!response.ok) throw new Error("Failed to fetch restaurant")
  return response.json()
}

export async function getRestaurantReviews(id: string): Promise<Review[]> {
  const response = await fetch(`/api/restaurants/${id}/reviews`)
  if (!response.ok) throw new Error("Failed to fetch reviews")
  return response.json()
}

export async function createReview(
  restaurantId: string,
  review: {
    userName: string
    rating: number
    comment?: string
  },
): Promise<Review> {
  const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  })

  if (!response.ok) throw new Error("Failed to create review")
  return response.json()
}
