import type { Order, User, MenuItem } from "@/lib/types";

const generateId = () => Math.random().toString(36).substr(2, 9);

// In-memory orders storage (would be replaced by a database in production)
let orders: Order[] = [];

// Flag to track if we've loaded from localStorage
let loadedFromStorage = false;

// Load orders from localStorage (only called client-side)
const loadOrdersFromStorage = () => {
  if (typeof window !== "undefined" && !loadedFromStorage) {
    loadedFromStorage = true;
    const savedOrders = localStorage.getItem("foodie-orders");
    if (savedOrders) {
      try {
        orders = JSON.parse(savedOrders);
      } catch (error) {
        console.error("Error loading orders from localStorage:", error);
      }
    }
  }
};

// Save orders to localStorage
const saveOrders = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("foodie-orders", JSON.stringify(orders));
  }
};

export const createOrder = (
  userId: string,
  restaurantId: string,
  restaurantName: string,
  items: { menuItem: MenuItem; quantity: number }[],
  subtotal: number,
  deliveryFee: number,
  discount: number,
  total: number,
  deliveryAddress: string
): Order => {
  const order: Order = {
    id: generateId(),
    userId,
    restaurantId,
    restaurantName,
    items: items.map((item) => ({
      id: generateId(),
      menuItem: item.menuItem,
      quantity: item.quantity,
    })),
    subtotal,
    deliveryFee,
    discount,
    total,
    status: "Recebido",
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: "30-45 min",
    deliveryAddress,
  };

  orders.unshift(order); // Add to beginning
  saveOrders();
  return order;
};

export const getOrdersByUserId = (userId: string): Order[] => {
  loadOrdersFromStorage();
  return orders.filter((order) => order.userId === userId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  loadOrdersFromStorage();
  return orders.find((order) => order.id === orderId);
};

export const updateOrderStatus = (orderId: string, status: Order["status"]): Order | undefined => {
  loadOrdersFromStorage();
  const index = orders.findIndex((order) => order.id === orderId);
  if (index === -1) return undefined;

  orders[index] = { ...orders[index], status };
  saveOrders();
  return orders[index];
};

export const cancelOrder = (orderId: string): Order | undefined => {
  return updateOrderStatus(orderId, "Cancelado");
};
