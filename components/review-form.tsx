"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarRating } from "./star-rating"
import { createReview } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { Review } from "@/lib/types"

interface ReviewFormProps {
  restaurantId: string
  onReviewSubmitted: (review: Review) => void
}

export function ReviewForm({ restaurantId, onReviewSubmitted }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [userName, setUserName] = useState("")
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma avaliação de 1 a 5 estrelas.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const newReview = await createReview(restaurantId, {
        userName: userName.trim(),
        rating,
        comment: comment.trim(),
      })

      onReviewSubmitted(newReview)

      // Reset form
      setRating(0)
      setUserName("")
      setComment("")

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por compartilhar sua experiência.",
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Erro ao enviar avaliação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Deixe sua avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Seu nome</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Sua avaliação</Label>
            <div className="flex items-center gap-2">
              <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              <span className="text-sm text-muted-foreground">
                {rating > 0 ? `${rating} estrela${rating > 1 ? "s" : ""}` : "Clique para avaliar"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte-nos sobre sua experiência..."
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
