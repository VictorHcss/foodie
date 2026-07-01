"use client"

import Image from "next/image"
import { ArrowLeft, Star, Clock, DollarSign, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/lib/types"

interface RestaurantHeaderProps {
  restaurant: Restaurant
  onBack: () => void
}

export function RestaurantHeader({ restaurant, onBack }: RestaurantHeaderProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
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
                {restaurant.cuisine}
              </Badge>
            </div>

            <h1 className="font-serif font-bold text-3xl md:text-4xl">{restaurant.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
                <span className="text-white/80">({restaurant.reviewCount} avaliações)</span>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <Clock className="h-4 w-4" />
                <span>{restaurant.deliveryTime}</span>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <DollarSign className="h-4 w-4" />
                <span>R$ {restaurant.averagePrice} média</span>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{restaurant.neighborhood}</span>
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
            <span className="font-medium text-primary">R$ {restaurant.deliveryFee.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
