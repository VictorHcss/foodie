"use client"

import { useState, useEffect } from "react"
import { Star, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ReviewForm } from "./review-form"
import { getRestaurantReviews } from "@/lib/api"
import type { Review } from "@/lib/types"

interface ReviewsSectionProps {
  restaurantId: string
}

export function ReviewsSection({ restaurantId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getRestaurantReviews(restaurantId)
        setReviews(data)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [restaurantId])

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews])
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-2xl text-foreground border-b border-border pb-2">Avaliações</h2>
        <p className="text-muted-foreground">Carregando avaliações...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-2xl text-foreground border-b border-border pb-2">
          Avaliações ({reviews.length})
        </h2>
      </div>

      {/* Review Form */}
      <ReviewForm restaurantId={restaurantId} onReviewSubmitted={handleReviewSubmitted} />

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Seja o primeiro a avaliar este restaurante!</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <h3 className="font-serif font-semibold text-lg text-foreground">O que nossos clientes dizem</h3>

            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-card-foreground">{review.userName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                        </div>
                      </div>

                      {review.comment && <p className="text-muted-foreground leading-relaxed">{review.comment}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
