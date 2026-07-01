"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/lib/types";
import { initialUsers } from "@/data/users";

interface AuthState {
  user: User | null;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleFavorite: (restaurantId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("foodie-user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({ user });
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    // Check in initial users (for demo purposes)
    const user = initialUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setState({ user });
      localStorage.setItem("foodie-user", JSON.stringify(user));
      return true;
    }

    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    const userExists = initialUsers.some((u) => u.email === email);
    if (userExists) {
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      favoriteRestaurantIds: [],
    };

    setState({ user: newUser });
    localStorage.setItem("foodie-user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setState({ user: null });
    localStorage.removeItem("foodie-user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data };
      setState({ user: updatedUser });
      localStorage.setItem("foodie-user", JSON.stringify(updatedUser));
    }
  };

  const toggleFavorite = (restaurantId: string) => {
    if (state.user) {
      let updatedFavorites: string[];
      if (state.user.favoriteRestaurantIds.includes(restaurantId)) {
        updatedFavorites = state.user.favoriteRestaurantIds.filter(id => id !== restaurantId);
      } else {
        updatedFavorites = [...state.user.favoriteRestaurantIds, restaurantId];
      }
      const updatedUser = { ...state.user, favoriteRestaurantIds: updatedFavorites };
      setState({ user: updatedUser });
      localStorage.setItem("foodie-user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
    toggleFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
