"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { useAuth } from "@/contexts/auth-context"
import { getOrdersByUserId, cancelOrder } from "@/data/orders"
import type { Order } from "@/lib/types"
import { ShoppingBag, Clock, MapPin, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const STATUS_COLORS: Record<Order["status"], "default" | "secondary" | "destructive" | "outline"> = {
  "Recebido": "secondary",
  "Confirmado": "default",
  "Preparando": "default",
  "Saiu para entrega": "default",
  "Entregue": "outline",
  "Cancelado": "destructive",
}

export default function OrdersPage() {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authState.user) {
      router.push("/login")
      return
    }
    setOrders(getOrdersByUserId(authState.user.id))
  }, [authState.user, router])

  if (!authState.user) {
    return null
  }

  const handleCancelOrder = (orderId: string) => {
    const updated = cancelOrder(orderId)
    if (updated) {
      setOrders(getOrdersByUserId(authState.user.id))
      toast({
        title: "Pedido cancelado",
        description: "Seu pedido foi cancelado com sucesso.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-3xl text-foreground mb-8">Meus Pedidos</h1>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Nenhum pedido ainda</h3>
                <p className="text-muted-foreground mb-6">Você ainda não fez nenhum pedido.</p>
                <Button onClick={() => router.push("/")}>
                  Ver Restaurantes
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{order.restaurantName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge variant={STATUS_COLORS[order.status]}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Itens</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.menuItem.name}</span>
                              <span className="font-medium">
                                R$ {(item.menuItem.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Resumo</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>R$ {order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxa de entrega</span>
                            <span>R$ {order.deliveryFee.toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Desconto</span>
                              <span>-R$ {order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold pt-2 border-t border-border">
                            <span>Total</span>
                            <span className="text-primary">R$ {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                          <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            Endereço de entrega
                          </h4>
                          <p className="text-sm">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    {(order.status === "Recebido" || order.status === "Confirmado") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="mt-2"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancelar Pedido
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
