import { Brand } from "@/components/brand"

export function AuthShell({
  headline,
  children,
}: {
  headline: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand p-10 text-[var(--ink)] lg:flex lg:flex-col">
        <Brand onBrand className="relative z-10" />
        <p className="font-display mt-auto text-[92px] font-extrabold xl:text-[112px]">{headline}</p>
        <div aria-hidden className="pointer-events-none absolute -right-16 top-24 grid size-72 place-items-center rounded-full bg-white shadow-[0_24px_60px_-24px_rgba(36,28,22,.55)]">
          <span className="text-[150px] leading-none">🍔</span>
        </div>
        <div aria-hidden className="pointer-events-none absolute right-40 top-[22rem] grid size-36 rotate-12 place-items-center rounded-full bg-white shadow-[0_18px_40px_-18px_rgba(36,28,22,.55)]">
          <span className="text-[72px] leading-none">🍟</span>
        </div>
      </aside>
      <main className="flex flex-col px-5 py-6 sm:px-10">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  )
}
