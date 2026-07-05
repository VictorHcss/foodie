"use client";

import Image from "next/image";
import { MapPin, Star, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Restaurant } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const categoryLabel = CATEGORY_LABELS[restaurant.categoriaSlug] || restaurant.categoriaSlug;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {restaurant.capa ? (
          <img
            src={restaurant.capa}
            alt={restaurant.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : restaurant.coverImage ? (
          <img
            src={restaurant.coverImage}
            alt={restaurant.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {categoryLabel}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-card-foreground line-clamp-1">
            {restaurant.nome}
          </h3>

          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              {restaurant.endereco}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">
                {restaurant.nota.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({restaurant.avaliacoes})
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{restaurant.faixaDePreco}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {restaurant.tempoEntregaMin}-{restaurant.tempoEntregaMax} min
              </span>
            </div>

            <Badge variant="outline" className="text-xs">
              {restaurant.aberto ? "Aberto" : "Fechado"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
