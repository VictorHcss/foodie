"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { StarRating } from "./star-rating"
import { UserAvatar } from "./user-avatar"
import { addReview, getReviews } from "@/lib/reviews"
import { useAuth } from "@/contexts/auth-context"
import type { Review } from "@/lib/types"

export function ReviewsSection({ restaurantId, restaurantName }: { restaurantId: string; restaurantName: string }) {
  const { state } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [writing, setWriting] = useState(false)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")

  useEffect(() => setReviews(getReviews(restaurantId)), [restaurantId])
  useEffect(() => {
    if (state.user) setName(state.user.name)
  }, [state.user])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return toast.error("Diga seu nome para publicar a avaliação.")
    if (!rating) return toast.error("Escolha uma nota de 1 a 5 estrelas.")
    const review = addReview({
      restaurantId,
      userId: state.user?.id ?? "anon",
      userName: name.trim(),
      rating,
      comment: comment.trim(),
    })
    setReviews((list) => [review, ...list])
    setRating(0)
    setComment("")
    setWriting(false)
    toast.success("Avaliação publicada")
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <section id="avaliacoes" aria-labelledby="reviews-title" className="scroll-mt-32">
      <div className="flex items-end justify-between gap-4">
        <h2 id="reviews-title" className="font-display text-3xl font-extrabold">
          Quem pediu, conta
        </h2>
        {!writing && (
          <Button variant="outline" className="rounded-full" onClick={() => setWriting(true)}>
            Avaliar
          </Button>
        )}
      </div>

      {writing && (
        <form onSubmit={submit} className="mt-5 space-y-4 rounded-2xl border p-5 animate-in fade-in slide-in-from-top-1">
          <p className="font-semibold">Como foi seu pedido no {restaurantName}?</p>
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          {!state.user && (
            <div>
              <label htmlFor="rv-name" className="mb-1.5 block text-sm font-medium">
                Seu nome
              </label>
              <Input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" />
            </div>
          )}
          <div>
            <label htmlFor="rv-comment" className="mb-1.5 block text-sm font-medium">
              Comentário <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <Textarea
              id="rv-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="O que estava bom? O que poderia melhorar?"
              className="rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full">
              Publicar avaliação
            </Button>
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => setWriting(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        !writing && (
          <p className="mt-4 text-muted-foreground">
            Ninguém avaliou ainda.{" "}
            <button className="font-semibold text-foreground underline underline-offset-4" onClick={() => setWriting(true)}>
              Seja a primeira pessoa
            </button>
            .
          </p>
        )
      ) : (
        <ul className="mt-5 divide-y">
          {reviews.map((r) => (
            <li key={r.id} className="flex gap-3 py-5">
              <UserAvatar user={{ name: r.userName }} className="size-10 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold">{r.userName}</span>
                  <StarRating rating={r.rating} readonly size="sm" />
                  <time className="text-sm text-muted-foreground" dateTime={r.date}>
                    {fmt(r.date)}
                  </time>
                </div>
                {r.comment && <p className="mt-1.5 leading-relaxed">{r.comment}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
