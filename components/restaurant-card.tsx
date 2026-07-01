"use client";

import Image from "next/image";
import { MapPin, Star, Clock, DollarSign, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Restaurant } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const { state: authState, toggleFavorite } = useAuth();
  const isFavorite = authState.user?.favoriteRestaurantIds.includes(restaurant.id) || false;

  const categoryLabel = restaurant.category
    ? CATEGORY_LABELS[restaurant.category as any] || restaurant.category
    : "Restaurante";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(restaurant.id);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {restaurant.coverImage ? (
          <Image
            src={restaurant.coverImage}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-4xl">🍽️</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {categoryLabel}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-lg text-card-foreground line-clamp-1">
            {restaurant.name}
          </h3>

          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{restaurant.address}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            {restaurant.rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                {restaurant.reviewCount !== undefined && (
                  <span className="text-muted-foreground">
                    ({restaurant.reviewCount})
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{restaurant.priceRange}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>

            <Badge variant="outline" className="text-xs">
              {restaurant.isOpenNow ? "Aberto" : "Fechado"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
