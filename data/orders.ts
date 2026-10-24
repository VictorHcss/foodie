import type { Order, OrderStatus } from "@/lib/types"

/**
 * Pedidos ficam no navegador (localStorage), por usuário.
 * O status avança sozinho com o tempo, simulando o restaurante.
 */
const key = (userId: string) => `foodie-orders-${userId}`

function read(userId: string): Order[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(key(userId)) || "[]") as Order[]
  } catch {
    return []
  }
}

function write(userId: string, orders: Order[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(key(userId), JSON.stringify(orders))
}

export const ORDER_FLOW: OrderStatus[] = ["Recebido", "Confirmado", "Preparando", "Saiu para entrega", "Entregue"]

/** Minutos desde a criação em que cada etapa começa. */
const STEP_AT_MINUTES = [0, 1, 3, 12, 30]

export function liveStatus(order: Order, now = Date.now()): OrderStatus {
  if (order.status === "Cancelado") return "Cancelado"
  const elapsed = (now - new Date(order.createdAt).getTime()) / 60000
  let step = 0
  STEP_AT_MINUTES.forEach((m, i) => {
    if (elapsed >= m) step = i
  })
  return ORDER_FLOW[step]
}

export function canCancel(order: Order) {
  const s = liveStatus(order)
  return s === "Recebido" || s === "Confirmado"
}

export function getOrdersByUserId(userId: string): Order[] {
  return read(userId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function getOrderById(userId: string, orderId: string): Order | null {
  return read(userId).find((o) => o.id === orderId) ?? null
}

export function createOrder(input: Omit<Order, "id" | "createdAt" | "status" | "estimatedDeliveryTime"> & {
  etaMinutes: number
}): Order {
  const now = new Date()
  const { etaMinutes, ...rest } = input
  const order: Order = {
    ...rest,
    id: `FD-${now.getTime().toString(36).toUpperCase().slice(-6)}`,
    createdAt: now.toISOString(),
    status: "Recebido",
    estimatedDeliveryTime: new Date(now.getTime() + etaMinutes * 60000).toISOString(),
  }
  write(order.userId, [order, ...read(order.userId)])
  return order
}

export function cancelOrder(userId: string, orderId: string): Order | null {
  const orders = read(userId)
  const idx = orders.findIndex((o) => o.id === orderId)
  if (idx === -1 || !canCancel(orders[idx])) return null
  orders[idx] = { ...orders[idx], status: "Cancelado" }
  write(userId, orders)
  return orders[idx]
}
