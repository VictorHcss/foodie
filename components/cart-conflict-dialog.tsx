"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCart } from "@/contexts/cart-context"
import { getRestaurantById } from "@/services/restaurants.service"
import { toast } from "sonner"

/** Pergunta antes de trocar a sacola de restaurante (antes, ela era esvaziada em silêncio). */
export function CartConflictDialog() {
  const { pendingAdd, confirmPendingAdd, cancelPendingAdd, state } = useCart()
  const current = state.restaurantId ? getRestaurantById(state.restaurantId) : null
  const next = pendingAdd ? getRestaurantById(pendingAdd.restaurantId) : null

  return (
    <AlertDialog open={!!pendingAdd} onOpenChange={(open) => !open && cancelPendingAdd()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl">Começar uma sacola nova?</AlertDialogTitle>
          <AlertDialogDescription>
            Sua sacola tem itens de <strong className="text-foreground">{current?.nome ?? "outro restaurante"}</strong>.
            Cada pedido sai de um restaurante só. Se continuar, esses itens saem e entra{" "}
            <strong className="text-foreground">{pendingAdd?.menuItem.nome}</strong>
            {next ? ` de ${next.nome}` : ""}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Manter sacola atual</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const name = pendingAdd?.menuItem.nome
              confirmPendingAdd()
              toast.success(`${name} está na sacola`)
            }}
          >
            Começar nova sacola
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
