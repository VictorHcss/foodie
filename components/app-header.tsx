"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartButton } from "./cart-button"
import { CartDrawer } from "./cart-drawer"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppHeader() {
  const { state: authState, logout } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-2xl text-primary">Foodie</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {authState.user ? (
                <>
                  <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Meus Pedidos
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span>{authState.user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <User className="h-4 w-4 mr-2" />
                        Perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/orders")}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Pedidos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                    Entrar
                  </Button>
                  <Button size="sm" onClick={() => router.push("/register")}>
                    Cadastrar
                  </Button>
                </div>
              )}
              <CartButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <CartButton />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-border">
              <div className="flex flex-col gap-3">
                {authState.user ? (
                  <>
                    <div className="text-sm text-muted-foreground">Olá, {authState.user.name}!</div>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => { router.push("/profile"); setIsMobileMenuOpen(false); }}>
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => { router.push("/orders"); setIsMobileMenuOpen(false); }}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Pedidos
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start" onClick={() => { router.push("/login"); setIsMobileMenuOpen(false); }}>
                      Entrar
                    </Button>
                    <Button size="sm" onClick={() => { router.push("/register"); setIsMobileMenuOpen(false); }}>
                      Cadastrar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <CartDrawer />
    </>
  )
}
