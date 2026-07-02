import type { User } from "@/lib/types";

export const initialUsers: User[] = [
  {
    id: "user-1",
    name: "João Silva",
    email: "joao@example.com",
    password: "123456",
    phone: "(33) 99999-1234",
    address: "Rua das Flores, 123, Centro, Governador Valadares - MG",
    avatar: "",
    favoriteRestaurantIds: [],
  },
  {
    id: "user-2",
    name: "Maria Santos",
    email: "maria@example.com",
    password: "123456",
    phone: "(33) 98888-5678",
    address: "Av. Brasil, 456, Jardim América, Governador Valadares - MG",
    avatar: "",
    favoriteRestaurantIds: [],
  },
];
