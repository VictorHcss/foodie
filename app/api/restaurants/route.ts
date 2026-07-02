import { NextResponse } from "next/server"
import { restaurantService } from "@/services/restaurantService"
import { RESTAURANT_CATEGORIES } from "@/lib/types"
import type { SearchFilters } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const category = searchParams.get("category")
  const city = searchParams.get("city")
  const minRating = searchParams.get("minRating")
  
  const filters: SearchFilters = {}
  
  if (search) {
    filters.search = search
  }
  
  if (category && RESTAURANT_CATEGORIES.includes(category as any)) {
    filters.categories = [category as any]
  }
  
  if (city) {
    filters.cities = [city]
  }
  
  if (minRating) {
    filters.minRating = parseFloat(minRating)
  }

  const restaurants = restaurantService.search(filters)
  return NextResponse.json(restaurants)
}
