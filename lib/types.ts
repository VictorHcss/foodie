// Price Range Types
export type PriceRange = "$" | "$$" | "$$$";

// Order Status Types
export type OrderStatus =
  | "Recebido"
  | "Confirmado"
  | "Preparando"
  | "Saiu para entrega"
  | "Entregue"
  | "Cancelado";

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lon: number;
  phone: string;
  website?: string;
  openingHours: string[];
  coverImage: string;
  galleryImages: string[];
  deliveryTime: string;
  deliveryFee: number;
  freeDelivery: boolean;
  isOpenNow: boolean;
  isFeatured: boolean;
  tags: string[];
  menu: MenuItem[];
  reviews: Review[];
}

// Menu Item Types
export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

// Review Types
export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  avatar?: string;
  favoriteRestaurantIds: string[];
}

// Cart Types
export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
}

export interface Cart {
  items: CartItem[];
  restaurantId?: string;
}

// Order Types
export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
}

// Filter and Search Types
export interface SearchFilters {
  search?: string;
  categories?: string[];
  cities?: string[];
  priceRanges?: PriceRange[];
  minRating?: number;
  isOpenNow?: boolean;
  isFeatured?: boolean;
  sortBy?: "distance" | "rating" | "price" | "name";
}

// Category Definitions
export const RESTAURANT_CATEGORIES = [
  "Pizza",
  "Hambúrguer",
  "Sushi",
  "Churrasco",
  "Comida Mineira",
  "Italiana",
  "Mexicana",
  "Árabe",
  "Cafeteria",
  "Padaria",
  "Açaí",
  "Sorveteria",
  "Lanches",
  "Frutos do Mar",
  "Vegetariano",
  "Vegano",
] as const;

export type RestaurantCategory = (typeof RESTAURANT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<RestaurantCategory, string> = {
  "Pizza": "Pizza",
  "Hambúrguer": "Hambúrguer",
  "Sushi": "Sushi",
  "Churrasco": "Churrasco",
  "Comida Mineira": "Comida Mineira",
  "Italiana": "Italiana",
  "Mexicana": "Mexicana",
  "Árabe": "Árabe",
  "Cafeteria": "Cafeteria",
  "Padaria": "Padaria",
  "Açaí": "Açaí",
  "Sorveteria": "Sorveteria",
  "Lanches": "Lanches",
  "Frutos do Mar": "Frutos do Mar",
  "Vegetariano": "Vegetariano",
  "Vegano": "Vegano",
};

export const MENU_ITEM_CATEGORIES = [
  "Entradas",
  "Pratos Principais",
  "Acompanhamentos",
  "Bebidas",
  "Sobremesas",
  "Lanches",
  "Pizzas",
  "Sushis",
  "Cafés",
] as const;

export type MenuItemCategory = (typeof MENU_ITEM_CATEGORIES)[number];

// Geoapify Types (kept for future use)
export interface GeoapifyFeature {
  type: string;
  properties: {
    place_id: string;
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
    lat: number;
    lon: number;
    formatted?: string;
    categories?: string[];
    phone?: string;
    website?: string;
    details?: any;
    datasource?: any;
    rank?: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export interface GeoapifyResponse {
  type: string;
  features: GeoapifyFeature[];
  query?: any;
}
