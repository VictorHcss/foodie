"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FoodImage } from "@/components/food-image"
import { Price } from "@/components/price"
import { QuantityStepper } from "@/components/quantity-stepper"
import type { Adicional, Product, Restaurant } from "@/lib/types"
import { unitPriceWith } from "@/lib/pricing"
import { formatCurrency } from "@/utils/format"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"

export function ProductDialog({
  product,
  restaurant,
  onOpenChange,
}: {
  product: Product | null
  restaurant: Restaurant
  onOpenChange: (open: boolean) => void
}) {
  const { addItem, openCart } = useCart()
  const [qty, setQty] = useState(1)
  const [extras, setExtras] = useState<Adicional[]>([])
  const [note, setNote] = useState("")

  useEffect(() => {
    if (product) {
      setQty(1)
      setExtras([])
      setNote("")
    }
  }, [product])

  if (!product) return null
  const total = unitPriceWith(product, extras) * qty
  const blocked = !restaurant.aberto || !product.disponivel
  const realIngredients = product.ingredientes?.filter((i) => !/selecionado|especial da casa/i.test(i)) ?? []

  const toggle = (a: Adicional) =>
    setExtras((list) => (list.some((x) => x.id === a.id) ? list.filter((x) => x.id !== a.id) : [...list, a]))

  const add = () => {
    const result = addItem(product, restaurant.id, { quantity: qty, adicionais: extras, observacao: note })
    onOpenChange(false)
    if (result === "added") {
      toast.success(`${qty > 1 ? `${qty}× ` : ""}${product.nome} na sacola`, {
        action: { label: "Ver sacola", onClick: openCart },
      })
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="flex max-h-[92dvh] flex-col">
          <div className="overflow-y-auto">
            <div className="aspect-[16/10] w-full">
              <FoodImage
                src={product.imagem || product.image}
                alt={product.nome}
                categorySlug={product.categoria}
                dishName={product.nome}
                emojiClassName="text-8xl"
              />
            </div>
            <div className="space-y-5 p-6">
              <div>
                <DialogTitle className="font-display text-3xl font-extrabold">{product.nome}</DialogTitle>
                <DialogDescription className="mt-2 text-[15px] leading-relaxed">{product.descricao}</DialogDescription>
                <Price product={product} className="mt-3 text-lg" />
              </div>

              {realIngredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {realIngredients.map((i) => (
                    <span key={i} className="rounded-full bg-secondary px-3 py-1 text-sm">
                      {i}
                    </span>
                  ))}
                </div>
              )}

              {product.adicionais?.length > 0 && (
                <fieldset>
                  <legend className="mb-1 font-semibold">Adicionais</legend>
                  <p className="mb-3 text-sm text-muted-foreground">Opcional. Escolha quantos quiser.</p>
                  <div className="divide-y rounded-2xl border">
                    {product.adicionais.map((a) => {
                      const on = extras.some((x) => x.id === a.id)
                      return (
                        <button
                          key={a.id}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggle(a)}
                          className="flex w-full items-center gap-3 px-4 py-3.5 text-left first:rounded-t-2xl last:rounded-b-2xl hover:bg-secondary/60"
                        >
                          <span
                            className={cn(
                              "grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
                              on ? "border-[var(--ink)] bg-[var(--ink)] text-white dark:border-[var(--mustard)] dark:bg-[var(--mustard)] dark:text-[var(--ink)]" : "border-input",
                            )}
                          >
                            {on && <Check className="size-3.5" strokeWidth={3} />}
                          </span>
                          <span className="flex-1">{a.nome}</span>
                          <span className="tabular text-sm text-muted-foreground">+ {formatCurrency(a.preco)}</span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              <div>
                <label htmlFor="obs" className="mb-2 block font-semibold">
                  Alguma observação?
                </label>
                <Textarea
                  id="obs"
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 140))}
                  placeholder="Ex.: sem cebola, ponto da carne mal passado"
                  rows={2}
                  className="resize-none rounded-xl"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground tabular">{note.length}/140</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t bg-background p-4">
            <QuantityStepper value={qty} onChange={setQty} />
            <Button onClick={add} disabled={blocked} className="h-12 flex-1 justify-between rounded-full bg-brand px-6 text-base font-bold text-brand-foreground hover:bg-[var(--mustard-deep)]">
              {blocked ? (
                <span className="w-full text-center">{product.disponivel ? "Restaurante fechado agora" : "Indisponível hoje"}</span>
              ) : (
                <>
                  <span>Adicionar</span>
                  <span className="tabular">{formatCurrency(total)}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
