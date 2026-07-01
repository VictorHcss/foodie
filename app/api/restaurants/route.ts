import { NextResponse } from "next/server"
import restaurantsData from "@/data/restaurants.json"
import type { Restaurant } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.toLowerCase()
  const cuisine = searchParams.get("cuisine")
  const neighborhood = searchParams.get("neighborhood")
  const minRating = searchParams.get("minRating")
  const maxPrice = searchParams.get("maxPrice")

  let restaurants: Restaurant[] = restaurantsData as Restaurant[]

  // Apply filters
  if (search) {
    restaurants = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(search) ||
        restaurant.cuisine.toLowerCase().includes(search) ||
        restaurant.neighborhood.toLowerCase().includes(search),
    )
  }

  if (cuisine) {
    restaurants = restaurants.filter((restaurant) => restaurant.cuisine.toLowerCase() === cuisine.toLowerCase())
  }

  if (neighborhood) {
    restaurants = restaurants.filter(
      (restaurant) => restaurant.neighborhood.toLowerCase() === neighborhood.toLowerCase(),
    )
  }

  if (minRating) {
    restaurants = restaurants.filter((restaurant) => restaurant.rating >= Number.parseFloat(minRating))
  }

  if (maxPrice) {
    restaurants = restaurants.filter((restaurant) => restaurant.averagePrice <= Number.parseFloat(maxPrice))
  }

  return NextResponse.json(restaurants)
}
