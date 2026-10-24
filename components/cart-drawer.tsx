"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, MapPin, Pencil, Ticket, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { QuantityStepper } from "./quantity-stepper"
import { FoodImage } from "./food-image"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { getRestaurantById } from "@/services/restaurants.service"
import { createOrder } from "@/data/orders"
import { cartItemUnitPrice } from "@/lib/pricing"
import { formatCurrency } from "@/utils/format"
import { cn } from "@/lib/utils"

const PAYMENTS = [
  { id: "pix", label: "Pix" },
  { id: "cartao", label: "Cartão na entrega" },
  { id: "dinheiro", label: "Dinheiro" },
]

export function CartDrawer() {
  const cart = useCart()
  const { state, closeCart, updateQuantity, clearCart, getSubtotal, getDeliveryFee, getDiscount, getTotal } = cart
  const { state: auth, updateProfile } = useAuth()
  const router = useRouter()

  const restaurant = state.restaurantId ? getRestaurantById(state.restaurantId) : null
  const [address, setAddress] = useState("")
  const [editingAddress, setEditingAddress] = useState(false)
  const [payment, setPayment] = useState("pix")
  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState("")
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    setAddress(auth.user?.address ?? "")
    setEditingAddress(!auth.user?.address)
  }, [auth.user])

  const empty = state.items.length === 0
  const subtotal = getSubtotal()
  const fee = getDeliveryFee()
  const discount = getDiscount()
  const couponInvalidNow = !!cart.coupon && discount === 0

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    const res = cart.applyCoupon(couponInput)
    if (res.ok) {
      setCouponError("")
      setCouponInput("")
      toast.success(`Cupom aplicado: ${res.message}`)
    } else setCouponError(res.message)
  }

  const goLogin = () => {
    closeCart()
    router.push("/login?next=checkout")
  }

  const placeOrder = async () => {
    if (!auth.user || !restaurant) return
    if (!restaurant.aberto) {
      toast.error(`O ${restaurant.nome} está fechado agora.`)
      return
    }
    if (!address.trim()) {
      setEditingAddress(true)
      toast.error("Informe o endereço de entrega para continuar.")
      return
    }
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 600))
    if (address !== auth.user.address) updateProfile({ address: address.trim() })
    const order = createOrder({
      userId: auth.user.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.nome,
      items: state.items.map((i) => ({
        id: i.id,
        menuItem: i.menuItem,
        quantity: i.quantity,
        adicionais: i.adicionais,
        observacao: i.observacao,
        unitPrice: cartItemUnitPrice(i),
      })),
      subtotal,
      deliveryFee: fee,
      discount,
      total: getTotal(),
      deliveryAddress: address.trim(),
      couponCode: discount > 0 ? cart.coupon?.codigo : undefined,
      paymentMethod: PAYMENTS.find((p) => p.id === payment)?.label,
      etaMinutes: restaurant.tempoEntregaMax,
    })
    setPlacing(false)
    clearCart()
    closeCart()
    toast.success("Pedido feito! O restaurante já recebeu.")
    router.push(`/orders?novo=${order.id}`)
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-display text-3xl font-extrabold">Sacola</SheetTitle>
          <SheetDescription className={cn(empty && "sr-only")}>
            {restaurant ? (
              <>
                Pedido de{" "}
                <Link href={`/restaurant/${restaurant.id}`} onClick={closeCart} className="font-semibold text-foreground underline-offset-4 hover:underline">
                  {restaurant.nome}
                </Link>
              </>
            ) : (
              "Sua sacola está vazia"
            )}
          </SheetDescription>
        </SheetHeader>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="text-7xl" aria-hidden>
              🛍️
            </span>
            <p className="font-display mt-5 text-3xl font-extrabold">Sacola vazia</p>
            <p className="mt-2 text-muted-foreground">Escolha um restaurante e toque no + dos pratos para montar o pedido.</p>
            <Button
              className="mt-6 h-12 rounded-full px-6"
              onClick={() => {
                closeCart()
                router.push("/")
              }}
            >
              Ver restaurantes
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y px-6">
                {state.items.map((item) => {
                  const unit = cartItemUnitPrice(item)
                  return (
                    <li key={item.id} className="flex gap-3 py-4">
                      <div className="size-16 shrink-0 overflow-hidden rounded-xl">
                        <FoodImage
                          src={item.menuItem.imagem}
                          alt=""
                          categorySlug={item.menuItem.categoria}
                          dishName={item.menuItem.nome}
                          variant="flat"
                          emojiClassName="text-3xl"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-snug">{item.menuItem.nome}</p>
                        {!!item.adicionais?.length && (
                          <p className="mt-0.5 text-sm text-muted-foreground">+ {item.adicionais.map((a) => a.nome).join(", ")}</p>
                        )}
                        {item.observacao && <p className="mt-0.5 text-sm italic text-muted-foreground">“{item.observacao}”</p>}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper
                            size="sm"
                            removable
                            value={item.quantity}
                            onChange={(v) => updateQuantity(item.id, v)}
                            label={`Quantidade de ${item.menuItem.nome}`}
                          />
                          <span className="tabular font-semibold">{formatCurrency(unit * item.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {restaurant && (
                <div className="px-6 pb-2">
                  <Link
                    href={`/restaurant/${restaurant.id}`}
                    onClick={closeCart}
                    className="inline-flex text-sm font-semibold underline underline-offset-4"
                  >
                    Adicionar mais itens
                  </Link>
                </div>
              )}

              {/* Cupom */}
              <div className="mt-4 border-t px-6 py-5">
                {cart.coupon ? (
                  <div className={cn("flex items-center gap-3 rounded-xl border-2 border-dashed p-3", couponInvalidNow ? "border-border" : "border-success")}>
                    <Ticket className={cn("size-5", couponInvalidNow ? "text-muted-foreground" : "text-success")} />
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-bold">{cart.coupon.codigo}</p>
                      <p className="text-muted-foreground">
                        {couponInvalidNow
                          ? `Vale a partir de ${formatCurrency(cart.coupon.valorMinimoPedido)} em itens.`
                          : cart.coupon.descricao}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={cart.removeCoupon} aria-label="Remover cupom">
                      <X />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={applyCoupon}>
                    <label htmlFor="coupon" className="mb-2 block text-sm font-semibold">
                      Cupom de desconto
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase())
                          setCouponError("")
                        }}
                        placeholder="BEMVINDO10"
                        aria-invalid={!!couponError}
                        aria-describedby={couponError ? "coupon-error" : undefined}
                        className="h-11 rounded-xl uppercase"
                      />
                      <Button type="submit" variant="outline" className="h-11 rounded-xl">
                        Aplicar
                      </Button>
                    </div>
                    {couponError && (
                      <p id="coupon-error" className="mt-2 text-sm text-destructive">
                        {couponError}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Entrega e pagamento */}
              {auth.user && (
                <div className="space-y-5 border-t px-6 py-5">
                  <div>
                    <p className="mb-2 text-sm font-semibold">Entregar em</p>
                    {editingAddress ? (
                      <div className="flex gap-2">
                        <Input
                          autoFocus={editingAddress}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && address.trim() && setEditingAddress(false)}
                          placeholder="Rua, número, bairro"
                          className="h-11 rounded-xl"
                          aria-label="Endereço de entrega"
                        />
                        <Button
                          variant="outline"
                          className="h-11 rounded-xl"
                          disabled={!address.trim()}
                          onClick={() => setEditingAddress(false)}
                          aria-label="Confirmar endereço"
                        >
                          <Check />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingAddress(true)}
                        className="flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm hover:bg-secondary"
                      >
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        <span className="flex-1">{address}</span>
                        <Pencil className="size-4 shrink-0 text-muted-foreground" />
                        <span className="sr-only">Alterar endereço</span>
                      </button>
                    )}
                  </div>
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold">Pagamento na entrega</legend>
                    <div className="flex flex-wrap gap-2">
                      {PAYMENTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={payment === p.id}
                          onClick={() => setPayment(p.id)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                            payment === p.id
                              ? "border-[var(--ink)] bg-[var(--ink)] text-white dark:border-[var(--mustard)] dark:bg-[var(--mustard)] dark:text-[var(--ink)]"
                              : "hover:bg-secondary",
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="border-t bg-secondary/50 px-6 pb-6 pt-4">
              <dl className="space-y-1.5 text-sm">
                <Row label="Itens" value={formatCurrency(subtotal)} />
                <Row label="Entrega" value={fee === 0 ? "Grátis" : formatCurrency(fee)} highlight={fee === 0} />
                {discount > 0 && <Row label="Cupom" value={`− ${formatCurrency(discount)}`} highlight />}
              </dl>
              <div className="mt-3 flex items-baseline justify-between border-t pt-3">
                <span className="font-semibold">Total</span>
                <span className="tabular font-display-wide text-2xl font-extrabold">{formatCurrency(getTotal())}</span>
              </div>

              {!auth.user ? (
                <Button onClick={goLogin} className="mt-4 h-13 w-full rounded-full text-base font-bold">
                  Entrar para fazer o pedido
                </Button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={placing || (restaurant ? !restaurant.aberto : true)}
                  className="mt-4 flex h-14 w-full items-center justify-between rounded-full bg-brand px-6 text-base font-bold text-brand-foreground transition-colors hover:bg-[var(--mustard-deep)] disabled:opacity-60"
                >
                  <span>{restaurant && !restaurant.aberto ? "Restaurante fechado agora" : placing ? "Enviando pedido…" : "Fazer pedido"}</span>
                  {restaurant?.aberto && !placing && <span className="tabular">{formatCurrency(getTotal())}</span>}
                </button>
              )}
              <button onClick={clearCart} className="mt-3 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline">
                Esvaziar sacola
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("tabular font-medium", highlight && "text-success")}>{value}</dd>
    </div>
  )
}
