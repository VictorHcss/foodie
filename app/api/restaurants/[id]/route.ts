import { NextResponse } from "next/server"
import { restaurantService } from "@/services/restaurantService"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const restaurant = restaurantService.getById(id)

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  return NextResponse.json(restaurant)
}
