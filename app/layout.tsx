import type React from "react"
import type { Metadata, Viewport } from "next"
import "@fontsource-variable/bricolage-grotesque/standard.css"
import "@fontsource-variable/figtree"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { CartDrawer } from "@/components/cart-drawer"
import { CartConflictDialog } from "@/components/cart-conflict-dialog"

export const metadata: Metadata = {
  title: {
    default: "Foodie · Delivery de comida",
    template: "%s · Foodie",
  },
  description: "Peça dos restaurantes da sua cidade e acompanhe a entrega.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2b705" },
    { media: "(prefers-color-scheme: dark)", color: "#16120f" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <CartConflictDialog />
              <Toaster position="top-center" richColors closeButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
