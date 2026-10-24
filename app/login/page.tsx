"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/auth-shell"
import { FieldError, PasswordInput } from "@/components/auth/password-input"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

const DEMO = { email: "joao@example.com", password: "senha123" }

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, state } = useAuth()
  const { openCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (state.ready && state.user) router.replace("/")
  }, [state.ready, state.user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (!ok) {
      setError("E-mail ou senha não conferem. Confira e tente de novo.")
      return
    }
    toast.success("Que bom te ver de novo!")
    const next = new URLSearchParams(window.location.search).get("next")
    router.push("/")
    if (next === "checkout") setTimeout(openCart, 300)
  }

  return (
    <AuthShell
      headline={
        <>
          Bom te ver
          <br />
          de novo.
        </>
      }
    >
      <h1 className="font-display text-5xl font-extrabold">Entrar</h1>
      <p className="mt-2 text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-semibold text-foreground underline underline-offset-4">
          Crie em 1 minuto
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <Label htmlFor="email" className="mb-1.5">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1.5">Senha</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
            className="h-12 rounded-xl"
          />
          <FieldError id="login-error">{error}</FieldError>
        </div>
        <Button type="submit" className="h-12 w-full rounded-full text-base font-bold" disabled={loading || !email || !password}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <div className="mt-8 rounded-2xl bg-secondary p-4 text-sm">
        <p className="font-semibold">Só quer testar?</p>
        <p className="mt-1 text-muted-foreground">
          Use a conta de demonstração: {DEMO.email}, senha {DEMO.password}.
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail(DEMO.email)
            setPassword(DEMO.password)
            setError("")
          }}
          className="mt-2 font-semibold underline underline-offset-4"
        >
          Preencher para mim
        </button>
      </div>
    </AuthShell>
  )
}
