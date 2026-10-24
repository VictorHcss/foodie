"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { initialUsers } from "@/data/users"

interface AuthState {
  user: User | null
  /** true depois que a sessão salva no navegador foi lida. */
  ready: boolean
}

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  toggleFavorite: (restaurantId: string) => boolean
  isFavorite: (restaurantId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_KEY = "foodie-user"
const USERS_KEY = "foodie-users"

/** Usuários de demonstração + os cadastrados neste navegador. */
function readUsers(): User[] {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[]
    const emails = new Set(saved.map((u) => u.email.toLowerCase()))
    return [...saved, ...initialUsers.filter((u) => !emails.has(u.email.toLowerCase()))]
  } catch {
    return initialUsers
  }
}

function saveUser(user: User) {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[]
    const others = saved.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase())
    localStorage.setItem(USERS_KEY, JSON.stringify([...others, user]))
  } catch {}
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, ready: false })

  useEffect(() => {
    let user: User | null = null
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) user = JSON.parse(saved)
    } catch (error) {
      console.error("Não foi possível ler a sessão salva:", error)
    }
    setState({ user, ready: true })
  }, [])

  const persist = (user: User | null) => {
    setState({ user, ready: true })
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      saveUser(user)
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  const login = async (email: string, password: string) => {
    await wait(450)
    const user = readUsers().find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    )
    if (!user) return false
    persist({ ...user, favoriteRestaurantIds: user.favoriteRestaurantIds ?? [] })
    return true
  }

  const register = async (name: string, email: string, password: string) => {
    await wait(450)
    if (readUsers().some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return false
    persist({
      id: Math.random().toString(36).slice(2, 11),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      favoriteRestaurantIds: [],
    })
    return true
  }

  const logout = () => persist(null)

  const updateProfile = (data: Partial<User>) => {
    if (state.user) persist({ ...state.user, ...data })
  }

  const isFavorite = (id: string) => !!state.user?.favoriteRestaurantIds?.includes(id)

  const toggleFavorite = (id: string) => {
    if (!state.user) return false
    const current = state.user.favoriteRestaurantIds ?? []
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    persist({ ...state.user, favoriteRestaurantIds: next })
    return next.includes(id)
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateProfile, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error("useAuth precisa estar dentro de <AuthProvider>")
  return context
}
