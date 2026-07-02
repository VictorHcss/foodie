"use client"

import { Plus, Minus, ShoppingBag, Trash2, ShoppingCart, ArrowRight, UtensilsCrossed } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getRestaurantById } from "@/data/restaurants"
import { createOrder } from "@/data/orders"
import { useEffect, useState } from "react"

export function CartDrawer() {
  const { state, closeCart, updateQuantity, removeItem, clearCart, getSubtotal, getDeliveryFee, getDiscount, getTotal } =
    useCart()
  const { state: authState } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<any>(null)

  useEffect(() => {
    if (state.restaurantId) {
      setRestaurant(getRestaurantById(state.restaurantId))
    }
  }, [state.restaurantId])

  const handleCheckout = () => {
    if (state.items.length === 0) return

    if (!authState.user) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para finalizar o pedido.",
        variant: "destructive",
      })
      closeCart()
      router.push("/login")
      return
    }

    if (!state.restaurantId) {
      toast({
        title: "Erro",
        description: "Restaurante não encontrado.",
        variant: "destructive",
      })
      return
    }

    const restaurant = getRestaurantById(state.restaurantId)
    if (!restaurant) {
      toast({
        title: "Erro",
        description: "Restaurante não encontrado.",
        variant: "destructive",
      })
      return
    }

    const deliveryAddress = authState.user.address || "Endereço não cadastrado"

    createOrder(
      authState.user.id,
      restaurant.id,
      restaurant.name,
      state.items.map(item => ({ menuItem: item.menuItem, quantity: item.quantity })),
      getSubtotal(),
      getDeliveryFee(),
      getDiscount(),
      getTotal(),
      deliveryAddress
    )

    toast({
      title: "Pedido realizado!",
      description: "Seu pedido foi enviado para o restaurante.",
    })

    clearCart()
    closeCart()
    router.push("/orders")
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-2 border-b border-border bg-card sticky top-0 z-10">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold">Seu Carrinho</span>
              {state.items.length > 0 && (
                <span className="text-sm text-muted-foreground font-normal">
                  {state.items.length} {state.items.length === 1 ? "item" : "itens"}
                </span>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
              <div className="bg-muted rounded-full p-8 mb-6">
                <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carrinho vazio</h3>
              <p className="text-muted-foreground mb-8">
                Adicione alguns itens deliciosos para começar!
              </p>
              <SheetClose asChild>
                <Button onClick={closeCart} className="gap-2">
                  Ver Restaurantes <ArrowRight className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              {/* Restaurant Info */}
              {restaurant && (
                <div className="px-6 py-4 bg-muted/30 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={restaurant.coverImage || "/placeholder.svg"}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{restaurant.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Badge variant="outline" className="h-5 text-xs px-1.5">
                          {restaurant.deliveryTime}
                        </Badge>
                        {restaurant.freeDelivery && (
                          <Badge className="h-5 text-xs px-1.5 bg-green-100 text-green-700 hover:bg-green-100">
                            Entrega Grátis
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.menuItem.image ? (
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-2xl">🍽️</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2">{item.menuItem.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.menuItem.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.menuItem.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary text-base">
                          R$ {(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>

                        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            className="h-8 w-8 p-0 hover:bg-background"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>

                          <span className="w-10 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="h-8 w-8 p-0 hover:bg-background"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-border bg-card p-6 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">R$ {getSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Taxa de entrega</span>
                    <span className="font-medium">
                      {getDeliveryFee() === 0 ? "Grátis" : `R$ ${getDeliveryFee().toFixed(2)}`}
                    </span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-sm items-center text-green-600">
                      <span>Desconto</span>
                      <span className="font-medium">-R$ {getDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <Separator className="my-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      R$ {getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full h-12 text-base font-semibold gap-2" 
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Finalizar Pedido
                  </Button>

                  <Button 
                    variant="ghost" 
                    onClick={clearCart} 
                    className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/5" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
