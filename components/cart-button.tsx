"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export function CartButton() {
  const { toggleCart, getTotalItems } = useCart()
  const itemCount = getTotalItems()

  return (
    <Button variant="outline" size="sm" onClick={toggleCart} className="relative gap-2 bg-transparent hover:bg-accent">
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Carrinho</span>
      {itemCount > 0 && (
        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Button>
  )
}
