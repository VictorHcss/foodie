"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Heart, LogOut, Menu, Receipt, User } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartButton } from "./cart-button"
import { Brand } from "./brand"
import { ThemeToggle } from "./theme-toggle"
import { UserAvatar } from "./user-avatar"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const NAV = [
  { href: "/", label: "Restaurantes" },
  { href: "/orders", label: "Meus pedidos" },
]

export function AppHeader() {
  const { state: authState, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = authState.user

  const go = (href: string) => {
    setMobileOpen(false)
    router.push(href)
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Brand />

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" || pathname.startsWith("/restaurant") : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Conta (desktop) */}
          <div className="hidden md:block">
            {!authState.ready ? (
              <div className="h-10 w-24" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium hover:bg-secondary">
                    <UserAvatar user={user} className="size-8" />
                    <span className="max-w-[10rem] truncate">{user.name.split(" ")[0]}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => go("/profile")}>
                    <User /> Meu perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => go("/orders")}>
                    <Receipt /> Meus pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => go("/profile#favoritos")}>
                    <Heart /> Favoritos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOut /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1">
                <Button variant="ghost" className="rounded-full" onClick={() => router.push("/login")}>
                  Entrar
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => router.push("/register")}>
                  Criar conta
                </Button>
              </div>
            )}
          </div>

          <CartButton />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[85vw] max-w-sm gap-0 p-0">
          <SheetHeader className="border-b p-5">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            {user ? (
              <div className="flex items-center gap-3">
                <UserAvatar user={user} className="size-11" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ) : (
              <Brand />
            )}
          </SheetHeader>
          <nav aria-label="Menu" className="flex flex-col p-3 text-[15px]">
            <MobileLink onClick={() => go("/")}>Restaurantes</MobileLink>
            {user && (
              <>
                <MobileLink onClick={() => go("/orders")}>Meus pedidos</MobileLink>
                <MobileLink onClick={() => go("/profile")}>Meu perfil</MobileLink>
                <MobileLink onClick={() => go("/profile#favoritos")}>Favoritos</MobileLink>
              </>
            )}
          </nav>
          <div className="mt-auto space-y-2 border-t p-5">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              Tema
              <ThemeToggle />
            </div>
            {user ? (
              <Button variant="outline" className="w-full rounded-full text-destructive" onClick={handleLogout}>
                <LogOut /> Sair
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => go("/login")}>
                  Entrar
                </Button>
                <Button className="rounded-full" onClick={() => go("/register")}>
                  Criar conta
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function MobileLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-lg px-3 py-3 text-left font-medium hover:bg-secondary">
      {children}
    </button>
  )
}
