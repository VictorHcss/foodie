import type { Order } from "@/lib/types";

let orders: Order[] = [
  // You can add initial orders here if needed
];

export function getOrdersByUserId(userId: string): Order[] {
  // Load from localStorage
  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem(`foodie-orders-${userId}`);
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }
  }
  return orders.filter(o => o.userId === userId);
}

export function createOrder(order: Order): Order {
  orders.push(order);
  
  // Save to localStorage
  if (typeof window !== "undefined") {
    const userOrders = orders.filter(o => o.userId === order.userId);
    localStorage.setItem(`foodie-orders-${order.userId}`, JSON.stringify(userOrders));
  }
  
  return order;
}

export function cancelOrder(orderId: string): Order | null {
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], status: "Cancelado" };
  
  // Save to localStorage
  if (typeof window !== "undefined") {
    const userId = orders[index].userId;
    const userOrders = orders.filter(o => o.userId === userId);
    localStorage.setItem(`foodie-orders-${userId}`, JSON.stringify(userOrders));
  }
  
  return orders[index];
}
