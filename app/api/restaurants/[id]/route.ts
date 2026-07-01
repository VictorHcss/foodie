import { NextResponse } from "next/server"
import restaurantsData from "@/data/restaurants.json"
import type { Restaurant } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const restaurants: Restaurant[] = restaurantsData as Restaurant[]
  const restaurant = restaurants.find((r) => r.id === id)

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  return NextResponse.json(restaurant)
}
