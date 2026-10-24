"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, MapPin, MessageCircle, Phone, ShoppingBag, Tag } from "lucide-react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { SiteFooter } from "@/components/site-footer"
import { FoodImage } from "@/components/food-image"
import { FavoriteButton } from "@/components/favorite-button"
import { RestaurantMeta } from "@/components/restaurant-meta"
import { MenuSection } from "@/components/menu-section"
import { ReviewsSection } from "@/components/reviews-section"
import { ProductDialog } from "@/components/restaurant/product-dialog"
import { getRestaurantById } from "@/services/restaurants.service"
import { getProductsByRestaurant } from "@/services/products.service"
import { useCart } from "@/contexts/cart-context"
import { getCategoryLook, initials } from "@/lib/visual"
import { hasPromo } from "@/lib/pricing"
import { formatCurrency } from "@/utils/format"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RestaurantPageProps {
  params: Promise<{ id: string }>
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = use(params)
  const products = useMemo(() => getProductsByRestaurant(id), [id])
  const [selected, setSelected] = useState<Product | null>(null)
  const cart = useCart()
  const restaurant = getRestaurantById(id)
  if (!restaurant) notFound()
  const look = getCategoryLook(restaurant.categoriaSlug)

  const promos = products.filter(hasPromo)
  const rest = products.filter((p) => !hasPromo(p))
  const sections = [
    { id: "promocoes", title: "Em promoção", items: promos },
    { id: "cardapio", title: promos.length ? "Cardápio" : "Cardápio completo", items: rest },
  ].filter((s) => s.items.length)

  const sameRestaurant = cart.state.restaurantId === restaurant.id
  const cartCounts = sameRestaurant
    ? cart.state.items.reduce<Record<string, number>>((acc, i) => {
        acc[i.menuItem.id] = (acc[i.menuItem.id] ?? 0) + i.quantity
        return acc
      }, {})
    : {}
  const itemsHere = sameRestaurant ? cart.getTotalItems() : 0

  const quickAdd = (p: Product) => {
    if (!restaurant.aberto) {
      toast.error(`O ${restaurant.nome} está fechado agora. Abre às ${restaurant.horario.abertura}.`)
      return
    }
    if (p.adicionais?.length) {
      setSelected(p)
      return
    }
    const result = cart.addItem(p, restaurant.id)
    if (result === "added") toast.success(`${p.nome} na sacola`, { action: { label: "Ver sacola", onClick: cart.openCart } })
  }

  const whatsapp = restaurant.whatsapp ? `https://wa.me/${restaurant.whatsapp}` : null

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      {/* Capa */}
      <div className="relative h-48 overflow-hidden sm:h-64 md:h-72">
        <FoodImage
          src={restaurant.capa || restaurant.coverImage}
          alt=""
          categorySlug={restaurant.categoriaSlug}
          variant="flat"
          emojiClassName="text-[140px] md:text-[200px] opacity-90 rotate-[-8deg] translate-x-[28vw]"
        />
        <div className="container-page absolute inset-x-0 top-4 flex justify-between">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-[var(--ink)] shadow-sm backdrop-blur hover:bg-white"
          >
            <ArrowLeft className="size-4" />
            Restaurantes
          </Link>
          <FavoriteButton restaurantId={restaurant.id} restaurantName={restaurant.nome} className="size-10" />
        </div>
      </div>

      <main className="container-page flex-1 pb-28">
        {/* Identidade */}
        <div className="relative -mt-12 flex flex-col gap-5 md:-mt-14 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div
              aria-hidden
              className="grid size-24 shrink-0 place-items-center rounded-3xl border-4 border-background font-display text-4xl font-extrabold shadow-lg md:size-28 md:text-5xl"
              style={{ backgroundColor: look.fg, color: look.bg }}
            >
              {initials(restaurant.nome)}
            </div>
            <div className="pb-1">
              <OpenStatus open={restaurant.aberto} abertura={restaurant.horario.abertura} fechamento={restaurant.horario.fechamento} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            <h1 className="font-display text-5xl font-extrabold md:text-7xl">{restaurant.nome}</h1>
            <p className="mt-2 text-muted-foreground">
              {look.label} em {restaurant.cidade}, {restaurant.uf}
              <span className="mx-2 text-border">|</span>
              {restaurant.faixaDePreco} <span className="text-sm">(média de {formatCurrency(restaurant.precoMedio)} por pedido)</span>
            </p>
            <RestaurantMeta restaurant={restaurant} className="mt-3 text-[15px]" />

            {restaurant.emPromocao && restaurant.descontoPercentual > 0 && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--pimenta)]/10 px-4 py-2 text-sm font-semibold text-[var(--pimenta)]">
                <Tag className="size-4" />
                Até {restaurant.descontoPercentual}% off em pratos selecionados
              </p>
            )}

            {restaurant.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {restaurant.tags.map((t) => (
                  <span key={t} className="rounded-full border px-3 py-1 text-sm capitalize text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Navegação do cardápio */}
            <nav
              aria-label="Seções do cardápio"
              className="sticky top-16 z-20 -mx-4 mt-8 flex gap-1 overflow-x-auto border-b bg-background/90 px-4 py-2 backdrop-blur md:-mx-8 md:px-8 no-scrollbar"
            >
              {[...sections, { id: "avaliacoes", title: "Avaliações" }, { id: "info", title: "Informações" }].map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                    s.id === "info" && "lg:hidden",
                  )}
                >
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="mt-8 space-y-12">
              {sections.length === 0 && (
                <p className="rounded-2xl bg-secondary p-8 text-center text-muted-foreground">
                  Este restaurante ainda não publicou o cardápio.
                </p>
              )}
              {sections.map((s) => (
                <MenuSection
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  items={s.items}
                  onOpen={setSelected}
                  onQuickAdd={quickAdd}
                  cartCounts={cartCounts}
                  disabled={!restaurant.aberto}
                />
              ))}

              <ReviewsSection restaurantId={restaurant.id} restaurantName={restaurant.nome} />

              <div id="info" className="scroll-mt-32 lg:hidden">
                <InfoPanel restaurant={restaurant} whatsapp={whatsapp} />
              </div>
            </div>
          </div>

          {/* Lateral */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl bg-secondary p-6">
                <h2 className="font-display text-2xl font-extrabold">Sua sacola</h2>
                {itemsHere > 0 ? (
                  <>
                    <ul className="mt-4 space-y-2 text-sm">
                      {cart.state.items.slice(0, 5).map((i) => (
                        <li key={i.id} className="flex justify-between gap-3">
                          <span className="truncate">
                            <span className="tabular font-semibold">{i.quantity}×</span> {i.menuItem.nome}
                          </span>
                        </li>
                      ))}
                      {cart.state.items.length > 5 && (
                        <li className="text-muted-foreground">e mais {cart.state.items.length - 5}</li>
                      )}
                    </ul>
                    <button
                      onClick={cart.openCart}
                      className="mt-5 flex h-12 w-full items-center justify-between rounded-full bg-brand px-5 font-bold text-brand-foreground hover:bg-[var(--mustard-deep)]"
                    >
                      <span>Ver sacola</span>
                      <span className="tabular">{formatCurrency(cart.getTotal())}</span>
                    </button>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {restaurant.aberto
                      ? "Toque no + de um prato para começar o pedido."
                      : `Fechado agora. Você pode ver o cardápio e pedir a partir das ${restaurant.horario.abertura}.`}
                  </p>
                )}
              </div>
              <InfoPanel restaurant={restaurant} whatsapp={whatsapp} />
            </div>
          </aside>
        </div>
      </main>

      {/* Barra da sacola no celular */}
      {itemsHere > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur lg:hidden animate-in slide-in-from-bottom-4">
          <button
            onClick={cart.openCart}
            className="flex h-14 w-full items-center justify-between rounded-full bg-brand px-5 font-bold text-brand-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="size-5" />
              Ver sacola
              <span className="tabular rounded-full bg-[var(--ink)] px-2 text-xs leading-6 text-white">{itemsHere}</span>
            </span>
            <span className="tabular">{formatCurrency(cart.getTotal())}</span>
          </button>
        </div>
      )}

      <SiteFooter />

      <ProductDialog product={selected} restaurant={restaurant} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  )
}

function OpenStatus({ open, abertura, fechamento }: { open: boolean; abertura: string; fechamento: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold",
        open ? "bg-success/12 text-success" : "bg-secondary text-muted-foreground",
      )}
    >
      <span className={cn("size-2 rounded-full", open ? "bg-success" : "bg-muted-foreground")} aria-hidden />
      {open ? `Aberto até ${fechamento}` : `Fechado. Abre às ${abertura}`}
    </span>
  )
}

function InfoPanel({
  restaurant,
  whatsapp,
}: {
  restaurant: NonNullable<ReturnType<typeof getRestaurantById>>
  whatsapp: string | null
}) {
  return (
    <div className="rounded-3xl border p-6">
      <h2 className="font-display text-2xl font-extrabold">Informações</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{restaurant.descricao}</p>
      <dl className="mt-5 space-y-4 text-sm">
        <InfoRow icon={<MapPin />} label="Endereço">
          {restaurant.endereco}
        </InfoRow>
        <InfoRow icon={<Clock />} label="Horário">
          Todos os dias, das {restaurant.horario.abertura} às {restaurant.horario.fechamento}
        </InfoRow>
        {restaurant.telefone && (
          <InfoRow icon={<Phone />} label="Telefone">
            <a href={`tel:${restaurant.telefone.replace(/\D/g, "")}`} className="font-medium underline-offset-4 hover:underline">
              {restaurant.telefone}
            </a>
          </InfoRow>
        )}
      </dl>
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold hover:bg-secondary"
        >
          <MessageCircle className="size-4" />
          Falar no WhatsApp
        </a>
      )}
    </div>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4" aria-hidden>
        {icon}
      </span>
      <div>
        <dt className="font-semibold">{label}</dt>
        <dd className="text-muted-foreground">{children}</dd>
      </div>
    </div>
  )
}
