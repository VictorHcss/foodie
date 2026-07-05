"use client"

import Image from "next/image"
import { ArrowLeft, Star, Clock, DollarSign, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { formatCurrency } from "@/utils/format"

interface RestaurantHeaderProps {
  restaurant: Restaurant
  onBack: () => void
}

export function RestaurantHeader({ restaurant, onBack }: RestaurantHeaderProps) {
  const categoryKey = restaurant.categoriaSlug || restaurant.category || "pizza"
  const categoryLabel = CATEGORY_LABELS[categoryKey] || categoryKey
  const restaurantName = restaurant.nome || restaurant.name || "Restaurante"
  const restaurantCover = restaurant.capa || restaurant.coverImage || "/placeholder.svg"

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-100">
        <Image src={restaurantCover} alt={restaurantName} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 gap-2 bg-white/90 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {categoryLabel}
              </Badge>
            </div>

            <h1 className="font-serif font-bold text-3xl md:text-4xl">{restaurantName}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.nota.toFixed(1)}</span>
                <span className="text-white/80">({restaurant.avaliacoes} avaliações)</span>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <Clock className="h-4 w-4" />
                <span>{restaurant.tempoEntregaMin}-{restaurant.tempoEntregaMax} min</span>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <DollarSign className="h-4 w-4" />
                <span>{restaurant.faixaDePreco}</span>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.bairro || restaurant.neighborhood || restaurant.cidade}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Info Bar */}
      <div className="bg-card border-b border-border p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Taxa de entrega:</span>
            <span className="font-medium text-primary">
              {restaurant.entregaGratis || restaurant.freeDelivery ? "Grátis" : formatCurrency(restaurant.taxaEntrega || restaurant.deliveryFee || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
