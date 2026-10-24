import Link from "next/link"
import { Brand } from "./brand"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary/60">
      <div className="container-page flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Brand />
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Comida dos restaurantes da sua cidade, do pedido até a porta.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/" className="hover:underline">Restaurantes</Link>
          <Link href="/orders" className="hover:underline">Meus pedidos</Link>
          <Link href="/profile" className="hover:underline">Meu perfil</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Foodie</p>
      </div>
    </footer>
  )
}
