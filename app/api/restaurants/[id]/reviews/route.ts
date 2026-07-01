import { NextResponse } from "next/server"
import reviewsData from "@/data/reviews.json"
import type { Review } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let reviews: Review[] = reviewsData as Review[]
  reviews = reviews.filter((review) => review.restaurantId === id)
  return NextResponse.json(reviews)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const newReview: Review = {
    id: Date.now().toString(),
    restaurantId: id,
    userName: body.userName,
    rating: body.rating,
    comment: body.comment || "",
    date: new Date().toISOString().split("T")[0],
  }
  // In a real app, you'd save this to a database
  // For now, we'll just return the new review
  return NextResponse.json(newReview, { status: 201 })
}
