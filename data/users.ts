import type { User } from "@/lib/types";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialUsers: User[] = [
  {
    id: generateId(),
    name: "João Silva",
    email: "joao@example.com",
    password: "123456",
    phone: "(33) 99999-1234",
    address: "Rua das Flores, 123, Centro, Governador Valadares - MG",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    favoriteRestaurantIds: [],
  },
  {
    id: generateId(),
    name: "Maria Santos",
    email: "maria@example.com",
    password: "123456",
    phone: "(33) 98888-5678",
    address: "Av. Brasil, 456, Jardim América, Governador Valadares - MG",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    favoriteRestaurantIds: [],
  },
];
