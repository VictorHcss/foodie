"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, MapPin, RotateCcw, Wallet } from "lucide-react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRequireUser } from "@/components/auth-gate"
import { useCart } from "@/contexts/cart-context"
import { ORDER_FLOW, canCancel, cancelOrder, getOrdersByUserId, liveStatus } from "@/data/orders"
import { getRestaurantById } from "@/services/restaurants.service"
import { getCategoryLook } from "@/lib/visual"
import { cartItemUnitPrice } from "@/lib/pricing"
import { formatCurrency } from "@/utils/format"
import type { Order } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function OrdersPage() {
  const auth = useRequireUser()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [now, setNow] = useState(Date.now())
  const [highlight, setHighlight] = useState<string | null>(null)
  const [tab, setTab] = useState<"ativos" | "anteriores">("ativos")

  useEffect(() => {
    if (auth.user) setOrders(getOrdersByUserId(auth.user.id))
  }, [auth.user])

  // Atualiza o status "ao vivo" a cada 15 s.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setHighlight(new URLSearchParams(window.location.search).get("novo"))
  }, [])

  if (!auth.user || orders === null) {
    return (
      <Shell>
        <Skeleton className="h-14 w-64" />
        <Skeleton className="mt-8 h-64 w-full rounded-3xl" />
      </Shell>
    )
  }

  const isActive = (o: Order) => !["Entregue", "Cancelado"].includes(liveStatus(o, now))
  const active = orders.filter(isActive)
  const past = orders.filter((o) => !isActive(o))
  const shown = tab === "ativos" ? active : past

  const refresh = () => setOrders(getOrdersByUserId(auth.user!.id))

  return (
    <Shell>
      <h1 className="font-display text-5xl font-extrabold md:text-6xl">Meus pedidos</h1>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl bg-secondary px-6 py-16 text-center">
          <span className="text-6xl" aria-hidden>
            🧾
          </span>
          <h2 className="font-display mt-4 text-3xl font-extrabold">Nenhum pedido por enquanto</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">Quando você pedir, dá para acompanhar a entrega por aqui.</p>
          <Button asChild className="mt-6 h-12 rounded-full px-6">
            <Link href="/">Escolher restaurante</Link>
          </Button>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label="Filtrar pedidos" className="mt-6 inline-flex rounded-full bg-secondary p-1">
            {(
              [
                ["ativos", `Em andamento (${active.length})`],
                ["anteriores", `Anteriores (${past.length})`],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  tab === k ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="mt-8 text-muted-foreground">
              {tab === "ativos" ? "Nenhum pedido a caminho agora." : "Seus pedidos entregues e cancelados aparecem aqui."}
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {shown.map((o) => (
                <OrderCard key={o.id} order={o} now={now} isNew={o.id === highlight} onChange={refresh} userId={auth.user!.id} />
              ))}
            </div>
          )}
        </>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="container-page flex-1 py-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}

function OrderCard({
  order,
  now,
  isNew,
  onChange,
  userId,
}: {
  order: Order
  now: number
  isNew: boolean
  onChange: () => void
  userId: string
}) {
  const { addItem, openCart } = useCart()
  const status = liveStatus(order, now)
  const step = ORDER_FLOW.indexOf(status)
  const cancelled = status === "Cancelado"
  const done = status === "Entregue"
  const restaurant = getRestaurantById(order.restaurantId)
  const look = getCategoryLook(restaurant?.categoriaSlug)
  const eta = new Date(order.estimatedDeliveryTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  const when = new Date(order.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })

  const reorder = () => {
    let added = 0
    for (const item of order.items) {
      const r = addItem(item.menuItem, order.restaurantId, {
        quantity: item.quantity,
        adicionais: item.adicionais,
        observacao: item.observacao,
      })
      if (r === "needs-confirmation") return // o diálogo de troca de sacola assume daqui
      added += item.quantity
    }
    toast.success(`${added} ${added === 1 ? "item voltou" : "itens voltaram"} para a sacola`)
    openCart()
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl border",
        isNew && !cancelled && "ring-2 ring-[var(--mustard)] ring-offset-2 ring-offset-background",
      )}
    >
      <header className="flex items-start gap-4 p-5 sm:p-6">
        <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl text-2xl" style={{ backgroundColor: look.bg }}>
          {look.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <Link href={`/restaurant/${order.restaurantId}`} className="font-display-wide truncate text-lg font-bold hover:underline">
            {order.restaurantName}
          </Link>
          <p className="text-sm text-muted-foreground">
            Pedido {order.id}, {when}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-sm font-semibold",
            cancelled ? "bg-destructive/10 text-destructive" : done ? "bg-secondary text-muted-foreground" : "bg-brand text-brand-foreground",
          )}
        >
          {status}
        </span>
      </header>

      {!cancelled && !done && (
        <div className="px-5 pb-5 sm:px-6">
          <p className="font-display text-3xl font-extrabold">Chega por volta das {eta}</p>
          <ol className="mt-4 grid grid-cols-5 gap-1.5" aria-label="Andamento do pedido">
            {ORDER_FLOW.map((s, i) => (
              <li key={s} className="min-w-0">
                <span className={cn("block h-1.5 rounded-full", i <= step ? "bg-[var(--ink)] dark:bg-[var(--mustard)]" : "bg-border", i === step && "animate-pulse")} />
                <span
                  className={cn("mt-2 block truncate text-xs", i === step ? "font-semibold" : "text-muted-foreground")}
                  aria-current={i === step ? "step" : undefined}
                >
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid gap-6 border-t bg-secondary/40 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Itens</h3>
          <ul className="space-y-1.5 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="tabular font-semibold">{i.quantity}×</span> {i.menuItem.nome}
                  {!!i.adicionais?.length && <span className="block text-muted-foreground">+ {i.adicionais.map((a) => a.nome).join(", ")}</span>}
                </span>
                <span className="tabular shrink-0">{formatCurrency(cartItemUnitPrice(i as never) * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <dl className="space-y-1">
            <div className="flex justify-between"><dt className="text-muted-foreground">Itens</dt><dd className="tabular">{formatCurrency(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Entrega</dt><dd className="tabular">{order.deliveryFee ? formatCurrency(order.deliveryFee) : "Grátis"}</dd></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success"><dt>Cupom {order.couponCode}</dt><dd className="tabular">− {formatCurrency(order.discount)}</dd></div>
            )}
            <div className="flex justify-between border-t pt-1.5 font-semibold"><dt>Total</dt><dd className="tabular">{formatCurrency(order.total)}</dd></div>
          </dl>
          <p className="flex gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" />{order.deliveryAddress}</p>
          {order.paymentMethod && <p className="flex gap-2 text-muted-foreground"><Wallet className="mt-0.5 size-4 shrink-0" />{order.paymentMethod}</p>}
        </div>
      </div>

      <footer className="flex flex-wrap gap-2 border-t p-4 sm:px-6">
        {canCancel(order) && !cancelled ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="rounded-full text-destructive hover:text-destructive">
                Cancelar pedido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-2xl">Cancelar este pedido?</AlertDialogTitle>
                <AlertDialogDescription>
                  O {order.restaurantName} ainda não começou a preparar, então dá para cancelar sem custo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Manter pedido</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => {
                    if (cancelOrder(userId, order.id)) {
                      onChange()
                      toast("Pedido cancelado")
                    } else toast.error("Não deu para cancelar: o restaurante já começou a preparar.")
                  }}
                >
                  Cancelar pedido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
        {(done || cancelled) && (
          <Button variant="outline" className="rounded-full" onClick={reorder}>
            <RotateCcw /> Pedir de novo
          </Button>
        )}
        {done && (
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href={`/restaurant/${order.restaurantId}#avaliacoes`}>
              <Check /> Avaliar restaurante
            </Link>
          </Button>
        )}
      </footer>
    </article>
  )
}
