"use client";

import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";
import type { MenuItem, CartItem } from "@/lib/types";
import { getRestaurantById } from "@/services/restaurants.service";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  restaurantId?: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; restaurantId: string } }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: { items: CartItem[]; restaurantId?: string } };

interface CartContextType {
  state: CartState;
  addItem: (menuItem: MenuItem, restaurantId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, restaurantId } = action.payload;
      
      // If adding from a different restaurant, clear the cart first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          ...state,
          items: [
            {
              id: generateId(),
              menuItem,
              quantity: 1,
              restaurantId,
            },
          ],
          restaurantId,
        };
      }

      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.menuItem.id === menuItem.id && item.restaurantId === restaurantId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: generateId(),
            menuItem,
            quantity: 1,
            restaurantId,
          },
        ],
        restaurantId,
      };
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter(
        (item) => item.menuItem.id !== action.payload.itemId
      );
      return {
        ...state,
        items: filteredItems,
        restaurantId: filteredItems.length > 0 ? state.restaurantId : undefined,
      };
    }

    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        const filteredItems = state.items.filter((item) => item.menuItem.id !== itemId);
        return {
          ...state,
          items: filteredItems,
          restaurantId: filteredItems.length > 0 ? state.restaurantId : undefined,
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.menuItem.id === itemId ? { ...item, quantity } : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [], restaurantId: undefined };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "LOAD_CART":
      return { ...state, items: action.payload.items, restaurantId: action.payload.restaurantId };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("foodie-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsed });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("foodie-cart", JSON.stringify({
      items: state.items,
      restaurantId: state.restaurantId,
    }));
  }, [state.items, state.restaurantId]);

  const addItem = (menuItem: MenuItem, restaurantId: string) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurantId } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce(
      (total, item) => total + (item.menuItem.precoPromocional || item.menuItem.preco || item.menuItem.price || 0) * item.quantity,
      0
    );
  };

  const getDeliveryFee = () => {
    if (!state.restaurantId || state.items.length === 0) return 0;
    const restaurant = getRestaurantById(state.restaurantId);
    if (!restaurant) return 0;
    return (restaurant.entregaGratis || restaurant.freeDelivery) ? 0 : (restaurant.taxaEntrega || restaurant.deliveryFee || 0);
  };

  const getDiscount = () => {
    return 0; // Placeholder for future discount implementation
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() - getDiscount();
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
