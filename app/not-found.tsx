import Link from "next/link"
import { Brand } from "@/components/brand"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-page flex h-16 items-center">
        <Brand />
      </header>
      <main className="container-page grid flex-1 place-items-center pb-20">
        <div className="text-center">
          <p className="text-[96px] leading-none" aria-hidden>
            🍽️
          </p>
          <h1 className="font-display mt-6 text-6xl font-extrabold md:text-7xl">Prato vazio</h1>
          <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
            Essa página não existe ou o restaurante saiu do Foodie. Volte para a lista e escolha outro.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-7 font-bold text-brand-foreground hover:bg-[var(--mustard-deep)]"
          >
            Ver restaurantes
          </Link>
        </div>
      </main>
    </div>
  )
}
