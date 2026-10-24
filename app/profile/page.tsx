"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { SiteFooter } from "@/components/site-footer"
import { RestaurantCard } from "@/components/restaurant-card"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireUser } from "@/components/auth-gate"
import { useAuth } from "@/contexts/auth-context"
import { getOrdersByUserId } from "@/data/orders"
import { getRestaurantById } from "@/services/restaurants.service"
import { cn } from "@/lib/utils"

const AVATARS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/images/users/avatars/avatar0${n}.png`)

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function ProfilePage() {
  const auth = useRequireUser()
  const { updateProfile, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [avatar, setAvatar] = useState<string | undefined>()

  useEffect(() => {
    if (!auth.user) return
    setName(auth.user.name)
    setPhone(auth.user.phone ?? "")
    setAddress(auth.user.address ?? "")
    setAvatar(auth.user.avatar)
  }, [auth.user])

  if (!auth.user) {
    return (
      <div className="container-page py-10">
        <Skeleton className="h-24 w-full max-w-3xl rounded-3xl" />
      </div>
    )
  }

  const user = auth.user
  const dirty = name !== user.name || phone !== (user.phone ?? "") || address !== (user.address ?? "") || avatar !== user.avatar
  const favorites = (user.favoriteRestaurantIds ?? []).map(getRestaurantById).filter(Boolean) as NonNullable<ReturnType<typeof getRestaurantById>>[]
  const orderCount = getOrdersByUserId(user.id).length

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return toast.error("O nome não pode ficar vazio.")
    updateProfile({ name: name.trim(), phone, address: address.trim(), avatar })
    toast.success("Perfil salvo")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="container-page flex-1 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <UserAvatar user={{ name: name || user.name, avatar }} className="size-24 text-3xl" />
            <div>
              <h1 className="font-display text-5xl font-extrabold md:text-6xl">{user.name.split(" ")[0]}</h1>
              <p className="mt-1 text-muted-foreground">
                {user.email}
                <span className="mx-2 text-border">|</span>
                <Link href="/orders" className="underline-offset-4 hover:underline">
                  {orderCount} {orderCount === 1 ? "pedido" : "pedidos"}
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px]">
            <form onSubmit={save} className="space-y-5 rounded-3xl border p-6">
              <h2 className="font-display text-2xl font-extrabold">Seus dados</h2>
              <div>
                <Label htmlFor="name" className="mb-1.5">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5">E-mail</Label>
                <Input id="email" value={user.email} disabled className="h-12 rounded-xl" aria-describedby="email-hint" />
                <p id="email-hint" className="mt-1.5 text-xs text-muted-foreground">O e-mail é seu login e não pode ser trocado.</p>
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5">Celular</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  placeholder="(33) 99999-0000"
                  className="h-12 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="address" className="mb-1.5">Endereço de entrega</Label>
                <Input
                  id="address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade"
                  className="h-12 rounded-xl"
                />
              </div>
              <Button type="submit" disabled={!dirty} className="h-12 rounded-full px-6 font-bold">
                Salvar alterações
              </Button>
            </form>

            <div className="space-y-6">
              <fieldset className="rounded-3xl border p-6">
                <legend className="sr-only">Foto de perfil</legend>
                <p className="font-display text-2xl font-extrabold">Foto</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAvatar(undefined)}
                    aria-pressed={!avatar}
                    aria-label="Usar iniciais"
                    className={cn("relative rounded-full ring-offset-2 ring-offset-background", !avatar && "ring-2 ring-[var(--ink)] dark:ring-[var(--mustard)]")}
                  >
                    <UserAvatar user={{ name: name || user.name }} className="aspect-square w-full" />
                  </button>
                  {AVATARS.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setAvatar(src)}
                      aria-pressed={avatar === src}
                      aria-label="Escolher esta foto"
                      className={cn("relative rounded-full ring-offset-2 ring-offset-background", avatar === src && "ring-2 ring-[var(--ink)] dark:ring-[var(--mustard)]")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="aspect-square w-full rounded-full bg-secondary object-cover" />
                      {avatar === src && (
                        <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-[var(--ink)] text-white dark:bg-[var(--mustard)] dark:text-[var(--ink)]">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Salve para aplicar.</p>
              </fieldset>
              <Button
                variant="outline"
                className="w-full rounded-full text-destructive hover:text-destructive"
                onClick={() => {
                  logout()
                  router.push("/")
                }}
              >
                Sair da conta
              </Button>
            </div>
          </div>

          <section id="favoritos" aria-labelledby="fav-title" className="mt-14 scroll-mt-24">
            <h2 id="fav-title" className="font-display text-4xl font-extrabold">Favoritos</h2>
            {favorites.length === 0 ? (
              <p className="mt-3 text-muted-foreground">
                Toque no coração de um restaurante para guardar aqui.{" "}
                <Link href="/" className="font-semibold text-foreground underline underline-offset-4">
                  Ver restaurantes
                </Link>
              </p>
            ) : (
              <div className="mt-6 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((r) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
