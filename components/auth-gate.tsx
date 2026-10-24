"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

/** Espera a sessão carregar; se não houver usuário, manda para o login. */
export function useRequireUser() {
  const { state } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (state.ready && !state.user) router.replace("/login")
  }, [state.ready, state.user, router])
  return state
}
