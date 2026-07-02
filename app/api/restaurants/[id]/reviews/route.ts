import { NextResponse } from "next/server"
import { getRestaurantById } from "@/data/restaurants"
import type { Review } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const restaurant = getRestaurantById(id)
  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }
  return NextResponse.json(restaurant.reviews)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const newReview: Review = {
    id: "review-" + Date.now().toString(),
    restaurantId: id,
    userId: body.userId || "user-1",
    userName: body.userName,
    rating: body.rating,
    comment: body.comment || "",
    date: new Date().toISOString().split("T")[0],
  }
  // In a real app, you'd save this to a database
  // For now, we'll just return the new review
  return NextResponse.json(newReview, { status: 201 })
}
