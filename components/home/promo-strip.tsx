import Link from "next/link"
import type { Restaurant } from "@/lib/types"
import { getCategoryLook } from "@/lib/visual"

/** Faixa de promoções: o desconto em tipografia grande é o "anúncio". */
export function PromoStrip({ restaurants }: { restaurants: Restaurant[] }) {
  if (!restaurants.length) return null
  return (
    <section aria-labelledby="promo-title" className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 id="promo-title" className="font-display text-3xl font-extrabold md:text-4xl">
          Promoções de hoje
        </h2>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8">
        {restaurants.map((r) => {
          const look = getCategoryLook(r.categoriaSlug)
          return (
            <Link
              key={r.id}
              href={`/restaurant/${r.id}`}
              className="group relative flex h-40 w-[280px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl p-5 outline-offset-4"
              style={{ backgroundColor: look.bg, color: look.fg }}
            >
              <span
                aria-hidden
                className="absolute -right-3 -top-3 text-[88px] leading-none transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-105"
              >
                {look.emoji}
              </span>
              <span className="relative font-display text-[64px] font-extrabold leading-[0.8]">
                {r.descontoPercentual}%
                <span className="ml-1 align-top text-xl font-bold">off</span>
              </span>
              <span className="relative">
                <span className="block truncate font-bold">{r.nome}</span>
                <span className="block truncate text-sm opacity-80">{r.cidade}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
