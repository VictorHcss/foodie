// Price Range Types
export type PriceRange = "$" | "$$" | "$$$";

export enum FaixaDePreco {
  BARATO = "$",
  MEDIO = "$$",
  CARO = "$$$",
  PREMIUM = "$$$$",
}

// Order Status Types
export type OrderStatus =
  | "Recebido"
  | "Confirmado"
  | "Preparando"
  | "Saiu para entrega"
  | "Entregue"
  | "Cancelado";

export interface HorarioFuncionamento {
  abertura: string;
  fechamento: string;
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

// Adicional Type (for products)
export interface Adicional {
  id: string;
  nome: string;
  preco: number;
}

// Product/MenuItem Type (merged)
export interface Product {
  id: string;
  restaurantId: string;
  name?: string; // For backward compatibility
  nome: string;
  description?: string; // For backward compatibility
  descricao: string;
  categoria: string;
  category?: string; // For backward compatibility
  price?: number; // For backward compatibility
  preco: number;
  precoPromocional: number | null;
  ingredientes: string[];
  adicionais: Adicional[];
  observacoes: string;
  isAvailable?: boolean; // For backward compatibility
  disponivel: boolean;
  image?: string; // For backward compatibility
  imagem: string;
  isFeatured?: boolean; // For backward compatibility
  destaque?: boolean;
}
export type MenuItem = Product;

// Restaurant Type (merged)
export interface Restaurant {
  id: string;
  slug: string;
  name?: string; // For backward compatibility
  nome: string;
  description?: string; // For backward compatibility
  descricao: string;
  category?: string; // For backward compatibility
  categoriaId: string;
  categorySlug?: string; // For backward compatibility
  categoriaSlug: string;
  city?: string; // For backward compatibility
  cidadeId: string;
  cidade: string;
  state?: string; // For backward compatibility
  estado: string;
  uf: string;
  address?: string; // For backward compatibility
  endereco: string;
  neighborhood?: string; // For backward compatibility
  bairro?: string; // For backward compatibility
  phone?: string; // For backward compatibility
  telefone: string;
  whatsapp: string;
  rating?: number; // For backward compatibility
  nota: number;
  reviewCount?: number; // For backward compatibility
  avaliacoes: number;
  precoMedio: number;
  priceRange?: PriceRange; // For backward compatibility
  faixaDePreco: FaixaDePreco;
  tempoEntregaMin: number;
  tempoEntregaMax: number;
  deliveryTime?: string; // For backward compatibility
  freeDelivery?: boolean; // For backward compatibility
  entregaGratis: boolean;
  deliveryFee?: number; // For backward compatibility
  taxaEntrega: number;
  openingHours?: string[]; // For backward compatibility
  horario: HorarioFuncionamento;
  isOpenNow?: boolean; // For backward compatibility
  aberto: boolean;
  isFeatured?: boolean; // For backward compatibility
  destaque: boolean;
  patrocinado: boolean;
  emPromocao: boolean;
  descontoPercentual: number;
  lat?: number; // For backward compatibility
  latitude: number;
  lon?: number; // For backward compatibility
  longitude: number;
  tags: string[];
  logo: string;
  banner: string;
  coverImage?: string; // For backward compatibility
  capa: string;
  galleryImages?: string[]; // For backward compatibility
  createdAt: string;
  menu?: MenuItem[]; // For backward compatibility
  reviews?: Review[]; // For backward compatibility
}

// User Type
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
  isOpen?: boolean;
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

// Category Type
export interface Category {
  id: string;
  slug: string;
  nome: string;
  name?: string;
  icone: string;
  imagem: string;
  ordem: number;
}

// City Type
export interface City {
  id: string;
  slug: string;
  nome: string;
  name?: string;
  estado: string;
  uf: string;
  latitude: number;
  longitude: number;
}

// Banner & Coupon Types
export interface Banner {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem: string;
  link: string;
  restaurantId: string | null;
  ativo: boolean;
  ordem: number;
}

export interface Coupon {
  id: string;
  codigo: string;
  descricao: string;
  tipoDesconto: "percentual" | "fixo";
  valorDesconto: number;
  valorMinimoPedido: number;
  restaurantId: string | null;
  validoAte: string;
  ativo: boolean;
}

// Filter and Search Types (merged)
export interface SearchFilters {
  search?: string;
  busca?: string;
  categories?: string[];
  categoria?: string;
  cities?: string[];
  cidade?: string;
  priceRanges?: PriceRange[];
  precoMax?: number;
  minRating?: number;
  notaMin?: number;
  isOpenNow?: boolean;
  aberto?: boolean;
  isFeatured?: boolean;
  destaque?: boolean;
  entregaGratis?: boolean;
  emPromocao?: boolean;
  sortBy?: "distance" | "rating" | "price" | "name";
}

export interface RestaurantFilters {
  cidade?: string;
  categoria?: string;
  precoMax?: number;
  notaMin?: number;
  aberto?: boolean;
  entregaGratis?: boolean;
  emPromocao?: boolean;
  destaque?: boolean;
  busca?: string;
}

export interface ProductFilters {
  restaurantId?: string;
  categoria?: string;
  precoMax?: number;
  disponivel?: boolean;
  busca?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SearchResult = {
  restaurants: Restaurant[];
  products: Product[];
};

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

export const CATEGORY_LABELS: Record<string, string> = {
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
  "pizza": "Pizza",
  "hamburguer": "Hambúrguer",
  "sushi": "Sushi",
  "churrasco": "Churrasco",
  "mineira": "Comida Mineira",
  "italiana": "Italiana",
  "mexicana": "Mexicana",
  "arabe": "Árabe",
  "cafeteria": "Cafeteria",
  "padaria": "Padaria",
  "acai": "Açaí",
  "sorveteria": "Sorveteria",
  "lanches": "Lanches",
  "frutos-do-mar": "Frutos do Mar",
  "vegetariano": "Vegetariano",
  "vegano": "Vegano",
  "brasileira": "Brasileira",
  "oriental": "Oriental",
  "marmita": "Marmita",
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
