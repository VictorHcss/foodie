"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/types"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="flex-1 space-y-2">
            <h4 className="font-serif font-semibold text-lg text-card-foreground">{item.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-primary">R$ {item.price.toFixed(2)}</span>
              <Button
                size="sm"
                onClick={() => onAddToCart(item)}
                className="gap-2 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
