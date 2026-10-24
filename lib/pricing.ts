import type { CartItem, Coupon, Product, Adicional } from "@/lib/types"
import couponsJson from "@/data/coupons.json"

export function basePrice(product: Product): number {
  const promo = product.precoPromocional
  const full = product.preco ?? product.price ?? 0
  return promo !== null && promo !== undefined && promo > 0 && promo < full ? promo : full
}

export function hasPromo(product: Product): boolean {
  const promo = product.precoPromocional
  return promo !== null && promo !== undefined && promo > 0 && promo < (product.preco ?? 0)
}

export function unitPriceWith(product: Product, adicionais: Adicional[] = []) {
  return basePrice(product) + adicionais.reduce((t, a) => t + a.preco, 0)
}

export function cartItemUnitPrice(item: CartItem) {
  return item.unitPrice ?? unitPriceWith(item.menuItem, item.adicionais)
}

export const COUPONS = couponsJson as Coupon[]

export type CouponCheck =
  | { ok: true; coupon: Coupon }
  | { ok: false; message: string }

export function checkCoupon(
  code: string,
  ctx: { subtotal: number; restaurantId?: string; today?: Date },
): CouponCheck {
  const coupon = COUPONS.find((c) => c.codigo.toLowerCase() === code.trim().toLowerCase())
  if (!coupon || !coupon.ativo) return { ok: false, message: "Esse cupom não existe. Confira o código." }

  const today = ctx.today ?? new Date()
  const limit = new Date(`${coupon.validoAte}T23:59:59`)
  if (today > limit) return { ok: false, message: "Esse cupom já expirou." }

  if (coupon.restaurantId && coupon.restaurantId !== ctx.restaurantId)
    return { ok: false, message: "Esse cupom não vale para este restaurante." }

  if (ctx.subtotal < coupon.valorMinimoPedido)
    return {
      ok: false,
      message: `Falta pouco: o cupom vale para pedidos a partir de ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(coupon.valorMinimoPedido)}.`,
    }

  return { ok: true, coupon }
}

export function couponDiscount(coupon: Coupon, subtotal: number, deliveryFee: number) {
  if (coupon.tipoDesconto === "percentual") return round(subtotal * (coupon.valorDesconto / 100))
  // Cupom fixo de frete: desconta até o valor da taxa; os demais descontam do subtotal.
  if (/frete/i.test(coupon.codigo)) return round(Math.min(coupon.valorDesconto, deliveryFee))
  return round(Math.min(coupon.valorDesconto, subtotal))
}

const round = (n: number) => Math.round(n * 100) / 100
