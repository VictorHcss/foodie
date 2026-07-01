"use client"

import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getRestaurantById } from "@/data/restaurants"
import { createOrder } from "@/data/orders"

export function CartDrawer() {
  const { state, closeCart, updateQuantity, removeItem, clearCart, getSubtotal, getDeliveryFee, getDiscount, getTotal } =
    useCart()
  const { state: authState } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho ({state.items.length} {state.items.length === 1 ? "item" : "itens"})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="font-medium text-lg">Carrinho vazio</h3>
                  <p className="text-muted-foreground">Adicione alguns itens deliciosos!</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-card rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={item.menuItem.image || "/placeholder.svg"}
                        alt={item.menuItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{item.menuItem.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.menuItem.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">R$ {item.menuItem.price.toFixed(2)}</span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-border pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {getSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Taxa de entrega</span>
                    <span>R$ {getDeliveryFee().toFixed(2)}</span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {getDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Finalizar Pedido
                  </Button>

                  <Button variant="outline" onClick={clearCart} className="w-full bg-transparent" size="sm">
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
