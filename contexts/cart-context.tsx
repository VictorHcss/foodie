"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import type { Adicional, CartItem, Coupon, MenuItem } from "@/lib/types"
import { getRestaurantById } from "@/services/restaurants.service"
import { cartItemUnitPrice, checkCoupon, couponDiscount, unitPriceWith, COUPONS } from "@/lib/pricing"

interface CartState {
  items: CartItem[]
  isOpen: boolean
  restaurantId?: string
  couponCode?: string
}

export interface AddItemOptions {
  quantity?: number
  adicionais?: Adicional[]
  observacao?: string
}

interface PendingAdd {
  menuItem: MenuItem
  restaurantId: string
  options: AddItemOptions
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; restaurantId: string; options: AddItemOptions } }
  | { type: "REPLACE_WITH"; payload: { menuItem: MenuItem; restaurantId: string; options: AddItemOptions } }
  | { type: "REMOVE_ITEM"; payload: { cartItemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { cartItemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_COUPON"; payload?: string }
  | { type: "LOAD_CART"; payload: { items: CartItem[]; restaurantId?: string; couponCode?: string } }

interface CartContextType {
  state: CartState
  /** Adiciona o item. Se a sacola for de outro restaurante, pede confirmação antes. */
  addItem: (menuItem: MenuItem, restaurantId: string, options?: AddItemOptions) => "added" | "needs-confirmation"
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  applyCoupon: (code: string) => { ok: boolean; message: string }
  removeCoupon: () => void
  coupon?: Coupon
  pendingAdd: PendingAdd | null
  confirmPendingAdd: () => void
  cancelPendingAdd: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getDeliveryFee: () => number
  getDiscount: () => number
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const generateId = () => Math.random().toString(36).slice(2, 11)

const lineKey = (menuItemId: string, adicionais: Adicional[] = [], observacao = "") =>
  [menuItemId, adicionais.map((a) => a.id).sort().join("+"), observacao.trim().toLowerCase()].join("|")

function makeLine(menuItem: MenuItem, restaurantId: string, options: AddItemOptions): CartItem {
  const adicionais = options.adicionais ?? []
  return {
    id: generateId(),
    menuItem,
    restaurantId,
    quantity: Math.max(1, options.quantity ?? 1),
    adicionais,
    observacao: options.observacao?.trim() || undefined,
    unitPrice: unitPriceWith(menuItem, adicionais),
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, restaurantId, options } = action.payload
      const key = lineKey(menuItem.id, options.adicionais, options.observacao)
      const idx = state.items.findIndex(
        (i) => lineKey(i.menuItem.id, i.adicionais, i.observacao ?? "") === key,
      )
      if (idx > -1) {
        const items = state.items.map((i, n) =>
          n === idx ? { ...i, quantity: i.quantity + Math.max(1, options.quantity ?? 1) } : i,
        )
        return { ...state, items }
      }
      return { ...state, items: [...state.items, makeLine(menuItem, restaurantId, options)], restaurantId }
    }

    case "REPLACE_WITH": {
      const { menuItem, restaurantId, options } = action.payload
      return { ...state, items: [makeLine(menuItem, restaurantId, options)], restaurantId, couponCode: undefined }
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload.cartItemId)
      return {
        ...state,
        items,
        restaurantId: items.length ? state.restaurantId : undefined,
        couponCode: items.length ? state.couponCode : undefined,
      }
    }

    case "UPDATE_QUANTITY": {
      const { cartItemId, quantity } = action.payload
      if (quantity <= 0) return cartReducer(state, { type: "REMOVE_ITEM", payload: { cartItemId } })
      return { ...state, items: state.items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)) }
    }

    case "CLEAR_CART":
      return { ...state, items: [], restaurantId: undefined, couponCode: undefined }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }
    case "OPEN_CART":
      return { ...state, isOpen: true }
    case "CLOSE_CART":
      return { ...state, isOpen: false }
    case "SET_COUPON":
      return { ...state, couponCode: action.payload }
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload.items ?? [],
        restaurantId: action.payload.restaurantId,
        couponCode: action.payload.couponCode,
      }
    default:
      return state
  }
}

const STORAGE_KEY = "foodie-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })
  const [hydrated, setHydrated] = useState(false)
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) })
    } catch (error) {
      console.error("Não foi possível ler a sacola salva:", error)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, restaurantId: state.restaurantId, couponCode: state.couponCode }),
      )
    } catch {}
  }, [state.items, state.restaurantId, state.couponCode, hydrated])

  const getSubtotal = useCallback(
    () => state.items.reduce((t, i) => t + cartItemUnitPrice(i) * i.quantity, 0),
    [state.items],
  )

  const getDeliveryFee = useCallback(() => {
    if (!state.restaurantId || state.items.length === 0) return 0
    const r = getRestaurantById(state.restaurantId)
    if (!r) return 0
    return r.entregaGratis || r.freeDelivery ? 0 : r.taxaEntrega || r.deliveryFee || 0
  }, [state.restaurantId, state.items.length])

  const coupon = useMemo(
    () => (state.couponCode ? COUPONS.find((c) => c.codigo === state.couponCode) : undefined),
    [state.couponCode],
  )

  const getDiscount = useCallback(() => {
    if (!coupon) return 0
    const check = checkCoupon(coupon.codigo, { subtotal: getSubtotal(), restaurantId: state.restaurantId })
    if (!check.ok) return 0
    return couponDiscount(coupon, getSubtotal(), getDeliveryFee())
  }, [coupon, getSubtotal, getDeliveryFee, state.restaurantId])

  const value: CartContextType = {
    state,
    addItem: (menuItem, restaurantId, options = {}) => {
      if (state.restaurantId && state.restaurantId !== restaurantId && state.items.length > 0) {
        setPendingAdd({ menuItem, restaurantId, options })
        return "needs-confirmation"
      }
      dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurantId, options } })
      return "added"
    },
    removeItem: (cartItemId) => dispatch({ type: "REMOVE_ITEM", payload: { cartItemId } }),
    updateQuantity: (cartItemId, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { cartItemId, quantity } }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    applyCoupon: (code) => {
      const check = checkCoupon(code, { subtotal: getSubtotal(), restaurantId: state.restaurantId })
      if (!check.ok) return { ok: false, message: check.message }
      dispatch({ type: "SET_COUPON", payload: check.coupon.codigo })
      return { ok: true, message: check.coupon.descricao }
    },
    removeCoupon: () => dispatch({ type: "SET_COUPON", payload: undefined }),
    coupon,
    pendingAdd,
    confirmPendingAdd: () => {
      if (pendingAdd) dispatch({ type: "REPLACE_WITH", payload: pendingAdd })
      setPendingAdd(null)
    },
    cancelPendingAdd: () => setPendingAdd(null),
    getTotalItems: () => state.items.reduce((t, i) => t + i.quantity, 0),
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal: () => Math.max(0, getSubtotal() + getDeliveryFee() - getDiscount()),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error("useCart precisa estar dentro de <CartProvider>")
  return context
}
